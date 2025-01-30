import { useEffect } from "react";
import "./AdminDashboardOrders.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/adminSidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/adminHeader/AdminHeader";

import moment from "moment";
import { fetchAllOrders } from "../../../redux/actions/order";
import { clearErrors } from "../../../redux/reducers/orderReducer";

const AdminDashboardOrders = () => {
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

   const handleDelete = async () => {}
 
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
          <div className="action-btns">
            <button
              className="btn btn-view"
              onClick={() => history.push(`/admin/orders/${params.id}`)}
            >
              View
            </button>
            <button
              className="btn btn-delete"
              onClick={() => handleDelete(params.id)}
            >
              Delete
            </button>
          </div>
       ),
     },
   ];
  return (
    <main className="admin-dashboard-orders-page">
      <AdminHeader />
      <section className="admin-dashboard-orders-page-container">
        <h1 className="admin-dashboard-orders-page-title">Shops Orders</h1>
        <div className="wrapper">
          <AdminSidebar />
          <div className="orders-table">
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
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardOrders;
