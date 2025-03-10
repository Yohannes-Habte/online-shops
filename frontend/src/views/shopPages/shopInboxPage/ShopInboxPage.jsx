import { useSelector } from "react-redux";
import DashboardMessages from "../../../components/shop/dashboardMessages/DashboardMessages";
import "./ShopInboxPage.scss";

const ShopInboxPage = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  return (
    <main className="shop-inbox-page">
      <section className="shop-inbox-page-wrapper">
        <h1 className="shop-inbox-page-title"> {currentSeller?.name} Shop Messages</h1>
        <DashboardMessages />
      </section>
    </main>
  );
};

export default ShopInboxPage;
