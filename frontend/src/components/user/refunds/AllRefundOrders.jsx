import React, { useEffect } from 'react';
import { RxArrowRight } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import {
  userOrdersFail,
  userOrdersRequest,
  userOrdersSuccess,
} from '../../../redux/reducers/orderReducer';
import axios from 'axios';
import { API } from '../../../utils/security/secreteKey';

const AllRefundOrders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // Display all orders of a user
  useEffect(() => {
    const userOrders = async () => {
      try {
        dispatch(userOrdersRequest());

        const { data } = await axios.get(
          `${API}/orders/user/${currentUser._id}`
        );

        dispatch(userOrdersSuccess(data.orders));
      } catch (error) {
        dispatch(userOrdersFail(error.response.data.message));
      }
    };
    userOrders();
  }, []);

  // ===================================================================================
  // Filter all 'Processing refund' orders
  // ===================================================================================
  const refundOrders =
    orders &&
    orders.filter((product) => product.status === 'Processing refund');

  // Columns of 'Processing refund' orders
  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

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
      field: 'quantity',
      headerName: 'Product Quantity',
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
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <RxArrowRight size={20} />
          </Link>
        );
      },
    },
  ];

  // Rows of 'Processing refund' orders
  const row = [];

  refundOrders &&
    refundOrders.forEach((order) => {
      row.push({
        id: order._id,
        quantity: order.cart.length,
        total: '$' + order.totalPrice,
        status: order.status,
      });
    });

  return (
    <div className="order-refunds-wrapper">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

export default AllRefundOrders;
