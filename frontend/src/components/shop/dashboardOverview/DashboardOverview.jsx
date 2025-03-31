import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { RxArrowRight } from "react-icons/rx";
import { MdPriceChange } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import {
  deleteShopOrders,
  fetchSellerOrders,
} from "../../../redux/actions/order";
import "./DashboardOverview.scss";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import moment from "moment";

import {
  clearSellerErrors,
  fetchSingleSeller,
} from "../../../redux/actions/seller";
import OrderChart from "../charts/order/OrderChart";

const DashboardOverview = ({ setIsActive }) => {
  const dispatch = useDispatch();
  const { sellerOrders } = useSelector((state) => state.order);
  const {
    currentSeller: shopDetails,
    loading: shopLoading,
    error: shopError,
  } = useSelector((state) => state.seller);

  const {
    data: { orders = [] },
    loading,
    error,
  } = sellerOrders || {};

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

  console.log("DashboardOverview orders", orders);

  // Function to handle order deletion
  const handleDeleteOrders = () => {
    if (window.confirm("Are you sure you want to delete all orders?")) {
      dispatch(deleteShopOrders());
    }
  };

  // If order status is "Delivered" and there are no refunds or refund requests,  the order status is "Delivered"
  // If order status is "Delivered" and there are refunds or refund requests, but the count of ordered items is greater than the count of refunds or refund requests, the order status is "Delivered"

  const filteredOrders = orders
    .filter(
      (order) =>
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Refund Requested" ||
        order.orderStatus === "Refund Accepted"
    )
    .map((order) => {
      const countOrderedItems = order.orderedItems?.length;
      const countRefundRequests = order.refundRequestInfo?.length || 0;
      const countRefundedItems = order.returnedItems?.length || 0;

      if (
        countOrderedItems > 0 &&
        countRefundRequests === 0 &&
        countRefundedItems === 0
      ) {
        const salesProductCount =
          countOrderedItems > countRefundedItems &&
          countOrderedItems - countRefundedItems;
        return { ...order, orderStatus: `${salesProductCount} Delivered` };
      }

      if (
        countOrderedItems >= countRefundRequests &&
        countOrderedItems > countRefundedItems
      ) {
        const salesProductCount =
          countOrderedItems > countRefundedItems &&
          countOrderedItems - countRefundedItems;
        return { ...order, orderStatus: `${salesProductCount} Delivered` };
      }
      return null; // Exclude orders that don't meet the criteria
    })
    .filter(Boolean); // Remove null values

  console.log("filteredOrders", filteredOrders);

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    createdAt: order.createdAt,
    quantity:
      order.orderedItems?.reduce((total, item) => total + item.quantity, 0) ||
      0,
    method: order.payment?.method || "Unknown",
    grandTotal: order.grandTotal ?? 0,
    orderStatus: order.orderStatus,
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

  const totalShopIncome = shopDetails?.netShopIncome?.toFixed(2) || "0";

  const handleClick = (index) => {
    setIsActive(index);
  };

  return (
    <section className="overview-dashboard-wrapper">
      <h2 className="overview-dashboard-title">Overview</h2>

      <button
        type="button"
        onClick={handleDeleteOrders}
        disabled={loading}
        className="delete-orders-button"
      >
        {loading ? "Deleting..." : "Delete All Orders"}
      </button>

      {shopLoading ? (
        <p>Loading shop details...</p>
      ) : shopError ? (
        <p style={{ color: "red" }}>Error: {shopError}</p>
      ) : (
        <div className="summary-overview">
          <article className="article-box account-balance">
            <aside className="aside-box account-balance">
              <MdPriceChange className="icon" />
              <h3 className="subTitle">{shopDetails?.name} Account Balance</h3>
            </aside>
            <h3 className="subTitle">${totalShopIncome}</h3>
            <Link
              to="/shop/dashboard"
              className="link"
              onClick={() => handleClick(10)}
            >
              Withdraw Money
            </Link>
          </article>

          <article className="article-box orders-wrapper">
            <aside className="aside-box all-orders">
              <FaFirstOrderAlt className="icon" />
              <h3 className="subTitle">
                {" "}
                Comprehensive {shopDetails?.name} Order Report{" "}
              </h3>
            </aside>
            <h3 className="subTitle">
              {filteredOrders ? filteredOrders.length : "0"}
            </h3>
            <Link
              to="/shop/dashboard"
              className="link"
              onClick={() => handleClick(9)}
            >
              View Orders
            </Link>
          </article>

          <article className="article-box all-products-wrapper">
            <aside className="aside-box all-products">
              <FaProductHunt className="icon" />
              <h3 className="subTitle">
                {" "}
                {shopDetails?.name} Total Product Inventory{" "}
              </h3>
            </aside>
            <h3 className="subTitle">
              {shopDetails ? shopDetails?.shopProducts?.length : "0"}
            </h3>
            <Link
              to="/shop/dashboard"
              onClick={() => handleClick(5)}
              className="link"
            >
              View Products
            </Link>
          </article>
        </div>
      )}

      <OrderChart />

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
