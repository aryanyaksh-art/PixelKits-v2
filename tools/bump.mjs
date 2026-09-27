// Stamps every script/stylesheet link in index.html with ?v=<timestamp> so browsers load the newest
// files after each push (GitHub Pages lets browsers cache files for 10 minutes). Run before committing.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const f = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const v = Date.now().toString(36);
const html = fs.readFileSync(f, 'utf8').replace(/((?:src|href)="(?:src\/[^"?]+\.js|style\.css))(\?v=[^"]*)?"/g, `$1?v=${v}"`);
fs.writeFileSync(f, html);
console.log('stamped', v);
