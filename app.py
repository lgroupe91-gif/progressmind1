#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            html_content = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProgressMind - Test Serveur</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .header {
            background: rgba(255,255,255,0.15);
            padding: 30px;
            border-radius: 20px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .success {
            background: rgba(76, 175, 80, 0.3);
            border: 2px solid #4CAF50;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
            box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            margin: 15px 0;
            border-radius: 15px;
            transition: transform 0.3s ease;
        }
        .feature:hover {
            transform: translateY(-5px);
            background: rgba(255,255,255,0.2);
        }
        .port-info {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            margin-top: 30px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { font-size: 2.5em; margin-bottom: 10px; }
        h2 { font-size: 1.8em; margin-bottom: 15px; }
        h3 { font-size: 1.3em; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 ProgressMind</h1>
            <p style="font-size: 1.2em;">Application de Développement Personnel</p>
        </div>
        
        <div class="success">
            <h2>✅ SERVEUR PYTHON FONCTIONNEL !</h2>
            <p style="font-size: 1.1em;">L'application ProgressMind est maintenant accessible</p>
            <p><strong>Port: 8080 | Serveur: Python HTTP</strong></p>
        </div>
        
        <div class="feature">
            <h3>🌅 Routines Matinales</h3>
            <p>Méditation, étirements, lecture inspirante</p>
        </div>
        
        <div class="feature">
            <h3>🎯 Gestion d'Objectifs</h3>
            <p>Méthode SMART pour atteindre tes rêves</p>
        </div>
        
        <div class="feature">
            <h3>🙏 Journal de Gratitude</h3>
            <p>Cultive la reconnaissance quotidienne</p>
        </div>
        
        <div class="feature">
            <h3>📊 Suivi de Progression</h3>
            <p>Calendrier et statistiques détaillées</p>
        </div>
        
        <div class="port-info">
            <p><strong>🌐 Navigateur:</strong> Microsoft Edge ✅</p>
            <p><strong>📍 URL:</strong> http://localhost:8080</p>
            <p><strong>🔧 Serveur:</strong> Python HTTP Server</p>
        </div>
    </div>
</body>
</html>
            """
            
            self.wfile.write(html_content.encode('utf-8'))
        else:
            super().do_GET()

try:
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🎉 SERVEUR PYTHON DÉMARRÉ AVEC SUCCÈS !")
        print(f"📍 URL: http://localhost:{PORT}")
        print(f"🌐 Navigateur: Microsoft Edge")
        print(f"✅ Prêt à recevoir les connexions...")
        httpd.serve_forever()
except Exception as e:
    print(f"❌ Erreur: {e}")