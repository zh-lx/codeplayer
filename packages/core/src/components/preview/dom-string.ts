export const renderIframeString = (importMap: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CS-IDE</title>
    <script
    async
    rel"modulepreload"
    src="https://unpkg.com/es-module-shims@1.5.18/dist/es-module-shims.wasm.js"
    ></script>
    <script type="importmap">
      ${importMap}
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;
