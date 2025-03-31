import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { fetchCustomerOrders } from "../../../redux/actions/order";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import moment from "moment";

const UserOrders = () => {
  const dispatch = useDispatch();

  const { customerOrders } = useSelector((state) => state.order);
  const { data: orders = [], loading, error } = customerOrders || {};

  useEffect(() => {
    dispatch(clearOrderErrors());
    dispatch(fetchCustomerOrders());

    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  // **Process orders into rows for DataGrid**
  const rows = orders.map((order) => ({
    id: order._id,
    createdAt: order.createdAt,
    quantity:
      order.orderedItems?.reduce((total, item) => total + item.quantity, 0) ||
      0,
    method: order.payment?.method || "Unknown",
    grandTotal: order.grandTotal ?? 0,
    orderStatus: order.orderStatus || "Unknown",
  }));

  // **Columns for DataGrid**
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
      minWidth: 100,
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
      minWidth: 100,
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
      renderCell: (params) => {
        let color;

        switch (params.value.trim().toLowerCase()) {
          case "pending":
            color = "orange";
            break;
          case "processing":
            color = "lightgreen";
            break;
          case "shipped":
            color = "blue";
            break;
          case "delivered":
            color = "green";
            break;
          case "cancelled":
            color = "red";
            break;
          case "refund requested":
            color = "purple";
            break;
          case "returned":
            color = "tomato";
            break;
          case "refunded":
            color = "black";
            break;
          default:
            color = "black"; // Default color if no match
        }

        return (
          <span
            style={{
              color: color,
              fontWeight: "bold",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: "Details",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/orders/${params.id}`} style={{ textDecoration: "none" }}>
          <RxArrowRight size={20} />
        </Link>
      ),
    },
  ];

  return (
    <section
      style={{ padding: "20px" }}
      className="total-user-orders-container"
    >
      <h2 className="user-orders-title">Your Orders</h2>
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
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
    </section>
  );
};

export default UserOrders;
