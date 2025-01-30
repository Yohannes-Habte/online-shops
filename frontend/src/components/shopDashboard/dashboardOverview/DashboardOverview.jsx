import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { RxArrowRight } from "react-icons/rx";
import { MdPriceChange } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { API } from "../../../utils/security/secreteKey";
import {
  fetchSellerOrders,
  clearOrderErrors,
} from "../../../redux/actions/order";
import { fetchSellerOrdersRequest } from "../../../redux/reducers/orderReducer";
import "./DashboardOverview.scss";

const DashboardOverview = () => {
  // Global state variables
  const dispatch = useDispatch();
  const { sellerOrders } = useSelector((state) => state.order);
  const { currentSeller } = useSelector((state) => state.seller);

  // Extract loading, error, and data from sellerOrders
  const {
    data: sellerOrdersData,
    loading: sellerOrdersLoading,
    error: sellerOrdersError,
  } = sellerOrders;

  // Local state variables
  const [shopProducts, setShopProducts] = useState([]);
  const [deliveredShopOrders, setDeliveredShopOrders] = useState([]);

  // Fetch seller orders on mount
  useEffect(() => {
    dispatch(fetchSellerOrders());

    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  // Fetch shop products
  useEffect(() => {
    const getShopProducts = async () => {
      try {
        const { data } = await axios.get(
          `${API}/products/${currentSeller?._id}/shop-products`
        );
        setShopProducts(data.products);
      } catch (error) {
        console.error("Error fetching shop products:", error);
      }
    };
    getShopProducts();
  }, [currentSeller]);

  // Fetch delivered orders
  useEffect(() => {
    const getShopOrders = async () => {
      try {
        dispatch(fetchSellerOrdersRequest());
        const { data } = await axios.get(
          `${API}/orders/shop/${currentSeller?._id}`
        );
        const deliveredOrders = data.sellerOrders.filter(
          (order) => order.status === "Delivered"
        );
        setDeliveredShopOrders(deliveredOrders);
      } catch (error) {
        console.error("Error fetching delivered orders:", error);
      }
    };
    getShopOrders();
  }, [currentSeller, dispatch]);

  // Calculate earnings
  const totalEarningsWithoutTax = deliveredShopOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );
  const serviceCharge = totalEarningsWithoutTax * 0.1;
  const totalEarnings = totalEarningsWithoutTax - serviceCharge;
  const shopIncome = totalEarnings.toFixed(2);

  const availableBalance = currentSeller?.availableBalance?.toFixed() || "0";

  // Data Grid Columns
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 250, flex: 0.7 },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.7 },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/order/${params.id}`}>
          <RxArrowRight size={20} />
        </Link>
      ),
    },
  ];

  // Data Grid Rows
  const rows = deliveredShopOrders.map((order) => ({
    id: order._id,
    quantity: order.cart.reduce((acc, item) => acc + item.qty, 0),
    total: `$${order.totalPrice}`,
    status: order.status,
  }));

  // Loading & Error States Handling
  if (sellerOrdersLoading) return <p>Loading orders...</p>;
  if (sellerOrdersError)
    return <p className="error-message">Error: {sellerOrdersError}</p>;

  return (
    <section className="overview-dashboard-wrapper">
      <h2 className="overview-dashboard-title">Overview</h2>

      <div className="summary-overview">
        {/* Account Balance */}
        <article className="article-box account-balance">
          <aside className="aside-box account-balance">
            <MdPriceChange className="icon" />
            <h3 className="subTitle">
              Account Balance of {currentSeller?.name}
            </h3>
          </aside>
          <h3 className="subTitle">${shopIncome}</h3>
          <Link to="/dashboard-withdraw-money" className="link">
            Withdraw Money
          </Link>
        </article>

        {/* Orders */}
        <article className="article-box orders-wrapper">
          <aside className="aside-box all-orders">
            <FaFirstOrderAlt className="icon" />
            <h3 className="subTitle">All Orders from {currentSeller?.name}</h3>
          </aside>
          <h3 className="subTitle">
            {sellerOrdersData ? sellerOrdersData.length : "0"}
          </h3>
          <Link to="/dashboard-orders" className="link">
            View Orders
          </Link>
        </article>

        {/* Products */}
        <article className="article-box all-products-wrapper">
          <aside className="aside-box all-products">
            <FaProductHunt className="icon" />
            <h3 className="subTitle">All Products of {currentSeller?.name}</h3>
          </aside>
          <h3 className="subTitle">
            {shopProducts ? shopProducts.length : "0"}
          </h3>
          <Link to="/dashboard-products">View Products</Link>
        </article>
      </div>

      {/* Latest Orders */}
      <h3 className="latest-orders">
        Delivered Orders of {currentSeller?.name}
      </h3>

      {/* Data Grid */}
      <div className="data-grid-wrapper">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          loading={sellerOrdersLoading} // Shows loading spinner in DataGrid
        />
      </div>
    </section>
  );
};

export default DashboardOverview;
