
import AllSellerOrders from "../allOrders/AllSellerOrders";
import AllShopEvents from "../allShopEvents/AllShopEvents";
import AllShopProducts from "../allShopProducts/AllShopProducts";
import ShopRefunds from "../allShopRefunds/ShopRefunds";
import ProductCategory from "../category/ProductCategory";
import ProductBrand from "../brand/ProductBrand";
import CreateEvent from "../createEvent/CreateEvent";
import CreateProduct from "../createProduct/CreateProduct";
import ShopSettings from "../shopSettings/ShopSettings";
import WithdrawMoney from "../withdrawMoney/WithDrawMoney";
import "./ShopContent.scss";
import Supplier from "../supplier/Supplier";
import Subcategory from "../subcategory/Subcategory";
import DashboardOverview from "../dashboardOverview/DashboardOverview";
import ShopInboxPage from "../../../views/shopPages/shopInboxPage/ShopInboxPage";


const ShopContent = ({ isActive }) => {
  return (
    <article className="admin-dashboard-right-box-wrapper">
      {isActive === 1 && <DashboardOverview />}

      {isActive === 2 && <ProductCategory />}

      {isActive === 17 && <Subcategory />}

      {isActive === 3 && <ProductBrand />}

      {isActive === 4 && <CreateProduct />}

      {isActive === 5 && <AllShopProducts />}

      {isActive === 6 && <CreateEvent />}

      {isActive === 7 && <AllShopEvents />}

      {isActive === 9 && <AllSellerOrders />}

      {isActive === 10 && <WithdrawMoney />}

      {isActive === 11 && <ShopInboxPage />}

      {isActive === 12 && <ShopRefunds />}

      {isActive === 13 && <Supplier />}

      {isActive === 14 && <ShopSettings />}
    </article>
  );
};

export default ShopContent;
