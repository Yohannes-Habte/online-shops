import "./OrderSuccess.scss";
import { useSelector } from "react-redux";
import Header from "../../../components/layouts/header/Header";
import Loader from "../../../components/loader/Loader";

const OrderSuccess = () => {
  // Global state variables
  const { currentUser, error, loading } = useSelector((state) => state.user);

  return (
    <main className="order-success-page">
      <Header />
      {loading ? (
        <Loader isLoading={loading} message="" size={90} />
      ) : error ? (
        <p className="error-message">{error} </p>
      ) : (
        <section className="order-success-page-container">
          <h2 className="order-success-title">Successful Order 😍</h2>
          <p className="welcome-back-message">
            Hello <strong className="user-name">{currentUser.name}</strong>,
            your order has been successfully placed. We will notify you promptly
            with updates regarding your delivery. Thank you for shopping with
            Lisa Shopping — we are always here to serve you and ensure your
            experience is seamless and satisfying.
          </p>
        </section>
      )}

    </main>
  );
};

export default OrderSuccess;
