#!/bin/bash

set -e

echo "Pulling latest code..."
git pull origin main

echo "Building new image (current containers keep serving)..."
docker compose build

for svc in frontend_a frontend_b; do
  echo "Updating $svc..."
  docker compose up -d --no-deps "$svc"

  echo "Waiting for $svc to become healthy..."
  for i in $(seq 1 60); do
    status=$(docker inspect -f '{{.State.Health.Status}}' "$svc")
    [ "$status" = "healthy" ] && break
    if [ "$i" = 60 ]; then
      echo "$svc did not become healthy, aborting (other container still serving)."
      exit 1
    fi
    sleep 2
  done
done

echo "Cleaning unused images..."
docker image prune -f

echo "Deployment completed!"
docker compose ps
