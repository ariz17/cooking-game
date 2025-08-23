# Cooking Game

A fun cooking game built with Spring Boot and JavaScript.

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

## Project Structure

This project is separated into two parts for deployment to Render:

### Frontend

The frontend is a static web application built with HTML, CSS, and JavaScript. It's located in the `frontend` directory.

### Backend

The backend is a Spring Boot application written in Java. It's located in the `backend` directory.

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

##### Frontend Deployment

1. Connect your Git repository to Render
2. Create a new Web Service
3. Select the `frontend` directory as the root directory
4. Set the environment to Node.js
5. Set the build command to `npm install`
6. Set the start command to `npm start`

##### Backend Deployment

1. Connect your Git repository to Render
2. Create a new Web Service
3. Select the `backend` directory as the root directory
4. Set the environment to Docker
5. Set the environment variable `SPRING_PROFILES_ACTIVE` to `prod`

## Local Development

### Running Locally with Docker

To run the application locally using Docker:

```bash
# Build and start the container
docker-compose up --build

# Access the application at http://localhost:8080
```

### Manual Local Setup

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### Backend

```bash
cd backend
./mvnw spring-boot:run
```
