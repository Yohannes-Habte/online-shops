import React from 'react';
import './ShopProducts.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import AllShopProducts from '../../../components/shop/allShopProducts/AllShopProducts';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopProducts = () => {
  return (
    <main className="shop-products-page">
      <HeaderDashboard />
      <section className="shop-products-container">
        <SidebarDashboard />

        <AllShopProducts />
      </section>
      <Footer />
    </main>
  );
};

export default ShopProducts;
