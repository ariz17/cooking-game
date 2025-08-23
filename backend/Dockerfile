FROM openjdk:17-jdk-slim

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy Maven files first for better caching
COPY pom.xml ./
COPY mvnw ./
COPY mvnw.cmd ./
COPY .mvn ./.mvn

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Expose port
EXPOSE 10000

# Run the application with proper JVM settings for containers
CMD ["java", "-Xmx512m", "-Xms256m", "-jar", "target/cooking-game-0.0.1-SNAPSHOT.jar"]