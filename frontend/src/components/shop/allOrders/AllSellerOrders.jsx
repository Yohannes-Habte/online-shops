import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { fetchSellerOrders } from "../../../redux/actions/order";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import moment from "moment";
import "./AllSellerOrders.scss";

const statusColors = {
  paymentStatus: {
    pending: "orange",
    completed: "green",
    refunded: "blue",
    cancelled: "red",
  },
  orderStatus: {
    Pending: "orange",
    Processing: "lightblue",
    Shipped: "darkblue",
    Delivered: "green",
    Cancelled: "red",
    "Refund Requested": "pink",
    Returned: "gray",
    Refunded: "blue",
  },
};

const AllSellerOrders = () => {
  const dispatch = useDispatch();
  const { sellerOrders } = useSelector((state) => state.order);
  const { data: orders = [], loading, error } = sellerOrders || {};

  useEffect(() => {
    dispatch(fetchSellerOrders());
    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  const rows = orders.map((order) => ({
    id: order._id,
    createdAt: order.createdAt,
    quantity:
      order.orderedItems?.reduce((total, item) => total + item.quantity, 0) ||
      0,
    provider: order.payment?.provider || "Unknown",
    method: order.payment?.method || "Unknown",
    paymentStatus: order.payment?.paymentStatus || "Unknown",
    grandTotal: order.grandTotal ?? 0,
    orderStatus: order.orderStatus || "Unknown",
  }));

  const columns = [
    {
      field: "createdAt",
      headerName: "Ordered Date",
      minWidth: 180,
      flex: 0.8,
      valueFormatter: (params) => moment(params?.value).format("DD-MM-YYYY"),
      cellClassName: "left-center",
    },
    {
      field: "quantity",
      headerName: "Total Items",
      minWidth: 50,
      flex: 0.6,
      cellClassName: "left-center",
    },
    {
      field: "grandTotal",
      headerName: "Total Amount",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => `$${(params.row.grandTotal ?? 0).toFixed(2)}`,
      cellClassName: "left-center",
    },
    {
      field: "provider",
      headerName: "Payment Provider",
      minWidth: 180,
      flex: 0.8,
      cellClassName: "left-center",
    },
    {
      field: "method",
      headerName: "Payment Method",
      minWidth: 180,
      flex: 0.8,
      cellClassName: "left-center",
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <span
          style={{
            color:
              statusColors.paymentStatus[params.value.toLowerCase()] || "black",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
      cellClassName: "left-center",
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => (
        <span
          style={{
            color: statusColors.orderStatus[params.value] || "black",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
      cellClassName: "left-center",
    },
    {
      field: "action",
      headerName: "Details",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/order/${params.id}`}>
          <RxArrowRight className="icon-cell-arrow" size={20} />
        </Link>
      ),
      cellClassName: "middle-center",
    },
  ];

  return (
    <section style={{ padding: "20px" }} className="shop-orders-container">
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

export default AllSellerOrders;
