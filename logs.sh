#!/bin/bash

# Define the containers
containers=("project_root_frontend_1" "project_root_backend_1")

# Create an empty output file
touch combined_logs.txt

# Loop through each container and append logs to the output file
for container in "${containers[@]}"; do
  docker logs "$container" >> combined_logs.txt
done
