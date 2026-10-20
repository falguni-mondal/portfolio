// admin/src/lib/exchangeRateCron.ts
import cron from 'node-cron';
import { connectDB } from './mongodb';
import { PricingConfigModel } from '@/models/PricingConfig';

declare global {
  // eslint-disable-next-line no-var
  var exchangeCronStarted: boolean | undefined;
}

export async function syncExchangeRateFromApi(recalculateUsdItems = true) {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    console.warn('EXCHANGE_RATE_API_KEY is not set in .env.local');
    return null;
  }

  try {
    await connectDB();
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/inr`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`ExchangeRate API returned status ${res.status}`);

    const data = await res.json();
    const usdPerInr = Number(data?.conversion_rates?.USD);
    if (!usdPerInr || usdPerInr <= 0) {
      throw new Error('Invalid USD conversion rate in API response');
    }

    const inrPerUsd = Number((1 / usdPerInr).toFixed(2));

    let doc = await PricingConfigModel.findOne({ singletonKey: 'MASTER_PRICING' });
    if (!doc) {
      doc = await PricingConfigModel.create({ singletonKey: 'MASTER_PRICING' });
    }

    const updatedRates = { ...(doc.rates || {}) };
    if (recalculateUsdItems) {
      // Playbook Section 1 & 4 formula: USD = (Billed INR * usdPerInr) * (1.30 / 0.97)
      const crossBorderFactor = 1.3 / 0.97;
      for (const key of Object.keys(updatedRates)) {
        const inrVal = Number(updatedRates[key]?.inr || 0);
        if (inrVal > 0) {
          updatedRates[key] = {
            inr: inrVal,
            usd: Math.max(1, Math.round(inrVal * usdPerInr * crossBorderFactor)),
          };
        }
      }
    }

    const updatedFreeHostingUsd = Math.round(
      Number(doc.freeHostingThresholdInr || 33000) * usdPerInr * (1.3 / 0.97)
    );

    const saved = await PricingConfigModel.findOneAndUpdate(
      { singletonKey: 'MASTER_PRICING' },
      {
        $set: {
          usdPerInrRate: usdPerInr,
          exchangeRateInrPerUsd: inrPerUsd,
          exchangeRateLastUpdated: new Date(),
          freeHostingThresholdUsd: updatedFreeHostingUsd,
          rates: updatedRates,
        },
      },
      { new: true, upsert: true }
    ).lean();

    return saved;
  } catch (err) {
    console.error('ExchangeRate sync failed:', err);
    return null;
  }
}

export function initExchangeRateCron() {
  if (global.exchangeCronStarted) return;
  global.exchangeCronStarted = true;

  // Run every 12 hours at minute 0 (00:00 and 12:00)
  cron.schedule('0 */12 * * *', () => {
    console.log('[Cron] Running 12-hour INR -> USD ExchangeRate sync...');
    syncExchangeRateFromApi(true).catch((e) => console.error(e));
  });
}