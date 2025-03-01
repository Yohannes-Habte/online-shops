import { useEffect, useState } from "react";
import "./TrackOrder.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TrackOrderCard from "../trackOrderCard/TrackOrderCard";
import { fetchCustomerOrders } from "../../../redux/actions/order";
import { clearOrderErrors } from "../../../redux/reducers/orderReducer";

const TrackOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Global state variables
  const { currentUser } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const { customerOrders } = useSelector((state) => state.order);

  const { data: orders = [], loading, error } = customerOrders || {};
  const [orderData, setOrderData] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchCustomerOrders());
    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  // Find the order based on the ID passed in the URL params
  useEffect(() => {
    if (orders.length > 0) {
      const foundOrder = orders.find((order) => order._id === id);
      setOrderData(foundOrder);
    }
  }, [orders, id]);

  // Handle if the order is not found
  if (!orderData) {
    return <div className="error-message">Order not found.</div>;
  }

  // Check order status
  const getOrderStatus = (status) => {
    switch (status) {
      case "Processing":
        return "Processing";
      case "Shipped":
        return "Shipped";
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      case "Refund Requested":
        return "Refund Requested";
      case "Returned":
        return "Returned";
      case "Refunded":
        return "Refunded";
      default:
        return "Pending";
    }
  };

  return (
    <section className="user-orders-wrapper">
      {loading && (
        <div className="loading-message">Loading order details...</div>
      )}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && orderData && (
        <>
          <h2 className="order-status-title">
            Order Status: {getOrderStatus(orderData.orderStatus)}
          </h2>

          {/* Render statusHistory if it exists */}
          {orderData.statusHistory && orderData.statusHistory.length > 0 ? (
            <div className="order-status-history">
              <h3 className="order-status-history-title">Status History</h3>
              <ul className="status-history-processes-list">
                {orderData.statusHistory.map((status, index) => (
                  <li key={index} className="status-history-process">
                    <p className="status-history-message">
                      <strong className="status-info-strong">
                        {getOrderStatus(status.status)}:
                      </strong>
                      <span className="status-info-span">{status.message}</span>
                      <span className="status-info-span">
                        {" "}
                        - {new Date(status.changedAt).toLocaleDateString()}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>No status history available.</div>
          )}

          {/* Render TrackOrderCard with relevant data */}
          <TrackOrderCard
            user={currentUser}
            shop={currentSeller}
            order={orderData}
          />
        </>
      )}
    </section>
  );
};

export default TrackOrder;
