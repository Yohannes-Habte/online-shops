import React, { useEffect } from 'react';
import './ShopRefunds.scss';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import {
  sellerOrdersFail,
  sellerOrdersRequest,
  sellerOrdersSuccess,
} from '../../../redux/reducers/orderReducer';
import axios from 'axios';
import { API } from '../../../utils/security/secreteKey';

const ShopRefunds = () => {
  // Global variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // Display all of a seller
  useEffect(() => {
    const sellerOrders = async () => {
      try {
        dispatch(sellerOrdersRequest());

        const { data } = await axios.get(
          `${API}/orders/shop/${currentSeller._id}`
        );

        dispatch(sellerOrdersSuccess(data.orders));
      } catch (error) {
        dispatch(sellerOrdersFail(error.response.data.message));
      }
    };
    sellerOrders();
  }, []);

  // Filter all 'Processing refund' or 'Successfully refunded'
  const refundOrders =
    orders &&
    orders.filter(
      (order) =>
        order.status === 'Processing refund' ||
        order.status === 'Successfully refunded'
    );

  // Columns for 'Processing refund' or/and 'Successfully refunded' orders
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
      headerName: 'Quantity',
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
          <Link to={`/shop/order/${params.id}`}>
            <AiOutlineArrowRight size={20} />
          </Link>
        );
      },
    },
  ];

  // Rows for 'Processing refund' or/and 'Successfully refunded' orders
  const row = [];

  refundOrders &&
    refundOrders.forEach((order) => {
      row.push({
        id: order._id,
        quantity: order.cart.length,
        total: '$ ' + order.totalPrice,
        status: order.status,
      });
    });
  return (
    <section className="shop-refunds-container">
      <h1 className="shop-refunds-title"> Shop Refunds</h1>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </section>
  );
};

export default ShopRefunds;
