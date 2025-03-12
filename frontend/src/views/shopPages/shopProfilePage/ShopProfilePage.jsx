import "./ShopProfilePage.scss";
import Footer from "../../../components/layouts/footer/Footer";
import ShopHeader from "../../../components/layouts/shopHeader/ShopHeader";
import ShopProfile from "../../../components/shop/shopProfile/ShopProfile";
import ShopInventory from "../../../components/shop/shopInventory/ShopInventory";

const ShopProfilePage = () => {
  return (
    <main className="shop-profile-page">
      <ShopHeader isOwner={true} />
      <section className="shop-profile-page-container">
        <ShopProfile />
        <ShopInventory />
      </section>
      <Footer />
    </main>
  );
};

export default ShopProfilePage;
