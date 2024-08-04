import React from 'react';
import './ShopOrderDetailsPage.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import ShopOrderDetails from '../../../components/shop/shopOrderDetails/ShopOrderDetails';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopOrderDetailsPage = () => {
  return (
    <main className="shop-order-details-page">
      <HeaderDashboard />
      <section className="shop-order-details-container">
        <h1 className="title"> Shop Order Details</h1>
        <ShopOrderDetails />
      </section>
      <Footer />
    </main>
  );
};

export default ShopOrderDetailsPage;
