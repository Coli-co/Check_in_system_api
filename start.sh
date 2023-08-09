#/bin/bash

docker compose build
docker compose up -d

# Wait for the containers' warning up
sleep 3
npm run seed
