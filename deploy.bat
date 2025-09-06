@echo off
chcp 65001 >nul
echo 🚀 Starting E-commerce App deployment on Minikube...
echo.

:MAIN
if "%1"=="" goto DEPLOY

if "%1"=="deploy" goto DEPLOY
if "%1"=="build" goto BUILD_IMAGES
if "%1"=="status" goto STATUS
if "%1"=="cleanup" goto CLEANUP
if "%1"=="port-forward" goto PORT_FORWARD
if "%1"=="urls" goto URLS

echo Usage: %0 {deploy^|build^|status^|cleanup^|port-forward^|urls}
echo.
echo Commands:
echo   build        - Build Docker images
echo   deploy       - Deploy the entire application
echo   status       - Check deployment status
echo   cleanup      - Remove all resources
echo   port-forward - Set up local port forwarding
echo   urls         - Show application URLs
exit /b 1

:BUILD_IMAGES
echo [INFO] Building Docker images...
call :BUILD_SERVICE_IMAGE auth 3000
call :BUILD_SERVICE_IMAGE product 3001
call :BUILD_SERVICE_IMAGE order 3002
call :BUILD_SERVICE_IMAGE api-gateway 3003
call :BUILD_FRONTEND_IMAGE
echo [SUCCESS] All images built successfully
goto :EOF

:BUILD_SERVICE_IMAGE
echo [INFO] Building %1 service image...
docker build -t %1-service:latest ./%1/
echo [SUCCESS] %1 service image built
exit /b 0

:BUILD_FRONTEND_IMAGE
echo [INFO] Building frontend image...
docker build -t frontend:latest ./client/
echo [SUCCESS] Frontend image built
exit /b 0

:DEPLOY
call :CHECK_MINIKUBE
call :ENABLE_ADDONS
call :BUILD_IMAGES
call :CREATE_NAMESPACE
call :DEPLOY_SECRETS
call :DEPLOY_CONFIGMAP
call :DEPLOY_RABBITMQ
call :DEPLOY_MICROSERVICES
call :DEPLOY_FRONTEND
call :GET_URLS
goto :EOF

:CHECK_MINIKUBE
echo [INFO] Checking Minikube status...
minikube status >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Minikube is not running. Starting Minikube...
    minikube start
    echo [SUCCESS] Minikube started successfully
) else (
    echo [SUCCESS] Minikube is already running
)

REM Configure Docker environment to use Minikube's Docker daemon
echo [INFO] Configuring Docker environment...
@for /f "tokens=*" %%i in ('minikube -p minikube docker-env --shell cmd') do @%%i
echo [SUCCESS] Docker environment configured
exit /b 0

:ENABLE_ADDONS
echo [INFO] Enabling Minikube addons...
minikube addons enable ingress >nul 2>&1
minikube addons enable dashboard >nul 2>&1
minikube addons enable metrics-server >nul 2>&1
echo [SUCCESS] Addons enabled
exit /b 0

:CREATE_NAMESPACE
echo [INFO] Creating namespace...
kubectl apply -f k8s/namespace.yaml
echo [SUCCESS] Namespace created
exit /b 0

:DEPLOY_SECRETS
echo [INFO] Deploying secrets...
kubectl apply -f k8s/secrets.yaml
echo [SUCCESS] Secrets deployed
exit /b 0

:DEPLOY_CONFIGMAP
echo [INFO] Deploying ConfigMap...
kubectl apply -f k8s/configmap.yaml
echo [SUCCESS] ConfigMap deployed
exit /b 0

:DEPLOY_RABBITMQ
echo [INFO] Deploying RabbitMQ...
kubectl apply -f k8s/rabbitmq/deployment.yml
echo [SUCCESS] RabbitMQ deployed

echo [INFO] Waiting for RabbitMQ to be ready...
kubectl wait --for=condition=ready pod -l app=rabbitmq -n ecommerce-app --timeout=120s >nul 2>&1
echo [SUCCESS] RabbitMQ is ready
exit /b 0

:DEPLOY_MICROSERVICES
echo [INFO] Deploying microservices...

echo [INFO] Deploying Auth Service...
kubectl apply -f k8s/auth-service/deployment.yml

echo [INFO] Deploying Product Service...
kubectl apply -f k8s/product-service/deployment.yml

echo [INFO] Deploying Order Service...
kubectl apply -f k8s/order-service/deployment.yml

echo [INFO] Deploying API Gateway...
kubectl apply -f k8s/api-gateway/deployment.yml

echo [SUCCESS] All microservices deployed

echo [INFO] Waiting for microservices to be ready...
timeout /t 45 /nobreak >nul

kubectl wait --for=condition=ready pod -l app=auth-service -n ecommerce-app --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=product-service -n ecommerce-app --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=order-service -n ecommerce-app --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=api-gateway -n ecommerce-app --timeout=120s >nul 2>&1

echo [SUCCESS] Microservices are ready
exit /b 0

:DEPLOY_FRONTEND
echo [INFO] Deploying frontend...
kubectl apply -f k8s/frontend/deployment.yml
echo [SUCCESS] Frontend deployed

echo [INFO] Waiting for frontend to be ready...
timeout /t 20 /nobreak >nul
kubectl wait --for=condition=ready pod -l app=frontend -n ecommerce-app --timeout=120s >nul 2>&1
echo [SUCCESS] Frontend is ready
exit /b 0

:GET_URLS
echo [INFO] Getting service URLs...

for /f "tokens=*" %%i in ('minikube ip') do set MINIKUBE_IP=%%i

echo.
echo [SUCCESS] 🎉 Deployment completed successfully!
echo.
echo 📱 Application URLs:
echo    Frontend:          http://%MINIKUBE_IP%:30173
echo    API Gateway:       http://%MINIKUBE_IP%:30003
echo    RabbitMQ Mgmt:     http://%MINIKUBE_IP%:30672
echo.
echo 🔍 Useful commands:
echo    View all pods:     kubectl get pods -n ecommerce-app
echo    View services:     kubectl get services -n ecommerce-app
echo    API Gateway logs:  kubectl logs -f deployment/api-gateway -n ecommerce-app
echo    Dashboard:         minikube dashboard
echo.
exit /b 0

:STATUS
echo [INFO] Checking deployment status...
echo.
echo 📊 Pod Status:
kubectl get pods -n ecommerce-app -o wide

echo.
echo 🔧 Services:
kubectl get services -n ecommerce-app

echo.
echo 📊 Resource Usage:
kubectl top pods -n ecommerce-app 2>nul
if %errorlevel% neq 0 echo [INFO] Metrics not available yet
echo.
exit /b 0

:CLEANUP
echo [WARNING] Cleaning up ecommerce-app namespace...
echo [INFO] Deleting all resources...
kubectl delete namespace ecommerce-app --ignore-not-found=true
echo [SUCCESS] Cleanup completed
exit /b 0

:PORT_FORWARD
echo [INFO] Setting up port forwarding...
echo Access your application at:
echo   Frontend:            http://localhost:5173
echo   API Gateway:         http://localhost:3003
echo   RabbitMQ Management: http://localhost:15672
echo.
echo Press Ctrl+C to stop port forwarding

REM Start port forwarding in background
start /b kubectl port-forward service/frontend 5173:5173 -n ecommerce-app
start /b kubectl port-forward service/api-gateway 3003:3003 -n ecommerce-app
start /b kubectl port-forward service/rabbitmq 15672:15672 -n ecommerce-app

echo Press any key to stop port forwarding...
pause >nul

REM Kill background processes
taskkill /f /im kubectl.exe >nul 2>&1
echo Port forwarding stopped.
exit /b 0