import "./ShopOrderDetailsPage.scss";
import ShopOrderDetails from "../../../components/shop/shopOrderDetails/ShopOrderDetails";
import { useSelector } from "react-redux";
import Footer from "../../../components/layouts/footer/Footer";
import ShopHeader from "../../../components/layouts/shopHeader/ShopHeader";

const ShopOrderDetailsPage = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  return (
    <main className="shop-order-details-page">
      <ShopHeader />
      <section className="shop-order-details-container">
        <h1 className="title"> Single Order Details for {currentSeller.name} </h1>
        <ShopOrderDetails />
      </section>
      <Footer />
    </main>
  );
};

export default ShopOrderDetailsPage;
