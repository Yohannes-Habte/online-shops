import React from 'react';
import './ShopHome.scss';
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import ShopBiodata from '../../../components/shop/shopBiodata/ShopBiodata';
import ShopInfo from '../../../components/shop/shopInfo/ShopInfo';
import Footer from '../../../components/userLayout/footer/Footer';

const ShopHome = () => {
  return (
    <main className="shop-home-page">
      <HeaderDashboard isOwner={true} />
      <section className="shop-home-container">
        <ShopBiodata isOwner={true} />
        <ShopInfo isOwner={true} />
      </section>
      <Footer />
    </main>
  );
};

export default ShopHome;
