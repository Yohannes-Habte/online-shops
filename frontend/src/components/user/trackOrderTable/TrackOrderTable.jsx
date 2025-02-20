import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { RxArrowRight } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCustomerOrders } from "../../../redux/actions/order";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import "./TrackOrderTable.scss";

const TrackOrderTable = () => {
  const dispatch = useDispatch();

  // Extract order state from Redux store
  const { customerOrders } = useSelector((state) => state.order);
  const { data: orders = [], loading, error } = customerOrders || {};

  useEffect(() => {
    dispatch(fetchCustomerOrders());

    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  // Define table columns
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 130, flex: 0.7 },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 50,
      maxWidth: 60,
      flex: 0.7,
    },
    {
      field: "grandTotal",
      headerName: "Total ($)",
      type: "number",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },

    {
      field: "method",
      headerName: "Payment Method",
      minWidth: 150,
      flex: 0.9,
    },

    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 130,
      flex: 0.7,
      // Add color styling for paymentStatus
      cellClassName: (params) => {
        if (params.value === "completed") return "payment-completed";
        if (params.value === "pending") return "payment-pending";
        return "";
      },
    },

    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 130,
      flex: 0.7,
      // Add color styling for orderStatus
      cellClassName: (params) => {
        if (params.value === "Pending") return "order-pending";
        if (params.value === "Processing") return "order-processing";
        if (params.value === "Shipped") return "order-shipped";
        if (params.value === "Delivered") return "order-delivered";
        return "";
      },
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`} className="order-link">
          <RxArrowRight size={20} />
        </Link>
      ),
    },
  ];

  // Transform orders into rows for the table
  const rows = Array.isArray(orders)
    ? orders.map((order) => ({
        id: order._id || "N/A",
        orderStatus: order.orderStatus || "Unknown",
        itemsQty: Array.isArray(order.orderedItems)
          ? order.orderedItems.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            )
          : 0,
        grandTotal: order.grandTotal || 0,
        method: order.payment?.method || "N/A",
        paymentStatus: order.payment?.paymentStatus || "N/A",
      }))
    : [];

  return (
    <div className="track-order-table">
      {loading && <p>Loading orders...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </div>
  );
};

export default TrackOrderTable;
