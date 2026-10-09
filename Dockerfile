# Đóng gói sàn ApexCore Sovereign Exchange
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY backend/ .
RUN go build -o apexcore-server cmd/api-server/main.go
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/apexcore-server .
COPY frontend/ ./frontend/
EXPOSE 5000
CMD ["./apexcore-server"]
