import { GoogleOAuthProvider } from "@react-oauth/google";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from "./pages/Client/AboutPage";
import AccountPage from "./pages/Client/AccountPage";

import CartPage from "./pages/Client/CartPage";
import EShop from "./pages/Client/EShopPage";
import Home from "./pages/Client/HomePage";


import ProductDetailsPage from "./pages/Client/ProductDetailsPage";
import ProductPage from "./pages/Client/ProductPage";

import { initGA, logPageView } from "./utils/ga";




import ProtectedRoute from "./components/ProtectedRoute";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import AdminOrderPage from "./pages/Admin/AdminOrder/AdminOrderPage";
import AdminAddProductsPage from "./pages/Admin/AdminProducts/AdminAddProductsPage";
import AdminProductPage from "./pages/Admin/AdminProducts/AdminProductPage";
import AdminViewProductsPage from "./pages/Admin/AdminProducts/AdminViewProductsPage";
import AdminProfilePage from "./pages/Admin/AdminProfile/AdminProfilePage";

import { AuthProvider } from "./Providers/AuthProvider";


import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";

import ManageCategoryPage from "./pages/Admin/AdminProducts/ManageCategoryPage";
import ManageColorPage from "./pages/Admin/AdminProducts/ManageColorPage";
import AdminUserPage from "./pages/Admin/AdminUser/AdminUserPage";

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    initGA();
  }, []);
  
  return (
    <GoogleOAuthProvider clientId="61875426451-l6sak8sf4jlrc3caapiv7ks3iredsu5p.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <AnalyticsListener />
          <ToastContainer />
        
          <Routes>
            
          <Route element={<AuthGuard />}>
            
            {/* Client routes */}
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<AboutUs />} />
          
           
            <Route path="/ourProduct" element={<ProductPage />} />
         
            <Route path="/e-shop" element={<EShop />} />
            <Route path="/cart" element={<CartPage />} />
           
            <Route path="/account" element={<AccountPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />

            {/* Admin routes with ProtectedRoute component */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminHomePage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute requiredRole="ADMIN"><AdminProductPage /></ProtectedRoute>} />
            <Route path="/products/add-products" element={<ProtectedRoute requiredRole="ADMIN"><AdminAddProductsPage /></ProtectedRoute>} />
            <Route path="/products/view-product-details/:id" element={<ProtectedRoute requiredRole="ADMIN"><AdminViewProductsPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute requiredRole="ADMIN"><AdminUserPage /></ProtectedRoute>} />
             <Route path="/order" element={<ProtectedRoute requiredRole="ADMIN"><AdminOrderPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute requiredRole="ADMIN"><AdminProfilePage /></ProtectedRoute>} />
            
             <Route path="/products/manage-categories" element={<ProtectedRoute requiredRole="ADMIN"><ManageCategoryPage /></ProtectedRoute>} />
             <Route path="/products/manage-colors" element={<ProtectedRoute requiredRole="ADMIN"><ManageColorPage /></ProtectedRoute>} />
 
 </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;