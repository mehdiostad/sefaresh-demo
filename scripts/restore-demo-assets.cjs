const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
// Recover the exact vector artwork already included in the original source.
async function main() {
  const source = fs.readFileSync('src/Icons.js', 'utf8');
  const svgs = {};
  for (const name of ['CafeElmBG', 'CafeElmLogo', 'CafeElmText']) {
    const part = source.split('export const ' + name + ' =')[1];
    svgs[name] = part.match(/<svg\b[\s\S]*?<\/svg>/)[0].replaceAll('{color}', '"#BE1E2D"').replaceAll('{...props}', '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  }
  const theme = 'public/themes/cafe_elm', logos = 'public/demo-assets/userLogos';
  fs.mkdirSync(theme, { recursive: true }); fs.mkdirSync(logos, { recursive: true }); fs.mkdirSync('public/demo', { recursive: true });
  fs.writeFileSync(path.join(logos, 'cafe-elm.svg'), svgs.CafeElmLogo);
  await sharp(Buffer.from(svgs.CafeElmText)).resize({ width: 700 }).png().toFile(path.join(theme, 'cafe_elm.png'));
  await sharp(Buffer.from(svgs.CafeElmBG.replaceAll('#BE1E2D', '#333333'))).resize({ width: 300 }).webp().toFile(path.join(theme, 'bg-pattern.webp'));
  const fallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="480" fill="#f5f5f4"/><g fill="none" stroke="#a8a29e" stroke-width="6" stroke-linecap="round"><path d="M250 192h128v76c0 75-128 75-128 0z"/><path d="M378 204h18c58 0 58 65-18 65M236 328h158M281 151c-20-18 20-26 0-45M319 151c-20-18 20-26 0-45M357 151c-20-18 20-26 0-45"/></g><text x="320" y="402" font-family="sans-serif" font-size="20" fill="#78716c" text-anchor="middle">Demo · original image not supplied</text></svg>`;
  fs.writeFileSync('public/demo/item-placeholder.svg', fallback);
  for (const name of ['heart.png', 'coffee-beans.png', 'drink.png', 'breakfast.png', 'instagram.png']) {
    await sharp(Buffer.from(svgs.CafeElmLogo)).resize(160, 160).png().toFile('public/' + name);
  }
  for (const name of ['CafeMarya1.jpg', 'CafeMarya2.jpg', 'CafeMarya3.jpg', 'CafeMarya4.jpg', 'CafeMarya5.jpg', 'dashboard-dark.jpg', 'dashboard-light.jpg', 'signup.webp', 'login.webp']) {
    const format = name.endsWith('webp') ? 'webp' : 'jpeg';
    await sharp(Buffer.from(fallback)).resize(1200, 750).toFormat(format).toFile('public/' + name);
  }
  fs.writeFileSync('public/ASSETS-NOTE.md', 'The source ZIP did not include public/. Cafe Elm logo, text and pattern here are recovered from src/Icons.js. Item photos and historical images use explicitly marked fallback assets. Replace with originals to restore exact visual fidelity.\n');
  console.log('Recovered Cafe Elm vectors. Missing photos use labelled fallbacks.');
}
main().catch(e => { console.error(e); process.exitCode = 1; });
