import { useEffect } from "react";
import moment from "moment";
import "./ShopRefunds.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../../../redux/actions/order";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

const ShopRefunds = () => {
  // Global variables
  const dispatch = useDispatch();
  const { sellerOrders } = useSelector((state) => state.order);
  const {
    data: { orders = [] },
    loading,
    error,
  } = sellerOrders || {};

  useEffect(() => {
    dispatch(fetchSellerOrders());
    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

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
      minWidth: 150,
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
      cellClassName: "left-center",
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 140,
      flex: 0.7,
      cellClassName: "left-center",
    },

    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: () => (
        <div className="order-action-table-icon-wrapper">
          <FaEdit className="display-order-icon" size={20} />

          <FaTrash className="order-delete-icon" />
        </div>
      ),
    },
  ];

  // Filter orders based on Refund Accepted status for a specific seller
  const refundAcceptedOrders =
    orders && orders.filter((order) => order.orderStatus === "Refund Accepted");

  const rows = refundAcceptedOrders.map((order) => {
    const formattedDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-GB")
      : "Unknown";

    return {
      id: order._id,
      createdAt: formattedDate,
      quantity:
        order.orderedItems?.reduce((total, item) => total + item.quantity, 0) ||
        0,
      provider: order.payment?.provider || "Unknown",
      method: order.payment?.method || "Unknown",
      paymentStatus: order.payment?.paymentStatus || "Unknown",
      grandTotal: order.grandTotal ?? 0,
      orderStatus: order.orderStatus || "Unknown",
    };
  });
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

export default ShopRefunds;
