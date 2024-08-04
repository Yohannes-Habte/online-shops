import React from 'react';
import './TrackOrderPage.scss';
import Header from '../../../components/userLayout/header/Header';
import TrackOrder from '../../../components/user/trackOrder/TrackOrder';
import Footer from '../../../components/userLayout/footer/Footer';



const TrackOrderPage = () => {
  return (
    <main className="track-order-page">
      <Header />
      <section className="track-order-page-container">
        <h1 className="track-order-title">Track Order</h1>
        <TrackOrder />
      </section>
      <Footer />
    </main>
  );
};

export default TrackOrderPage;
