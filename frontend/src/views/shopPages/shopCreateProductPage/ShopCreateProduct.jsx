import React from 'react';
import './ShopCreateProduct.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import CreateProduct from '../../../components/shop/createProduct/CreateProduct';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopCreateProduct = () => {
  return (
    <main className="shop-create-product-page">
      <HeaderDashboard />
      <section className="shop-create-product-container">
        <SidebarDashboard />

        <CreateProduct />
      </section>
      <Footer />
    </main>
  );
};

export default ShopCreateProduct;
