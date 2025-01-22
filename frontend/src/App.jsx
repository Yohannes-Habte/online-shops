import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./views/homePage/Home";
import EventsPage from "./views/eventsPage/EventsPage";
import BestSellings from "./views/bestSellingpage/BestSellings";
import Contact from "./views/contactPage/Contact";
import NotFound from "./views/notFound/NotFound";
import ProfilePage from "./views/userPages/profilePage/ProfilePage";
import Forgotpassword from "./views/userPages/passwordPage/Forgotpassword";
import ResetPassword from "./views/userPages/passwordPage/ResetPassword";
import SellerProtectedRoute from "./protectedRoutes/SellerProtectedRoute";
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";
import ShopLoginPage from "./views/shopPages/shopLoginPage/ShopLoginPage";
import CreateNewShop from "./views/shopPages/shopCreatePage/CreateNewShop";
import ShopHome from "./views/shopPages/shopHomePage/ShopHome";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ShopDetailsPage from "./views/shopPages/shopDetailsPage/ShopDetailsPage";
import TrackOrderPage from "./views/userPages/trackOrderPage/TrackOrderPage";
import Register from "./views/userPages/registerPage/Register";
import Login from "./views/userPages/loginPage/Login";
import CheckoutPage from "./views/userPages/checkoutPage/CheckoutPage";
import UserOrderDetailsPage from "./views/userPages/userOrderDetailsPage/UserOrderDetailsPage";
import Products from "./views/productPages/productsPage/Products";
import SingleProduct from "./views/productPages/productPage/SingleProduct";
import PaymentPage from "./views/userPages/paymentPage/PaymentPage";
import OrderSuccess from "./views/userPages/orderSuccessPage/OrderSuccess";
import UserInboxPage from "./views/userPages/userInboxPage/UserInboxPage";
import AdminDashboardPage from "./views/adminPages/adminDashboardPage/AdminDashboardPage";
import AdminProtectedRoute from "./protectedRoutes/AdminProtectedRoute";
import AdminDashboardUsers from "./views/adminPages/adminDashboardUsers/AdminDashboardUsers";
import AdminDashboardShops from "./views/adminPages/adminDashboardShops/AdminDashboardShops";
import AdminDashboardOrders from "./views/adminPages/adminDashboardOrders/AdminDashboardOrders";
import AdminDashboardProducts from "./views/adminPages/adminDashboardProducts/AdminDashboardProducts";
import AdminDashboardEvents from "./views/adminPages/adminDashboardEvents/AdminDashboardEvents";
import AdminDashboardWithdraws from "./views/adminPages/adminDashboardWithdraws/AdminDashboardWithdraws";
import ShopForgotpassword from "./views/shopPages/shopPasswordPage/ShopForgotpassword";
import ShopResetPassword from "./views/shopPages/shopPasswordPage/ShopResetPassword";
import { useDispatch } from "react-redux";
// import { fetchUserData } from './redux/reducers/userReducer';
import { API } from "./utils/security/secreteKey";
import { fetchUser } from "./redux/actions/user";
import { fetchSingleSeller } from "./redux/actions/seller";
import ShopDashboardPage from "./views/shopPages/shopDashbaordPage/ShopDashboardPage";

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
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productID" element={<SingleProduct />} />
        <Route path="/best-sellings" element={<BestSellings />} />
        <Route path="/events" element={<EventsPage />} />

        {/* User Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
          path="/user/order/:id"
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

        <Route
          path="/inbox"
          element={
            <UserProtectedRoute>
              <UserInboxPage />
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

        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHome />
            </SellerProtectedRoute>
          }
        />

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
