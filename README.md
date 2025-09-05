# E-commerce Microservices Application

A comprehensive e-commerce platform built with microservices architecture, featuring user authentication, product management, order processing, and real-time inventory management.

## Architecture Overview

This application follows a microservices architecture with the following components:

- **API Gateway** (Port 3003) - Central entry point routing requests to appropriate services
- **Auth Service** (Port 3000) - User management and authentication with Google OAuth
- **Product Service** (Port 3001) - Product CRUD operations, categories, and colors management
- **Order Service** (Port 3002) - Cart management and order processing with stock updates
- **Frontend** (Port 5173) - React/Vite web application with TypeScript and Tailwind CSS

### Supporting Infrastructure

- **MongoDB** - Separate databases for users, products, and orders
- **RabbitMQ** - Message queue for asynchronous communication between services
- **Cloudinary** - Image storage and management for product images

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB instance
- RabbitMQ instance
- Cloudinary account (for image management)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ecommerce-microservices.git
cd ecommerce-microservices
```

2. **Set up environment variables**
```bash
# Create .env files for each service
# Auth Service (.env)
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Product Service (.env)
MONGO_URI=mongodb://localhost:27017/product_db
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RABBITMQ_URL=amqp://localhost:5672

# Order Service (.env)
MONGO_URI=mongodb://localhost:27017/order_db
RABBITMQ_URL=amqp://localhost:5672
```

3. **Start all services**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:3003
- Auth Service: http://localhost:3000
- Product Service: http://localhost:3001
- Order Service: http://localhost:3002
- RabbitMQ Management: http://localhost:15672 (guest/guest)

### Option 2: Local Development


## 🏗️ System Architecture & Database Schema
![System Architecture & Database Schema ](.utils/Images/diagram.png)
