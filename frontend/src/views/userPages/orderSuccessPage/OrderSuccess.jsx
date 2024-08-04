import React from 'react';
import './OrderSuccess.scss';
import Header from '../../../components/userLayout/header/Header';
import Footer from '../../../components/userLayout/footer/Footer';
import { useSelector } from 'react-redux';
import PageLoader from '../../../utils/loader/PageLoader';

const OrderSuccess = () => {
  // Global state variables
  const { currentUser, error, loading } = useSelector((state) => state.user);

  return (
    <main className="order-success-page">
      <Header />
      {loading ? (
        <PageLoader />
      ) : error ? (
        <p>{error} </p>
      ) : (
        <section className="order-success-page-container">
          <h2 className="success-title">Successful Order 😍</h2>
          <p className="welcome-back">
            Hello <strong>{currentUser.name}</strong> your order is successful.
            We will inform you in good time about the delivery of your order.
            You are always welcome to Lisa Shopping! We are always ready to
            serve you according to your wishes, wish fulfils your desire.
          </p>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default OrderSuccess;
