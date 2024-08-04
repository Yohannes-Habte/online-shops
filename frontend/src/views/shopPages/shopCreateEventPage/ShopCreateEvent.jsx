import React from 'react';
import "./ShopCreateEvent.scss"
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import CreateEvent from '../../../components/shop/createEvent/CreateEvent';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopCreateEvent = () => {
  return (
    <main className="shop-create-event-page">
      <HeaderDashboard />
      <section className="shop-create-event-container">
        <SidebarDashboard />

        <CreateEvent />
      </section>
      <Footer />
    </main>
  );
};

export default ShopCreateEvent;
