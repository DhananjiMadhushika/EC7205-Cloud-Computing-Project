#!/bin/bash
# deploy.sh - Linux/Mac Deployment Script for E-commerce Microservices

set -e  # Exit on any error

echo "===================================="
echo "E-commerce Microservices Deployment"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$1/8]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    print_error "Minikube is not installed or not in PATH"
    echo "Please install Minikube first: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    echo "Please install kubectl first"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    echo "Please install Docker first"
    exit 1
fi

# Start Minikube if not running
print_status 1 "Starting Minikube..."
if minikube status | grep -q "Running"; then
    print_success "Minikube is already running"
else
    echo "Starting Minikube with Docker driver..."
    minikube start --driver=docker
    print_success "Minikube started successfully"
fi

# Enable ingress addon
print_status 2 "Enabling Ingress addon..."
minikube addons enable ingress
print_success "Ingress addon enabled"

# Configure Docker environment
print_status 3 "Configuring Docker environment..."
eval $(minikube docker-env)
print_success "Docker environment configured"

# Check if k8s directory exists
if [ ! -d "k8s" ]; then
    print_error "k8s directory not found!"
    echo "Please create the k8s/ directory and add the Kubernetes manifest files"
    echo "Refer to the deployment guide for the YAML files"
    exit 1
fi

# Check if all required YAML files exist
required_files=("namespace.yaml" "configmap.yaml" "rabbitmq.yaml" "auth-service.yaml" "product-service.yaml" "order-service.yaml" "api-gateway.yaml" "client.yaml" "ingress.yaml")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "k8s/$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "Missing required YAML files in k8s/ directory:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

# Build Docker images
print_status 4 "Building Docker images..."

services=("auth" "product" "order" "api-gateway" "client")
image_names=("auth-service" "product-service" "order-service" "api-gateway" "client-app")

for i in "${!services[@]}"; do
    service=${services[$i]}
    image=${image_names[$i]}
    
    if [ ! -d "./$service" ]; then
        print_error "Service directory './$service' not found!"
        exit 1
    fi
    
    echo "Building $image..."
    if docker build -t "$image:latest" "./$service"; then
        print_success "$image built successfully"
    else
        print_error "Failed to build $image"
        exit 1
    fi
done

print_success "All images built successfully!"
echo "Built images:"
docker images | grep -E "(auth-service|product-service|order-service|api-gateway|client-app)"

# Deploy Kubernetes resources
print_status 5 "Deploying Kubernetes resources..."

echo "Creating namespace and configmaps..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
print_success "Namespace and configmaps created"

echo "Deploying RabbitMQ..."
kubectl apply -f k8s/rabbitmq.yaml
print_success "RabbitMQ deployed"

echo "Waiting for RabbitMQ to be ready..."
if kubectl wait --for=condition=available --timeout=300s deployment/rabbitmq -n ecommerce; then
    print_success "RabbitMQ is ready"
else
    print_warning "RabbitMQ deployment timed out, continuing anyway..."
fi

echo "Deploying microservices..."
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/product-service.yaml
kubectl apply -f k8s/order-service.yaml
print_success "Microservices deployed"

echo "Deploying API Gateway..."
kubectl apply -f k8s/api-gateway.yaml
print_success "API Gateway deployed"

echo "Deploying Client application..."
kubectl apply -f k8s/client.yaml
print_success "Client application deployed"

echo "Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml
print_success "Ingress deployed"

# Configure hosts file
print_status 6 "Configuring hosts file..."
MINIKUBE_IP=$(minikube ip)
echo "Adding $MINIKUBE_IP ecommerce.local to hosts file..."

# Check if entry already exists
if grep -q "ecommerce.local" /etc/hosts; then
    print_warning "ecommerce.local entry already exists in /etc/hosts"
    sudo sed -i.bak "s/.*ecommerce.local/$MINIKUBE_IP ecommerce.local/" /etc/hosts
else
    echo "$MINIKUBE_IP ecommerce.local" | sudo tee -a /etc/hosts > /dev/null
fi
print_success "Hosts file configured"

# Wait for deployments
print_status 7 "Waiting for deployments to be ready..."
sleep 30

# Display status
print_status 8 "Checking deployment status..."
echo
echo "Pod Status:"
kubectl get pods -n ecommerce
echo
echo "Service Status:"
kubectl get services -n ecommerce
echo
echo "Ingress Status:"
kubectl get ingress -n ecommerce

# Final success message
echo
echo "===================================="
print_success "Deployment Complete!"
echo "===================================="
echo
echo "Access your application at:"
echo "• Frontend: http://ecommerce.local"
echo "• API Gateway: http://ecommerce.local/api"
echo
echo "RabbitMQ Management:"
minikube service rabbitmq-service -n ecommerce --url | head -2
echo
echo "Useful commands:"
echo "• Check pod status: kubectl get pods -n ecommerce"
echo "• View logs: kubectl logs -f deployment/SERVICE_NAME -n ecommerce"
echo "• Scale services: kubectl scale deployment SERVICE_NAME --replicas=N -n ecommerce"
echo "• Port forward: kubectl port-forward service/SERVICE_NAME LOCAL_PORT:SERVICE_PORT -n ecommerce"
echo
echo "To cleanup: run ./cleanup.sh"
echo