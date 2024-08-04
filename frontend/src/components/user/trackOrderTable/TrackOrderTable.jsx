import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxArrowRight } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';

const TrackOrderTable = () => {
  const params = useParams();
  console.log('Params', params);

  // Global state variables
  const { currentUser } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // Local state variable
  const [userOrders, setUserOrders] = useState([]);

  // Get all user orders
  useEffect(() => {
    const getAllUserOrders = async () => {
      try {
        const { data } = await axios.get(
          `${API}/orders/user/${currentUser._id}`
        );
        setUserOrders(data.orders);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getAllUserOrders();
  }, []);

  // Tack order columns
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
      field: 'itemsQty',
      headerName: 'Items Qty',
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
          <Link to={`/user/track/order/${params.id}`}>
            <RxArrowRight size={20} />
          </Link>
        );
      },
    },
  ];

  // Tack order rows
  const row = [];

  userOrders &&
    userOrders.forEach((product) => {
      row.push({
        id: product._id,
        quantity: product.cart.length,
        total: '$' + product.totalPrice,
        status: product.status,
      });
    });

  return (
    <div className="track-order-table">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default TrackOrderTable;
