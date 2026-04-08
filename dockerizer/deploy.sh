#!/bin/bash

# Despliegue local con Docker (misma idea que catmate-control-center)
set -euo pipefail
echo "🚀 Iniciando despliegue con limpieza de cache..."

echo "🧹 Limpiando cache local completo..."
npm cache clean --force
rm -rf node_modules
rm -rf dist
rm -rf .vite

echo "🐳 Limpiando cache de Docker..."
docker system prune -af
docker builder prune -af
docker volume prune -f

echo "🔨 Construyendo imagen Docker sin cache..."
docker build --no-cache -f dockerizer/Dockerfile -t miaumiauweb:latest .

echo "⏹️ Parando contenedores existentes..."
docker stop miaumiauweb 2>/dev/null || true
docker rm miaumiauweb 2>/dev/null || true

echo "▶️ Ejecutando nuevo contenedor..."
docker run -d \
  --name miaumiauweb \
  -p 80:80 \
  --restart unless-stopped \
  miaumiauweb:latest

echo "✅ Despliegue completado."
echo "🌐 http://localhost"
