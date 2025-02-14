import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API } from "../../../utils/security/secreteKey";
import "./UserOrderDetails.scss";

const initialState = {
  comment: "",
  rating: 1,
};
const UserOrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [orderInfos, setOrderInfos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    const fetchSingleOrder = async () => {
      try {
        const { data } = await axios.get(`${API}/orders/${id}`, {
          withCredentials: true,
        });
        setOrderInfos(data.order);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };
    fetchSingleOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setRatings(initialState);
    setOpen(false);
  };

  // Review product handler
  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      const newProductReview = {
        userId: currentUser._id,
        ratings,
        productId: selectedProduct?._id,
        orderId: id,
      };

      const { data } = await axios.put(
        `${API}/products/product/review`,
        newProductReview,
        { withCredentials: true }
      );

      toast.success(data.message);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review submission failed");
    }
  };

  // Request refund handler
  const refundHandler = async () => {
    if (!window.confirm("Are you sure you want to request a refund?")) return;

    try {
      const refundRequest = {
        status: "Processing refund",
        reason: refundReason,
      };
      const { data } = await axios.put(
        `${API}/orders/${id}/refund`,
        refundRequest
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Refund request failed");
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="user-order-details">
      <header className="order-header">
        <h1>Order Details</h1>
        <p className="order-id">
          Order ID: <span>#{orderInfos?._id?.slice(0, 8)}</span>
        </p>
        <p className="order-date">
          Placed on: <strong>{orderInfos?.createdAt?.slice(0, 10)}</strong>
        </p>
      </header>

      {/* Ordered Products Section */}
      <section className="ordered-items">
        <h2>Ordered Items</h2>
        {orderInfos?.orderedItems?.map((product) => (
          <article key={product._id} className="product-card">
            <figure className="product-image">
              <img
                src={product?.productImage || "https://via.placeholder.com/150"}
                alt={product?.title}
              />
            </figure>
            <div className="product-info">
              <h3>{product?.title}</h3>
              <p>
                Brand: <strong>{product?.brand?.brandName}</strong>
              </p>
              <p>Category: {product?.category?.categoryName}</p>
              <p>Subcategory: {product?.subcategory?.subcategoryName}</p>
              <p>Color: {product?.productColor}</p>
              <p>Size: {product?.size}</p>
              <p>Quantity: {product?.quantity}</p>
              <p>
                Price: <strong>${product?.price}</strong>
              </p>
              <p>
                Total: <strong>${product?.total}</strong>
              </p>

              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedProduct(product);
                }}
              >
                Leave a Review
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Review Modal */}
      {open && (
        <div className="review-modal">
          <h2>Write a Review</h2>
          <form onSubmit={reviewHandler}>
            <label>Rating:</label>
            <select
              name="rating"
              id="rating"
              value={ratings.rating}
              onChange={handleChange}
            >
              <option value="default">Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label>Comment:</label>
            <textarea
              name="comment"
              id="comment"
              value={ratings.comment}
              onChange={handleChange}
            />

            <button type="submit">Submit Review</button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Refund Request Section */}
      <section className="refund-section">
        <h2>Request Refund</h2>
        <textarea
          name="refundReason"
          id="refundReason"
          rows={5}
          cols={30}
          placeholder="Enter refund reason..."
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
        />
        <button onClick={refundHandler} className="refund-request-btn">
          Submit Refund Request
        </button>
      </section>

      {/* Refund Details Section */}
      {orderInfos?.payment?.refunds?.length > 0 && (
        <section className="refund-details">
          <h2>Refund Details</h2>
          {orderInfos.payment.refunds.map((refund, index) => (
            <div key={index} className="refund-item">
              <p>
                <strong>Refund ID:</strong> {refund.refundId}
              </p>
              <p>
                <strong>Amount:</strong> ${refund.amount.toFixed(2)}
              </p>
              <p>
                <strong>Reason:</strong> {refund.reason || "No reason provided"}
              </p>
              <p>
                <strong>Refund Date:</strong>{" "}
                {new Date(refund.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Order Summary with Shipping Address */}
      <footer className="order-summary">
        <div className="summary-details">
          <h2>Order Summary</h2>
          <p>
            Subtotal: <strong>${orderInfos?.subtotal.toFixed(2)}</strong>
          </p>
          <p>
            Shipping Fee: <strong>${orderInfos?.shippingFee.toFixed(2)}</strong>
          </p>
          <p>
            Tax: <strong>${orderInfos?.tax.toFixed(2)}</strong>
          </p>
          <p>
            Service Fee: <strong>${orderInfos?.serviceFee.toFixed(2)}</strong>
          </p>
          <h3>
            Grand Total: <strong>${orderInfos?.grandTotal.toFixed(2)}</strong>
          </h3>
        </div>

        {/* Shipping Address */}
        <div className="shipping-address">
          <h2>Shipping Address</h2>
          <p>
            <strong>Name:</strong> {currentUser?.name}
          </p>
          <p>
            <strong>Address:</strong> {orderInfos?.shippingAddress?.address}
          </p>
          <p>
            <strong>City:</strong> {orderInfos?.shippingAddress?.city}
          </p>
          <p>
            <strong>State:</strong> {orderInfos?.shippingAddress?.state}
          </p>
          <p>
            <strong>Zip Code:</strong> {orderInfos?.shippingAddress?.zipCode}
          </p>
          <p>
            <strong>Country:</strong> {orderInfos?.shippingAddress?.country}
          </p>
          <p>
            <strong>Phone:</strong> {orderInfos?.shippingAddress?.phoneNumber}
          </p>
        </div>
      </footer>
    </section>
  );
};

export default UserOrderDetails;
