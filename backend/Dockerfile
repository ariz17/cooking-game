FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml ./

# Download dependencies
RUN apt-get update && apt-get install -y maven
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Expose port (Render will override this with PORT env var)
EXPOSE $PORT

# Run the application
CMD ["java", "-jar", "target/cooking-game-0.0.1-SNAPSHOT.jar"]