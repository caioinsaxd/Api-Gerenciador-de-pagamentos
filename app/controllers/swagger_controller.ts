import type { HttpContext } from '@adonisjs/core/http'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default class SwaggerController {
  async index({ response }: HttpContext) {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Gerenciador de Pagamentos</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
    .token-input-container {
      padding: 10px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .token-input-container input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .token-input-container button {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .token-input-container button:hover {
      background: #0056b3;
    }
  </style>
</head>
<body>
  <div class="token-input-container">
    <label for="jwt-token"><strong>Token JWT:</strong></label>
    <input type="text" id="jwt-token" placeholder="Cole seu token JWT aqui..." />
    <button id="set-token">Definir Token</button>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script>
    let token = localStorage.getItem('jwt_token') || '';
    
    document.getElementById('jwt-token').value = token;
    
    document.getElementById('set-token').addEventListener('click', function() {
      token = document.getElementById('jwt-token').value;
      localStorage.setItem('jwt_token', token);
      alert('Token definido! Use o botão "Authorize" nas rotas protegidas.');
    });

    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis
        ],
        layout: 'BaseLayout',
        persistAuthorization: true,
        initOAuth: {
          clientId: 'swagger-client',
        }
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
