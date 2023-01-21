export const defaultMainFile = 'App.html';
export const ifile = 'ok.ts';
export const map = 'import-map.json';

export const ifileCode = `console.log(111, 'ok');
export const ok = 111;`;

export const welcomeCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <div>1111</div>
</html>

`.trim();

export const mapCode = `{
  "imports": {
    "vue": "https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js"
  }
}`;
