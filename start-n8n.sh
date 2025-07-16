#!/bin/bash

# n8nをDockerで起動するスクリプト

echo "Starting n8n with Docker..."

docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  -e N8N_HOST=localhost \
  -e N8N_PORT=5678 \
  -e N8N_PROTOCOL=http \
  -e NODE_ENV=production \
  -e WEBHOOK_URL=http://localhost:5678/ \
  -e GENERIC_TIMEZONE=Asia/Tokyo \
  -v n8n_data:/home/node/.n8n \
  -v ./local-files:/files \
  docker.n8n.io/n8nio/n8n

echo "n8n is starting..."
echo "Access n8n at: http://localhost:5678"
echo "Username: admin"
echo "Password: password"