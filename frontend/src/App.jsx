import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Contact from "./views/contactPage/Contact";
import NotFound from "./views/notFound/NotFound";
import ResetPassword from "./views/userPages/passwordPage/ResetPassword";
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import AdminProtectedRoute from "./protectedRoutes/AdminProtectedRoute";
import ShopResetPassword from "./views/shopPages/shopPasswordPage/ShopResetPassword";
import { useDispatch } from "react-redux";
import { API } from "./utils/security/secreteKey";
import { fetchUser } from "./redux/actions/user";
import { fetchSingleSeller } from "./redux/actions/seller";
import WomenProductsPage from "./views/womenPage/WomenProductsPage";
import MenProductsPage from "./views/menPage/MenProductsPage";
import KidsProductsPage from "./views/kidsPage/KidsProductsPage";

import {
  RegisterPage,
  LoginPage,
  ProfilePage,
  Forgotpassword,
  CheckoutPage,
  PaymentPage,
  OrderSuccess,
  TrackOrderPage,
  UserOrderDetailsPage,
} from "./routes/user/UserRoutes";

import { SingleProduct, Products } from "./routes/product/ProductRoutes";

import {
  CreateNewShop,
  ShopLoginPage,
  ShopDashboardPage,
  ShopDetailsPage,
  ShopProfilePage,
  ShopOrderDetailsPage,
  ShopForgotpassword,
} from "./routes/shop/ShopRoutes";

import {
  AdminDashboardPage,
  AdminDashboardOrders,
  AdminDashboardEvents,
  AdminDashboardProducts,
  AdminDashboardShops,
  AdminDashboardUsers,
  AdminDashboardWithdraws,
} from "./routes/admin/AdminRoutes";
import SupplierPage from "./views/supplierPage/SupplierPage";
import UpdateProductPage from "./views/productPages/updateProductPage/UpdateProductPage";
import HomePage from "./views/homePage/HomePage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSingleSeller());
  }, [dispatch]);

  const [stripeApikey, setStripeApiKey] = useState("");

  const getStripeApikey = async () => {
    try {
      const { data } = await axios.get(`${API}/payment/stripeapikey`);
      setStripeApiKey(data.stripeApikey);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getStripeApikey();
  });

  return (
    <div>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route
              path="/payment"
              element={
                <UserProtectedRoute>
                  <PaymentPage />
                </UserProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productID" element={<SingleProduct />} />
        <Route path="/products/update/:id" element={<UpdateProductPage />} />
        <Route path="/suppliers/:id" element={<SupplierPage />} />
        <Route path="/women" element={<WomenProductsPage />} />
        <Route path="/men" element={<MenProductsPage />} />
        <Route path="/kids" element={<KidsProductsPage />} />

        {/* User Pages */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <ProfilePage />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <UserProtectedRoute>
              <CheckoutPage />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <UserProtectedRoute>
              <UserOrderDetailsPage />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/user/track/order/:id"
          element={
            <UserProtectedRoute>
              <TrackOrderPage />
            </UserProtectedRoute>
          }
        />

        {/* Shope Pages */}
        <Route path="/shop/create" element={<CreateNewShop />} />
        <Route path="/shop/login" element={<ShopLoginPage />} />
        <Route path="/shop/forgotPassword" element={<ShopForgotpassword />} />
        <Route
          path="/shop/resetPassword/:token"
          element={<ShopResetPassword />}
        />
        <Route path="/shop/preview/:id" element={<ShopDetailsPage />} />

        <Route path="/shop/dashboard" element={<ShopDashboardPage />} />

        <Route path="/shop/:id" element={<ShopProfilePage />} />

        <Route path="/shop/order/:id" element={<ShopOrderDetailsPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <AdminProtectedRoute>
              <AdminDashboardUsers />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-shops"
          element={
            <AdminProtectedRoute>
              <AdminDashboardShops />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-orders"
          element={
            <AdminProtectedRoute>
              <AdminDashboardOrders />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-products"
          element={
            <AdminProtectedRoute>
              <AdminDashboardProducts />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-events"
          element={
            <AdminProtectedRoute>
              <AdminDashboardEvents />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin-withdraw-request"
          element={
            <AdminProtectedRoute>
              <AdminDashboardWithdraws />
            </AdminProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        limit={1}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
