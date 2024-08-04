import React, { useEffect, useState } from 'react';
import './ShopOrderDetails.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  sellerOrdersFail,
  sellerOrdersRequest,
  sellerOrdersSuccess,
} from '../../../redux/reducers/orderReducer';
import { API } from '../../../utils/security/secreteKey';

const ShopOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Global vairables
  const { orders, loading } = useSelector((state) => state.order);
  const { currentSeller } = useSelector((state) => state.seller);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local variables
  const [status, setStatus] = useState('');
  const [shopOrders, setShopOrders] = useState([]);

  useEffect(() => {
    const fetchAllShopOrders = async () => {
      try {
        // dispatch(sellerOrdersRequest());
        const { data } = await axios.get(
          `${API}/orders/shop/${currentSeller._id}`
        );
        // dispatch(sellerOrdersSuccess(data.orders));
        setShopOrders(data.orders);
      } catch (error) {
        // dispatch(sellerOrdersFail(error.response.data.message));
      }
    };
    fetchAllShopOrders();
  }, [dispatch]);

  // Order details
  const data = shopOrders && shopOrders.find((order) => order._id === id);
  console.log('Order data is:', orders);

  // Update order
  const orderUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${API}/orders/update-order-status/${id}/${currentSeller._id}`,
        {
          status,
        }
      );

      toast.success('Order updated!');
      navigate('/dashboard-orders');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Refund order
  const refundOrderUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      const updateStatus = {
        status: status,
      };
      const { data } = await axios.put(
        `${API}/orders/refund-order-successful/${id}`,
        updateStatus,
        { withCredentials: true }
      );

      toast.success('Order updated!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className={`order-detail-wrapper`}>
      {/* order details and list*/}
      <article className="order-details-list-container">
        <h1 className="subTitle">Order Details</h1>

        <p className="order-list">
          <Link to="/dashboard-orders" className="link">
            Order List{' '}
          </Link>
        </p>
      </article>

      {/* order id and date */}
      <article className="order-id-and-date">
        <p className="order-id">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </p>
        <h5 className="order-placed-date">
          Order placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </article>

      {/* ordered items */}
      <div className="order-items-wrapper">
        {data &&
          data?.cart.map((item) => (
            <article key={item._id} className="order">
              <figure className="image-container">
                <img src={item.images} alt="" className="image" />
              </figure>
              <section className="name-and-quantity">
                <h5 className="subTitle">{item.name}</h5>
                <p className="price">
                  PQ: ${item.discountPrice} x {item.qty}
                </p>
              </section>
            </article>
          ))}
      </div>

      {/* Total order price */}
      <hr className="hr" />
      <h2 className="total-price">
        Total Price: <strong>US${data?.totalPrice}</strong>
      </h2>
      <hr className="hr" />

      {/* Shipping adddress and payment status */}
      <section className="shipping-address-and-payment-wrapper">
        <article className="shipping-address-wrapper">
          <h3 className="shipping-address-title">Shipping Address:</h3>
          <p className="address">
            Name:
            <span className="addrress-span">{currentUser?.name}</span>
          </p>
          <p className="address">
            Street:
            <span className="addrress-span">
              {data?.shippingAddress.address}
            </span>
          </p>
          <p className="address">
            Zip Code:
            <span className="addrress-span">
              {data?.shippingAddress?.zipCode}
            </span>
          </p>
          <p className="address">
            City:
            <span className="addrress-span">{data?.shippingAddress?.city}</span>
          </p>
          <p className="address">
            State:
            <span className="addrress-span">
              {data?.shippingAddress?.state}
            </span>
          </p>
          <p className="address">
            Country:
            <span className="addrress-span">
              {data?.shippingAddress?.country}
            </span>
          </p>
          <p className="address">
            Phone: <span className="addrress-span"> {data?.user?.phone}</span>
          </p>
          <p className="address">
            Email: <span className="addrress-span">{data?.user?.email}</span>
          </p>
        </article>

        <h3 className="payment-info-status">
          Payment Info Status:
          {data?.paymentInfo?.status ? (
            <p className="status-result"> {data?.paymentInfo?.status} </p>
          ) : (
            'Not Paid'
          )}{' '}
        </h3>
      </section>

      {/* Order Processing */}
      <h3 className="order-status">Order Status:</h3>
      {data?.status !== 'Processing refund' &&
        data?.status !== 'Successfully refunded' && (
          <form action="" className="form-process-and-refund-order">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="section-order-process"
            >
              {[
                'Processing',
                'Transferred to delivery partner',
                'Shipping',
                'Received',
                'On the way',
                'Delivered',
              ]
                .slice(
                  [
                    'Processing',
                    'Transferred to delivery partner',
                    'Shipping',
                    'Received',
                    'On the way',
                    'Delivered',
                  ].indexOf(data?.status)
                )
                .map((option, index) => (
                  <option
                    value={option}
                    key={index}
                    className="option-order-process"
                  >
                    {option}
                  </option>
                ))}
            </select>
          </form>
        )}

      {/* Refund Processing */}
      {data?.status === 'Processing refund' ||
      data?.status === 'Successfully refunded' ? (
        <form action="" className="form-process-and-refund-order">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="section-order-process"
          >
            {['Processing refund', 'Successfully refunded']
              .slice(
                ['Processing refund', 'Successfully refunded'].indexOf(
                  data?.status
                )
              )
              .map((option, index) => (
                <option
                  value={option}
                  key={index}
                  className="option-order-process"
                >
                  {option}
                </option>
              ))}
          </select>
        </form>
      ) : null}

      {/* Update status Button*/}
      <button
        type="submit"
        className={`update-status-btn`}
        onClick={
          data?.status !== 'Processing refund'
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Update Status
      </button>
    </section>
  );
};

export default ShopOrderDetails;
