import React, { useEffect, useState } from 'react';
import './ProductCardDetails.scss';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../../redux/reducers/cartReducer';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../redux/reducers/wishListReducer';

const ProductCartDetails = ({ setOpen, data }) => {
  // Global state variables
  const { cart } = useSelector((state) => state.cart);
  const { wishList } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  // Local state variables
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(false);

  // Hanlde message submit
  const handleMessageSubmit = () => {};

  // decreate count
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  // increasing count
  const incrementCount = () => {
    if (data.stock > count) {
      setCount(count + 1);
    } else {
      toast.error(
        'The maximum available in the stock is reached! If you want more, please send us message!'
      );
    }
  };

  // Add to cart
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error('Item already in cart!');
    } else if (data.stock < count) {
      toast.error('Product is out of stock!');
    } else {
      const cartData = { ...data, qty: count };
      dispatch(addToCart(cartData));
      toast.success('Item added to cart successfully!');
    }
  };

  // Display wishlist
  useEffect(() => {
    if (wishList && wishList.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishList]);

  // Remove from wishlist
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  // Add to wishlist
  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div className="product-cart-details-modal">
      {data ? (
        <section className="all-product-details-container">
          <RxCross1 className="close-icon" onClick={() => setOpen(false)} />

          {/* Left box */}
          <article className="left-box">
            <figure className="image-container">
              <Link to={`/shop/preview/${data._id}`} className="flex">
                <img src={data.images} alt={data.name} className="image" />
              </Link>
            </figure>

            <article className="info-wrapper">
              <h3 className={`product-name`}>{data.name}</h3>
              <p className="rating">{data?.ratings} Ratings</p>
              <h3 onClick={handleMessageSubmit} className="send-message-btn">
                Send Message <AiOutlineMessage className="message-icon" />{' '}
              </h3>
              <h5 className="sold-out">(50) Sold out</h5>
            </article>
          </article>

          {/* Right box */}
          <article className="right-box">
            <h2 className={`product-title`}>{data.name}</h2>
            <p className="description">{data.description}</p>

            <section className="price-wrapper">
              <p className={`old-price`}>
                ${data.originalPrice ? data.originalPrice : null}
              </p>

              <h3 className={`new-price`}>
                ${data.originalPrice - data.discountPrice}
              </h3>

              <article className="quantity-management">
                <button className="quantity-btn" onClick={decrementCount}>
                  -
                </button>
                <h3 className="quantity">{count}</h3>
                <button
                  disabled={data.stock < count}
                  className="quantity-btn"
                  onClick={incrementCount}
                >
                  +
                </button>
              </article>

              <div className="wishlist">
                {click ? (
                  <AiFillHeart
                    className="wishlist-icon"
                    onClick={() => removeFromWishlistHandler(data._id)}
                    color={click ? 'red' : '#333'}
                    title="Remove from wishlist"
                  />
                ) : (
                  <AiOutlineHeart
                    className="wishlist-icon"
                    onClick={() => addToWishlistHandler(data)}
                    title="Add to wishlist"
                  />
                )}
              </div>

              <p
                className={`add-to-cart-btn`}
                onClick={() => addToCartHandler(data._id)}
              >
                Add to cart <AiOutlineShoppingCart className="add-icon" />
              </p>
            </section>
          </article>
        </section>
      ) : null}
    </div>
  );
};

export default ProductCartDetails;
