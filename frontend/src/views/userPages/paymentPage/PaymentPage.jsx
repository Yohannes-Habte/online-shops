import React from 'react';
import './PaymentPage.scss';
import Header from '../../../components/userLayout/header/Header';
import Footer from '../../../components/userLayout/footer/Footer';
import PaymentMethod from '../../../components/payment/paymentMethod/PaymentMethod';

const PaymentPage = () => {
  return (
    <main className="payment-page">
      <Header />
      <section className="payment-page-container">
        <h1 className="payment-page-title"> Payment Methods</h1>
        <PaymentMethod />
      </section>
      <Footer />
    </main>
  );
};

export default PaymentPage;
