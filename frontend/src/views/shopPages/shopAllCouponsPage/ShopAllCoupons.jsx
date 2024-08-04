import React from 'react';
import './ShopAllCoupons.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import AllCoupons from '../../../components/shop/allCoupons/AllCoupons';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopAllCoupons = () => {
  return (
    <main className="shop-all-coupons-page">
      <HeaderDashboard />
      <section className="shop-all-coupons-container">
        <SidebarDashboard />

        <AllCoupons />
      </section>
      <Footer />
    </main>
  );
};

export default ShopAllCoupons;
