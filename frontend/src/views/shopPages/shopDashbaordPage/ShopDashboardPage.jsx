import { useState } from "react";
import Footer from "../../../components/userLayout/footer/Footer";
import ShopContent from "../../../components/shop/shopLayout/shopContents/ShopContent";
import ShopSidebar from "../../../components/shop/shopLayout/shopSidebar/ShopSidebar";
import HeaderDashboard from "../../../components/shopDashboard/headerDashboard/HeaderDashboard";
import "./ShopDashboardPage.scss";

const ShopDashboardPage = () => {
  const [isActive, setIsActive] = useState(1);
  return (
    <main className="shop-dashboard-page">
      <HeaderDashboard isActive={isActive} setIsActive={setIsActive} />
      <section className="shop-dashboard-page-container">
        <h1 className="shop-dashboard-page-title"> Shop Dashboard </h1>
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
