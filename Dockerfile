# Use a base image with Java installed
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven build file and source code
COPY .mvn .mvn
COPY mvnw pom.xml ./
COPY src ./src

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Build the application using Maven
RUN ./mvnw package -DskipTests

# Expose the port your application will listen on
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "target/cooking-game-0.0.1-SNAPSHOT.jar"]