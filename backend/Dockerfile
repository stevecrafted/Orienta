FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy maven wrapper and pom first to leverage cache
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw || true

# copy source and build
COPY src ./src
RUN ./mvnw -B -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
