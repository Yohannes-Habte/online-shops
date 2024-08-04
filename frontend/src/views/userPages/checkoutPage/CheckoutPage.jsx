import React from 'react';
import './CheckoutPage.scss';
import Checkout from '../../../components/cart/checkout/Checkout';
import Header from '../../../components/userLayout/header/Header';
import Footer from '../../../components/userLayout/footer/Footer';

const CheckoutPage = () => {
  return (
    <main className="checkout-page">
      <Header />
      <section className="checkout-container">
        <h1 className="title"> Checkout </h1>
        <Checkout />
      </section>
      <Footer />
    </main>
  );
};

export default CheckoutPage;
