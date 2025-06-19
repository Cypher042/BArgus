# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app/api
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o app .


EXPOSE 8080

ENTRYPOINT ["./app"]