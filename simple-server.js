const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>RoutineMind - Test</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 50px;
          margin: 0;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 20px;
          max-width: 500px;
          margin: 0 auto;
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        p { font-size: 1.2em; }
        .success { color: #4ade80; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 RoutineMind</h1>
        <p class="success">✅ SERVEUR FONCTIONNEL SUR PORT 3000 !</p>
        <p>Si tu vois cette page, le serveur marche parfaitement !</p>
        <p>🎯 Application de développement personnel</p>
        <p>💪 De petites actions pour de grands objectifs</p>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 SERVEUR DÉMARRÉ AVEC SUCCÈS !');
  console.log(`✅ Va sur: http://localhost:${PORT}`);
  console.log(`🌐 Ou essaie: http://127.0.0.1:${PORT}`);
});
</command>