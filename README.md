# Cooking Game

This project is separated into two parts for deployment to Render:

## Frontend

The frontend is a static web application built with HTML, CSS, and JavaScript. It's located in the `frontend` directory.

### Deployment

To deploy the frontend to Render:

1. Connect your Git repository to Render
2. Create a new Web Service
3. Select the `frontend` directory as the root directory
4. Set the environment to Node.js
5. Set the build command to `npm install`
6. Set the start command to `npm start`

## Backend

The backend is a Spring Boot application written in Java. It's located in the `backend` directory.

### Deployment

To deploy the backend to Render:

1. Connect your Git repository to Render
2. Create a new Web Service
3. Select the `backend` directory as the root directory
4. Set the environment to Docker
5. Set the environment variable `SPRING_PROFILES_ACTIVE` to `prod`

## Local Development

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```