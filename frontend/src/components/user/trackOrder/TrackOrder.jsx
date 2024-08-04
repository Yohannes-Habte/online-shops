import React, { useEffect, useState } from 'react';
import './TrackOrder.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TrackOrderCard from '../trackOrderCard/TrackOrderCard';
import { API } from '../../../utils/security/secreteKey';

const TrackOrder = () => {
  const { id } = useParams();
  // Global state variables
  const { orders } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
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

  // =============================================================
  // Find the order that a user want to track
  // =============================================================
  const orderData = userOrders && userOrders.find((order) => order._id === id);
  console.log('order data', orderData);

  return (
    <section className="user-orders-wrraper">
      {orderData && orderData?.status === 'Processing' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'Transferred to delivery partner' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'Shipping' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'Received' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'On the way' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'Delivered' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'Processing refund' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : orderData?.status === 'Successfully refunded' ? (
        <TrackOrderCard
          user={currentUser}
          shop={currentSeller}
          order={orderData}
        />
      ) : null}
    </section>
  );
};

export default TrackOrder;
