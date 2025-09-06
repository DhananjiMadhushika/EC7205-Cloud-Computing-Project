@echo off
REM create-k8s-manifests.bat - Creates all Kubernetes YAML files

echo Creating Kubernetes manifest files...

mkdir k8s 2>nul

REM Create namespace.yaml
echo Creating namespace.yaml...
(
echo apiVersion: v1
echo kind: Namespace
echo metadata:
echo   name: ecommerce
) > k8s\namespace.yaml

REM Create configmap.yaml
echo Creating configmap.yaml...
(
echo apiVersion: v1
echo kind: ConfigMap
echo metadata:
echo   name: app-config
echo   namespace: ecommerce
echo data:
echo   RABBITMQ_URL: "amqp://rabbitmq-service:5672"
echo   API_GATEWAY_URL: "http://api-gateway-service:3003"
echo ---
echo apiVersion: v1
echo kind: Secret
echo metadata:
echo   name: app-secrets
echo   namespace: ecommerce
echo type: Opaque
echo stringData:
echo   DATABASE_URL: "your-database-url"
echo   JWT_SECRET: "your-jwt-secret"
) > k8s\configmap.yaml

REM Create rabbitmq.yaml
echo Creating rabbitmq.yaml...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: rabbitmq
echo   namespace: ecommerce
echo spec:
echo   replicas: 1
echo   selector:
echo     matchLabels:
echo       app: rabbitmq
echo   template:
echo     metadata:
echo       labels:
echo         app: rabbitmq
echo     spec:
echo       containers:
echo       - name: rabbitmq
echo         image: rabbitmq:3.8-management-alpine
echo         ports:
echo         - containerPort: 5672
echo         - containerPort: 15672
echo         env:
echo         - name: RABBITMQ_DEFAULT_USER
echo           value: "admin"
echo         - name: RABBITMQ_DEFAULT_PASS
echo           value: "password"
echo         volumeMounts:
echo         - name: rabbitmq-data
echo           mountPath: /var/lib/rabbitmq
echo       volumes:
echo       - name: rabbitmq-data
echo         emptyDir: {}
echo ---
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: rabbitmq-service
echo   namespace: ecommerce
echo spec:
echo   selector:
echo     app: rabbitmq
echo   ports:
echo   - name: amqp
echo     port: 5672
echo     targetPort: 5672
echo   - name: management
echo     port: 15672
echo     targetPort: 15672
echo   type: ClusterIP
) > k8s\rabbitmq.yaml

REM Create auth-service.yaml
echo Creating auth-service.yaml...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: auth-service
echo   namespace: ecommerce
echo spec:
echo   replicas: 2
echo   selector:
echo     matchLabels:
echo       app: auth-service
echo   template:
echo     metadata:
echo       labels:
echo         app: auth-service
echo     spec:
echo       containers:
echo       - name: auth-service
echo         image: auth-service:latest
echo         imagePullPolicy: Never
echo         ports:
echo         - containerPort: 3000
echo         env:
echo         - name: PORT
echo           value: "3000"
echo         envFrom:
echo         - configMapRef:
echo             name: app-config
echo         - secretRef:
echo             name: app-secrets
echo         resources:
echo           limits:
echo             memory: "512Mi"
echo             cpu: "500m"
echo           requests:
echo             memory: "256Mi"
echo             cpu: "250m"
echo ---
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: auth-service
echo   namespace: ecommerce
echo spec:
echo   selector:
echo     app: auth-service
echo   ports:
echo   - port: 3000
echo     targetPort: 3000
echo   type: ClusterIP
) > k8s\auth-service.yaml

REM Create product-service.yaml
echo Creating product-service.yaml...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: product-service
echo   namespace: ecommerce
echo spec:
echo   replicas: 2
echo   selector:
echo     matchLabels:
echo       app: product-service
echo   template:
echo     metadata:
echo       labels:
echo         app: product-service
echo     spec:
echo       containers:
echo       - name: product-service
echo         image: product-service:latest
echo         imagePullPolicy: Never
echo         ports:
echo         - containerPort: 3001
echo         env:
echo         - name: PORT
echo           value: "3001"
echo         envFrom:
echo         - configMapRef:
echo             name: app-config
echo         - secretRef:
echo             name: app-secrets
echo         resources:
echo           limits:
echo             memory: "512Mi"
echo             cpu: "500m"
echo           requests:
echo             memory: "256Mi"
echo             cpu: "250m"
echo ---
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: product-service
echo   namespace: ecommerce
echo spec:
echo   selector:
echo     app: product-service
echo   ports:
echo   - port: 3001
echo     targetPort: 3001
echo   type: ClusterIP
) > k8s\product-service.yaml

REM Create order-service.yaml
echo Creating order-service.yaml...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: order-service
echo   namespace: ecommerce
echo spec:
echo   replicas: 2
echo   selector:
echo     matchLabels:
echo       app: order-service
echo   template:
echo     metadata:
echo       labels:
echo         app: order-service
echo     spec:
echo       containers:
echo       - name: order-service
echo         image: order-service:latest
echo         imagePullPolicy: Never
echo         ports:
echo         - containerPort: 3002
echo         env:
echo         - name: PORT
echo           value: "3002"
echo         envFrom:
echo         - configMapRef:
echo             name: app-config
echo         - secretRef:
echo             name: app-secrets
echo         resources:
echo           limits:
echo             memory: "512Mi"
echo             cpu: "500m"
echo           requests:
echo             memory: "256Mi"
echo             cpu: "250m"
echo ---
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: order-service
echo   namespace: ecommerce
echo spec:
echo   selector:
echo     app: order-service
echo   ports:
echo   - port: 3002
echo     targetPort: 3002
echo   type: ClusterIP
) > k8s\order-service.yaml

REM Create api-gateway.yaml
echo Creating api-gateway.yaml...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: api-gateway
echo   namespace: ecommerce
echo spec:
echo   replicas: 2
echo   selector:
echo     matchLabels:
echo       app: api-gateway
echo   template:
echo     metadata:
echo       labels:
echo         app: api-gateway
echo     spec:
echo       containers:
echo       - name: api-gateway
echo         image: api-gateway:latest
echo         imagePullPolicy: Never
echo         ports:
echo         - containerPort: 3003
echo         env:
echo         - name: PORT
echo           value: "3003"
echo         - name: AUTH_SERVICE_URL
echo           value: "http://auth-service:3000"
echo         - name: PRODUCT_SERVICE_URL
echo           value: "http://product-service:3001"
echo         - name: ORDER_SERVICE_URL
echo           value: "http://order-service:3002"
echo         envFrom:
echo         - configMapRef:
echo             name: app-config
echo         resources:
echo           limits:
echo             memory: "512Mi"
echo             cpu: "500m"
echo           requests:
echo             memory: "256Mi"
echo             cpu: "250m"
echo ---
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: api-gateway-service
echo   namespace: ecommerce
echo spec:
echo   selector:
echo     app: api-gateway
echo   ports:
echo   - port: 3003
echo     targetPort: 3003
echo   type: ClusterIP
) > k8s\api-gateway.yaml

REM Create client.yaml
echo Creating client.yaml...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: client-app
echo   namespace: ecommerce
echo spec:
echo   replicas: 2
echo   selector:
echo     matchLabels:
echo       app: client-app
echo   template:
echo     metadata:
echo       labels:
echo         app: client-app
echo     spec:
echo       containers:
echo       - name: client-app
echo         image: client-app:latest
echo         imagePullPolicy: Never
echo         ports:
echo         - containerPort: 80
echo         resources:
echo           limits:
echo             memory: "256Mi"
echo             cpu: "250m"
echo           requests:
echo             memory: "128Mi"
echo             cpu: "100m"
echo ---
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: client-service
echo   namespace: ecommerce
echo spec:
echo   selector:
echo     app: client-app
echo   ports:
echo   - port: 80
echo     targetPort: 80
echo   type: ClusterIP
) > k8s\client.yaml

REM Create ingress.yaml
echo Creating ingress.yaml...
(
echo apiVersion: networking.k8s.io/v1
echo kind: Ingress
echo metadata:
echo   name: ecommerce-ingress
echo   namespace: ecommerce
echo   annotations:
echo     nginx.ingress.kubernetes.io/rewrite-target: /
echo     nginx.ingress.kubernetes.io/cors-allow-origin: "*"
echo     nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
echo     nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
echo spec:
echo   rules:
echo   - host: ecommerce.local
echo     http:
echo       paths:
echo       - path: /
echo         pathType: Prefix
echo         backend:
echo           service:
echo             name: client-service
echo             port:
echo               number: 80
echo       - path: /api
echo         pathType: Prefix
echo         backend:
echo           service:
echo             name: api-gateway-service
echo             port:
echo               number: 3003
) > k8s\ingress.yaml

echo.
echo ✓ All Kubernetes manifest files created successfully!
echo.
echo Files created in k8s/ directory:
dir /b k8s\*.yaml
echo.
echo You can now run deploy.bat to deploy your application.
pause