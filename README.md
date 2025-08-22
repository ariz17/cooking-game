# Cooking Game

A fun cooking game built with Spring Boot and JavaScript.

## Deployment to Render

This project is configured to be deployed to Render using Docker. Follow these steps to deploy your game:

### Prerequisites

1. Create a [Render](https://render.com/) account if you don't have one
2. Install [Git](https://git-scm.com/downloads) if you haven't already
3. Make sure your project is in a Git repository

### Deployment Steps

#### Option 1: Deploy using render.yaml (Recommended)

1. Push your code to a GitHub repository
2. Log in to your Render account
3. Click on the "New" button and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure your service
6. Click "Apply" to start the deployment

#### Option 2: Manual Deployment

1. Push your code to a GitHub repository
2. Log in to your Render account
3. Click on the "New" button and select "Web Service"
4. Connect your GitHub repository
5. Select "Docker" as the environment
6. Configure the service with the following settings:
   - Name: cooking-game (or your preferred name)
   - Region: Choose the region closest to your users
   - Branch: main (or your default branch)
   - Root Directory: Leave empty if your Dockerfile is in the root, otherwise specify
   - Environment Variables: Add `SPRING_PROFILES_ACTIVE=prod`
7. Click "Create Web Service" to start the deployment

### Running Locally with Docker

To run the application locally using Docker:

```bash
# Build and start the container
docker-compose up --build

# Access the application at http://localhost:8080
```

## Game Features

- Choose your chef character
- Select kitchen background
- Prepare various recipes
- Serve customers with their orders
- Track your score

## Technologies Used

- Spring Boot (Backend)
- JavaScript (Frontend)
- HTML/CSS
- Docker for containerization