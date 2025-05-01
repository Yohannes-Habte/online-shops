import AllSellerOrders from "../allOrders/AllSellerOrders";
import AllShopEvents from "../allShopEvents/AllShopEvents";
import AllShopProducts from "../allShopProducts/AllShopProducts";
import ShopRefunds from "../allShopRefunds/ShopRefunds";
import ProductCategory from "../category/ProductCategory";
import ProductBrand from "../brand/ProductBrand";
import CreateEvent from "../createEvent/CreateEvent";
import CreateProduct from "../createProduct/CreateProduct";
import ShopSettings from "../shopSettings/ShopSettings";
import "./ShopContent.scss";
import Supplier from "../supplier/Supplier";
import Subcategory from "../subcategory/Subcategory";
import DashboardOverview from "../dashboardOverview/DashboardOverview";
import ShopInboxPage from "../../../views/shopPages/shopInboxPage/ShopInboxPage";
import Transactions from "../transactions/Transactions";
import ReturnItems from "../returnItems/ReturnItems";
import Withdrawals from "../allWIthdrawals/Withdrawals";
import RefundRequests from "../refundRequests/RefundRequests";

const ShopContent = ({ isActive, setIsActive }) => {
  return (
    <article className="admin-dashboard-right-box-wrapper">
      {isActive === 1 && <DashboardOverview setIsActive={setIsActive} />}

      {isActive === 2 && <ProductCategory />}

      {isActive === 17 && <Subcategory />}

      {isActive === 3 && <ProductBrand />}

      {isActive === 4 && <CreateProduct />}

      {isActive === 5 && <AllShopProducts />}

      {isActive === 6 && <CreateEvent />}

      {isActive === 7 && <AllShopEvents />}

      {isActive === 9 && <AllSellerOrders />}

      {isActive === 10 && <Transactions />}

      {isActive === 21 && <ReturnItems />}

      {isActive === 22 && <Withdrawals />}

      {isActive === 12 && <ShopRefunds setIsActive={setIsActive} />}

      {isActive === 11 && <ShopInboxPage />}

      {isActive === 13 && <Supplier />}

      {isActive === 18 && <RefundRequests />}

      {isActive === 14 && <ShopSettings />}
    </article>
  );
};

export default ShopContent;
