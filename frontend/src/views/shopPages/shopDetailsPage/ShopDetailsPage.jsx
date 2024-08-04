import React from 'react';
import './ShopDetailsPage.scss';
import ShopBiodata from '../../../components/shop/shopBiodata/ShopBiodata';
import ShopInfo from '../../../components/shop/shopInfo/ShopInfo';
import Footer from '../../../components/userLayout/footer/Footer';


const ShopDetailsPage = () => {
  return (
    <main className="shop-detials-page">
      <section className="shop-details-container">
        <ShopBiodata isOwner={false} />

        <ShopInfo isOwner={false} />
      </section>
      <Footer />
    </main>
  );
};

export default ShopDetailsPage;
