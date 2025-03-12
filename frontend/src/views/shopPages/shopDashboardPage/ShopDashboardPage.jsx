import { useState } from "react";
import ShopHeader from "../../../components/layouts/shopHeader/ShopHeader";
import "./ShopDashboardPage.scss";
import Footer from "../../../components/layouts/footer/Footer";
import ShopSidebar from "../../../components/layouts/shopSidebar/ShopSidebar";
import ShopContent from "../../../components/shop/shopContents/ShopContent";
import { useSelector } from "react-redux";

const ShopDashboardPage = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const [isActive, setIsActive] = useState(1);
  return (
    <main className="shop-dashboard-page">
      <ShopHeader isActive={isActive} setIsActive={setIsActive} />
      <section className="shop-dashboard-page-container">
        <h1 className="shop-dashboard-page-title">
          {currentSeller.name} Dashboard{" "}
        </h1>
        <div className="shop-dashboard-sections-wrapper">
          <ShopSidebar isActive={isActive} setIsActive={setIsActive} />

          <ShopContent isActive={isActive} setIsActive={setIsActive} />
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ShopDashboardPage;
