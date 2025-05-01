import { useEffect } from "react";
import { fetchSellerOrders } from "../../../redux/actions/order";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";
import "./ReturnItems.scss";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import moment from "moment";
import SingleOrderDelete from "../../../utils/globalFunctions/SingleOrderDelete";

const ReturnItems = () => {
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

  // Delete a single order
  const handleDeleteOrder = (orderId) => {
    SingleOrderDelete(orderId, dispatch);
  };

  // Filter returned order items
  const returnedOrder = orders.filter(
    (order) => order.orderStatus === "Returned"
  );

  const rows = returnedOrder.map((order) => {
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
      renderCell: (params) => (
        <div className="order-action-table-icon-wrapper">
          <Link to={`/shop/order/${params.id}`}>
            <FaEdit className="display-order-icon" size={20} />
          </Link>

          <FaTrash
            onClick={() => handleDeleteOrder(params.row.id)}
            className="order-delete-icon"
          />
        </div>
      ),
    },
  ];
  return (
    <section
      style={{ padding: "20px" }}
      className="shop-return-items-container"
    >
      <h2 className="shop-return-items-title">Return Items</h2>
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

export default ReturnItems;
