import "./ShopHome.scss";
import ShopBiodata from "../../../components/shop/shopBiodata/ShopBiodata";
import ShopInfo from "../../../components/shop/shopInfo/ShopInfo";
import Footer from "../../../components/layouts/footer/Footer";
import ShopHeader from "../../../components/layouts/shopHeader/ShopHeader";


const ShopHome = () => {
  return (
    <main className="shop-home-page">
      <ShopHeader isOwner={true} />
      <section className="shop-home-container">
        <ShopBiodata />
        <ShopInfo />
      </section>
      <Footer />
    </main>
  );
};

export default ShopHome;
