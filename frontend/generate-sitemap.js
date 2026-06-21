import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://byfalguni.com';

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
];

async function generateSitemap() {
  try {
    const stream = new SitemapStream({ hostname: BASE_URL });
    
    const xmlData = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
      data.toString()
    );

    const destinationPath = path.join(__dirname, 'public', 'sitemap.xml');

    fs.writeFileSync(destinationPath, xmlData);
    console.log('Success! sitemap.xml was generated in your public folder.');
  } catch (error) {
    console.error('There was an error generating the sitemap:', error);
  }
}

generateSitemap();