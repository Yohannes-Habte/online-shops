import React from 'react';
import './ShopDashboard.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import OverviewDashboard from '../../../components/shopDashboard/dashboardOverview/DashboardOverview';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopDashboard = () => {
  return (
    <main className="shop-dashboar-page">
      <HeaderDashboard />
      <section className="shop-dashboard-container">
        <SidebarDashboard />
        <OverviewDashboard />
      </section>
      <Footer />
    </main>
  );
};

export default ShopDashboard;
