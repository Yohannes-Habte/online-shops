import React from 'react';
import './ShopEvents.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import AllShopEvents from '../../../components/shop/allShopEvents/AllShopEvents';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopEvents = () => {
  return (
    <main className="shop-events-page">
      <HeaderDashboard />
      <section className="shop-events-container">
        <SidebarDashboard />

        <AllShopEvents />
      </section>
      <Footer />
    </main>
  );
};

export default ShopEvents;
