@echo off
REM cleanup.bat - Windows Cleanup Script

echo ====================================
echo E-commerce Microservices Cleanup
echo ====================================

echo [1/4] Deleting Kubernetes resources...
kubectl delete namespace ecommerce
if %errorlevel% equ 0 (
    echo Namespace and all resources deleted successfully
) else (
    echo Warning: Some resources may not have been deleted
)

echo [2/4] Removing host entry...
powershell -Command "(Get-Content C:\Windows\System32\drivers\etc\hosts) | Where-Object { $_ -notmatch 'ecommerce.local' } | Set-Content C:\Windows\System32\drivers\etc\hosts"

echo [3/4] Stopping Minikube...
minikube stop

echo [4/4] Cleanup options:
echo 1. Keep Minikube for future use
echo 2. Delete Minikube completely
choice /C 12 /M "Choose option"

if %errorlevel% equ 2 (
    echo Deleting Minikube...
    minikube delete
    echo Minikube deleted completely
) else (
    echo Minikube stopped but preserved
)

echo.
echo Cleanup completed!
echo To redeploy, run deploy.bat
pause

REM cleanup.sh - Linux/Mac Cleanup Script
REM #!/bin/bash
REM set -e
REM 
REM echo "===================================="
REM echo "E-commerce Microservices Cleanup"
REM echo "===================================="
REM 
REM # Colors
REM GREEN='\033[0;32m'
REM BLUE='\033[0;34m'
REM NC='\033[0m'
REM 
REM print_status() {
REM     echo -e "${BLUE}[$1/4]${NC} $2"
REM }
REM 
REM print_success() {
REM     echo -e "${GREEN}✓${NC} $1"
REM }
REM 
REM print_status 1 "Deleting Kubernetes resources..."
REM if kubectl delete namespace ecommerce; then
REM     print_success "Namespace and all resources deleted"
REM else
REM     echo "Warning: Some resources may not have been deleted"
REM fi
REM 
REM print_status 2 "Removing host entry..."
REM sudo sed -i.bak '/ecommerce.local/d' /etc/hosts
REM print_success "Host entry removed"
REM 
REM print_status 3 "Stopping Minikube..."
REM minikube stop
REM print_success "Minikube stopped"
REM 
REM print_status 4 "Cleanup options:"
REM echo "1. Keep Minikube for future use"
REM echo "2. Delete Minikube completely"
REM read -p "Choose option (1-2): " choice
REM 
REM case $choice in
REM     2)
REM         echo "Deleting Minikube..."
REM         minikube delete
REM         print_success "Minikube deleted completely"
REM         ;;
REM     *)
REM         print_success "Minikube stopped but preserved"
REM         ;;
REM esac
REM 
REM echo
REM print_success "Cleanup completed!"
REM echo "To redeploy, run ./deploy.sh"