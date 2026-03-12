import type { HttpContext } from '@adonisjs/core/http'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default class SwaggerController {
  async index({ response }: HttpContext) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Gateway Manager API - Swagger</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis
        ],
        layout: 'BaseLayout'
      });
    };
  </script>
</body>
</html>
`

    response.header('Content-Type', 'text/html')
    return html
  }

  async spec({ response }: HttpContext) {
    const specPath = join(process.cwd(), 'openapi.json')
    const spec = readFileSync(specPath, 'utf-8')
    
    response.header('Content-Type', 'application/json')
    return spec
  }
}
