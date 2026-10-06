#!/bin/bash

set -e

echo "Pulling latest code..."
git pull origin production

echo "Building and starting frontend..."
docker compose up -d --build

echo "Cleaning unused images..."
docker image prune -f

echo "Deployment completed!"
docker compose ps