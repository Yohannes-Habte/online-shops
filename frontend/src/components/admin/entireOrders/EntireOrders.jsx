import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";
import { DataGrid } from "@mui/x-data-grid";
import { fetchAllOrders } from "../../../redux/actions/order";
import { clearErrors } from "../../../redux/reducers/orderReducer";
import moment from "moment";

const EntireOrders = () => {
  const dispatch = useDispatch();

  const { allOrders } = useSelector((state) => state.order);
  const { data: orders = [], loading, error } = allOrders || {};


  useEffect(() => {
    dispatch(clearErrors("allOrders")); // Ensure errors are cleared before fetching

    dispatch(fetchAllOrders());

    return () => {
      dispatch(clearErrors("allOrders")); // Cleanup errors when unmounting
    };
  }, [dispatch]);

  // **Process orders into rows for DataGrid**const rows = orders.map((order) => ({
  const rows = orders.map((order) => ({
    id: order._id,
    createdAt: order.createdAt,
    quantity:
      order.orderedItems?.reduce((total, item) => total + item.quantity, 0) ||
      0,
    method: order.payment?.method || "Unknown",
    grandTotal: order.grandTotal ?? 0, // Ensure it's always a number
    orderStatus: order.orderStatus || "Unknown",
  }));


  // **Columns for DataGrid**
  const columns = [
    {
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 180,
      flex: 0.8,
      valueFormatter: (params) => moment(params?.value).format("DD-MM-YYYY"), // Format date
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
      renderCell: (params) => {
        return `$${(params.row.grandTotal ?? 0).toFixed(2)}`;
      },
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
        <Link
          to={`/user/order/${params.id}`}
          style={{ textDecoration: "none" }}
        >
          <RxArrowRight size={20} />
        </Link>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Entire Orders</h2>

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
  );
};



export default EntireOrders
