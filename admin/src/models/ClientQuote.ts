// admin/src/models/ClientQuote.ts
import mongoose, { Schema } from 'mongoose';

const ClientQuoteSchema = new Schema(
  {
    fullName: { type: String, default: 'Unnamed Client' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    emailPhone: { type: String, default: '' },
    countryName: { type: String, default: 'India' },
    countryCode: { type: String, default: 'IN' },
    countryFlag: { type: String, default: 'IN' },
    region: { type: String, enum: ['INDIA', 'INTL'], default: 'INDIA' },
    businessName: { type: String, default: '' },
    businessDescription: { type: String, default: '' },
    mainGoal: { type: String, default: '' },
    launchDateReason: { type: String, default: '' },
    rushDelivery: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    deliveryDate: { type: String, default: '' },
    designReferences: { type: String, default: '' },
    budget: { type: Number, default: 0 },
    clientDescription: { type: String, default: '' },
    clientFolder: { type: String, default: '' },
    source: { type: String, enum: ['WEBAPP', 'MANUAL'], default: 'WEBAPP' },
    signedAgreementPdfUrl: { type: String, default: '' },
    signedAgreementFileId: { type: String, default: '' },
    signedAgreementText: { type: String, default: '' },
    agreedAt: { type: String, default: '' },
    uploadedAssets: [
      {
        fileId: String,
        name: String,
        url: String,
        size: Number,
      },
    ],
    simpleChoices: { type: Schema.Types.Mixed, default: {} },
    complexConfig: { type: Schema.Types.Mixed, default: {} },
    evaluatedQuote: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['NEW', 'REVIEWED', 'CONFIRMED', 'COMPLETED', 'ARCHIVED'],
      default: 'NEW',
    },
  },
  { timestamps: true }
);

export const ClientQuoteModel =
  mongoose.models.ClientQuote || mongoose.model('ClientQuote', ClientQuoteSchema);