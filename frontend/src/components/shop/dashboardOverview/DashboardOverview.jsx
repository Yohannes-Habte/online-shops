import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { RxArrowRight } from "react-icons/rx";
import { MdPriceChange } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { fetchSellerOrders } from "../../../redux/actions/order";
import "./DashboardOverview.scss";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import moment from "moment";

import {
  clearSellerErrors,
  fetchSingleSeller,
} from "../../../redux/actions/seller";

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { sellerOrders } = useSelector((state) => state.order);
  const {
    currentSeller: shopDetails,
    loading: shopLoading,
    error: shopError,
  } = useSelector((state) => state.seller);

  const { data: orders = [], loading, error } = sellerOrders || {};

  useEffect(() => {
    dispatch(clearOrderErrors());
    dispatch(fetchSellerOrders());

    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearOrderErrors());
    dispatch(fetchSellerOrders());

    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearSellerErrors());
    dispatch(fetchSingleSeller());

    return () => {
      dispatch(clearSellerErrors());
    };
  }, [dispatch]);

  const deliveredShopOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  );

  const totalShopIncome = shopDetails?.netShopIncome?.toFixed(2) || "0";

  const rows = deliveredShopOrders.map((order) => ({
    id: order._id,
    createdAt: order.createdAt,
    quantity:
      order.orderedItems?.reduce((total, item) => total + item.quantity, 0) ||
      0,
    method: order.payment?.method || "Unknown",
    grandTotal: order.grandTotal ?? 0,
    orderStatus: order.orderStatus || "Unknown",
  }));

  const columns = [
    {
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 180,
      flex: 0.8,
      valueFormatter: (params) => moment(params?.value).format("DD-MM-YYYY"),
    },
    {
      field: "quantity",
      headerName: "Total Items",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "method",
      headerName: "Payment Method",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "grandTotal",
      headerName: "Total Amount",
      type: "number",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => `$${(params.row.grandTotal ?? 0).toFixed(2)}`,
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Pending" ? "orange" : "green",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Details",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/order/${params.id}`}>
          <RxArrowRight size={20} />
        </Link>
      ),
    },
  ];

  return (
    <section className="overview-dashboard-wrapper">
      <h2 className="overview-dashboard-title">Overview</h2>

      {shopLoading ? (
        <p>Loading shop details...</p>
      ) : shopError ? (
        <p style={{ color: "red" }}>Error: {shopError}</p>
      ) : (
        <div className="summary-overview">
          <article className="article-box account-balance">
            <aside className="aside-box account-balance">
              <MdPriceChange className="icon" />
              <h3 className="subTitle">
                Account Balance of {shopDetails?.name}
              </h3>
            </aside>
            <h3 className="subTitle">${totalShopIncome}</h3>
            <Link to="/dashboard-withdraw-money" className="link">
              Withdraw Money
            </Link>
          </article>

          <article className="article-box orders-wrapper">
            <aside className="aside-box all-orders">
              <FaFirstOrderAlt className="icon" />
              <h3 className="subTitle">All Orders from {shopDetails?.name}</h3>
            </aside>
            <h3 className="subTitle">
              {deliveredShopOrders ? deliveredShopOrders.length : "0"}
            </h3>
            <Link to="/dashboard-orders" className="link">
              View Orders
            </Link>
          </article>

          <article className="article-box all-products-wrapper">
            <aside className="aside-box all-products">
              <FaProductHunt className="icon" />
              <h3 className="subTitle">All Products of {shopDetails?.name}</h3>
            </aside>
            <h3 className="subTitle">{shopDetails ? shopDetails?.shopProducts?.length : "0"}</h3>
            <Link to="/dashboard-products">View Products</Link>
          </article>
        </div>
      )}

      <h3 className="latest-orders">Delivered Orders of {shopDetails?.name}</h3>

      <div style={{ padding: "20px" }}>
        <h2>Your Orders</h2>

        {loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        )}
      </div>
    </section>
  );
};

export default DashboardOverview;
