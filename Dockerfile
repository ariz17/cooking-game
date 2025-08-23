# Stage 1: Build the Java application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine AS frontend-builder
WORKDIR /app/frontend
COPY --from=build /app/src/main/resources/static ./
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Stage 3: The final image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=frontend-builder /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/
COPY --from=frontend-builder /app/frontend /app/frontend

EXPOSE 80
ENTRYPOINT ["java", "-jar", "app.jar"]