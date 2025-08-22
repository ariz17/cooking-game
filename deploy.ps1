# PowerShell script for building and deploying the Docker image

# Build the Docker image
Write-Host "Building Docker image..."
docker build -t cooking-game .

# Run the Docker container locally
Write-Host "Running Docker container locally..."
docker run -p 8080:8080 cooking-game

Write-Host "Application is running at http://localhost:8080"
Write-Host "Press Ctrl+C to stop the container"