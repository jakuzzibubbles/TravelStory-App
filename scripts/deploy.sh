#!/bin/bash
docker-compose build
docker-compose push
docker-compose up -d
echo "Application deployed."
