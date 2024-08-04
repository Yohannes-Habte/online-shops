import React, { useEffect, useState } from 'react';
import './UserOrderDetails.scss';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross1 } from 'react-icons/rx';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  userOrdersFail,
  userOrdersRequest,
  userOrdersSuccess,
} from '../../../redux/reducers/orderReducer';
import { API } from '../../../utils/security/secreteKey';

const UserOrderDetails = () => {
  // The orderId is ...
  const { id } = useParams();
  console.log('param id = ', id);
  // Global state variables
  const { orders } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local state variables for reviewing a product
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Find a specific order
  const order = orders && orders.find((item) => item._id === id);

  const rest = () => {
    setComment('');
    setRating(0);
    setOpen(false);
  };

  // Product Review handler
  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      const newProductReview = {
        user: currentUser,
        rating: rating,
        comment: comment,
        productId: selectedProduct?._id,
        orderId: id,
      };

      const { data } = await axios.put(
        `${API}/products/product/review`,
        newProductReview
      );

      toast.success(data.message);
      rest();
    } catch (error) {
      toast.error(error);
    }
  };

  // ==============================================================================
  // Refund handler function for a user request to a seller
  // ==============================================================================
  const refundHandler = async () => {
    try {
      const refundStatus = {
        status: 'Processing refund',
      };
      const { data } = await axios.put(
        `${API}/orders/${id}/refund-order`,
        refundStatus
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className={`user-order-details-container`}>
      <h1 className="title"> Single Order Details</h1>
      {/* order id and date */}
      <article className="order-id-and-date">
        <p className="order-id">
          Order ID: <span>#{order?._id?.slice(0, 8)}</span>
        </p>
        <h5 className="order-placed-date">
          Order placed on: <span>{order?.createdAt?.slice(0, 10)}</span>
        </h5>
      </article>
      {/* ordered products */}
      <div className="ordered-items-wrapper">
        {order &&
          order?.cart.map((product) => {
            return (
              <section
                key={product._id}
                className="image-name-quantity-wrapper"
              >
                <figure className="image-container">
                  <img
                    src={product.images}
                    alt={product.name}
                    className="image"
                  />
                </figure>

                <article className="name-price-wrapper">
                  <h4 className="subTitle">{product.name}</h4>
                  <p className="price">
                    PQ: ${product.discountPrice} x {product.qty}
                  </p>
                </article>
                {!product.isReviewed && order?.status === 'Delivered' ? (
                  <h4
                    className={`review-btn`}
                    onClick={() => setOpen(true) || setSelectedProduct(product)}
                  >
                    Write a review
                  </h4>
                ) : null}
              </section>
            );
          })}
      </div>
      {/* Ordered product review popup */}
      {open && (
        <div className="modal-container">
          <article className="review-order-wrapper">
            <RxCross1 onClick={() => setOpen(false)} className="close-icon" />

            <h2 className="review-title">Give a Review</h2>

            {/* Order product image */}
            <div className="selected-item-wrapper">
              <figure className="image-container">
                <img
                  src={selectedProduct?.images}
                  alt={selectedProduct.name}
                  className="image"
                />
              </figure>

              {/* Order product name and ratings */}

              <article className="name-quantity-rating">
                <h3 className="name">{selectedProduct?.name}</h3>
                <p className="quanity">
                  ${selectedProduct?.discountPrice} x {selectedProduct?.qty}
                </p>

                {/* ratings */}
                <h3 className="rating">
                  Rating <span style={{ color: 'red' }}>*</span>
                </h3>

                {/* Rating usring Starts of 1 to 5 scale for ordered products*/}
                <div className="star-rating-wrapper">
                  {[1, 2, 3, 4, 5].map((i) =>
                    rating >= i ? (
                      <AiFillStar
                        key={i}
                        className="rated-icon"
                        onClick={() => setRating(i)}
                      />
                    ) : (
                      <AiOutlineStar
                        key={i}
                        className="unratedicon"
                        onClick={() => setRating(i)}
                      />
                    )
                  )}
                </div>
              </article>
            </div>

            {/* Form for user to write comment for the order placed */}
            <form className="form">
              <div className="input-container">
                <textarea
                  name="comment"
                  id="comment"
                  cols="20"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was your product? Write your feeling about it! (Optional)"
                  className="text-area"
                ></textarea>
                <label htmlFor="comment" className="input-label">
                  Write a comment
                </label>
                <span className="input-highlight"></span>
              </div>
              <button
                onClick={rating > 0 ? reviewHandler : null}
                className="comment-btn"
                type="submit"
              >
                Submit
              </button>
            </form>
          </article>
        </div>
      )}
      <hr className="hr" />
      {/* Total Price */}
      <h2 className="total-price">
        Total Price: <strong>${order?.totalPrice}</strong>
      </h2>
      <hr className="hr" />
      {/* Shopping address */}
      <div className="shipping-paymentinfo-refund-container">
        <article className="shipping-address">
          <h4 className="subTitle">Shipping Address:</h4>
          <p className="address">{`${order?.shippingAddress?.address}`}</p>
          <p className="address">{order?.shippingAddress?.country}</p>
          <p className="address">{order?.shippingAddress?.state}</p>
          <p className="address">{order?.shippingAddress?.city}</p>
          <p className="address">{order?.user?.phoneNumber}</p>
        </article>

        <article className="status-wrapper">
          <h4 className="subTitle">Payment Info:</h4>
          <p>
            Status:
            {order?.paymentInfo?.status
              ? order?.paymentInfo?.status
              : 'Not Paid'}
          </p>

          {order?.status === 'Delivered' && (
            <button className={`give-refund-btn`} onClick={refundHandler}>
              Refund Me
            </button>
          )}
        </article>
      </div>
      {/* Send Message button */}
      <Link to="/contact">
        <button className={`send-message-btn`}>Send Message</button>
      </Link>{' '}
    </section>
  );
};

export default UserOrderDetails;
