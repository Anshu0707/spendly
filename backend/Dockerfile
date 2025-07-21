# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jdk

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Make the mvnw executable
RUN chmod +x mvnw

# Download dependencies (this step is cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY . .

# Make the mvnw executable AGAIN (after copying all files)
RUN chmod +x mvnw

# Build the application
RUN ./mvnw package -DskipTests

# Expose the port (Render will set the PORT env variable)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/expense-tracker-0.0.1-SNAPSHOT.jar"]