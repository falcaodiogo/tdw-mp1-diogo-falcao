#!/bin/bash

docker-compose up -d

echo "Waiting for Jenkins to start..."
sleep 30

echo "Initial Admin Password:"
docker exec my-jenkins cat /var/jenkins_home/secrets/initialAdminPassword

echo "Jenkins is running at: http://localhost:8080"