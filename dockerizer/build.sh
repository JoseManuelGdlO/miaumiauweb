#!/bin/bash

# Construir la imagen Docker con limpieza de cache (misma idea que catmate-control-center)
set -euo pipefail
echo "🧹 Limpiando cache local..."

npm cache clean --force
rm -rf node_modules
rm -rf dist

echo "🐳 Limpiando cache de Docker..."
docker system prune -f
docker builder prune -f

echo "🔨 Construyendo imagen Docker..."
docker build -f dockerizer/Dockerfile -t miaumiauweb:latest .

echo "✅ Build completado."
