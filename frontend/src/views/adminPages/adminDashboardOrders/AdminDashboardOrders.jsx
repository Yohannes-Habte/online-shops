import React, { useEffect, useState } from 'react';
import './AdminDashboardOrders.scss';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from '../../../components/admin/adminSidebar/AdminSidebar';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';
import { getAllOrdersOfAdmin } from '../../../redux/actions/order';
import axios from 'axios';
import { API } from '../../../utils/security/secreteKey';
import { toast } from 'react-toastify';

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  const [orders, setOrders] = useState([]);

  // Get all orders
  useEffect(() => {
    const allOrders = async () => {
      try {
        const { data } = await axios.get(`${API}/orders`);
        setOrders(data.orders);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    allOrders();
  }, []);

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 200, flex: 0.7 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      // cellClassName: (params) => {
      //   return params.getValue(params.id, 'status') === 'Delivered'
      //     ? 'greenColor'
      //     : 'redColor';
      // },
    },
    {
      field: 'itemsQty',
      headerName: 'Order Quantity',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: 'createdAt',
      headerName: 'Order Date',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  orders &&
    orders.forEach((order) => {
      row.push({
        id: order._id,
        itemsQty: order?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: order?.totalPrice + ' $',
        status: order?.status,
        createdAt: order?.createdAt.slice(0, 10),
      });
    });
  return (
    <main className="admin-dashboard-orders-page">
      <AdminHeader />
      <section className="admin-dashboard-orders-page-container">
        <h1 className="admin-dashboard-orders-page-title">Shops Orders</h1>
        <div className="wrapper">
          <AdminSidebar />
          <div className="orders-table">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardOrders;
