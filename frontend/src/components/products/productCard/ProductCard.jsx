import React, { useState } from 'react';
import './ProductCard.scss';
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Ratings from '../ratings/Ratings';
import ProductCartDetails from '../productCardDetails/ProductCardDetails';
import { addToCart } from '../../../redux/reducers/cartReducer';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../redux/reducers/wishListReducer';
import { ShortenText } from '../../../utils/textHandler/text';

// The product in the ProductCard.jsx component comes from ShopProfile.jsx component
const ProductCard = ({ product, isEvent }) => {
  // Global state variables
  const { wishList } = useSelector((state) => state.wishList);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Local state variables
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  // Display wishlist
  useEffect(() => {
    if (wishList && wishList.find((item) => item._id === product._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishList]);

  // Add to wishlist
  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  // Remove from wishlist
  const removeFromWishlistHandler = (id) => {
    setClick(!click);
    dispatch(removeFromWishlist(id));
  };

  // Add to cart handler
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((item) => item._id === id);
    if (isItemExists) {
      toast.error('Item already in cart!');
    } else if (product.stock < 1) {
      toast.error('Product is out of stock!');
    } else {
      const cartData = { ...product, qty: 1 };
      dispatch(addToCart(cartData));
      toast.success('Item added to cart successfully!');
    }
  };

  return (
    <section className="product-card">
      <figure className="image-container">
        <Link
          to={
            isEvent === true
              ? `/products/${product._id}?isEvent=true`
              : `/products/${product._id}`
          }
          className="product-card-link"
        >
          <img
            src={`${product.images && product.images}`}
            alt=""
            className="image"
          />
        </Link>
      </figure>

      <Link
        to={`/shop/preview/${product?.shop._id}`}
        className="product-card-link"
      >
        <h3 className="shop-name"> {product.shop.name} </h3>
      </Link>

      <Link
        to={
          isEvent === true
            ? `/products/${product._id}?isEvent=true`
            : `/products/${product._id}`
        }
        className="product-card-link"
      >
        <h4 className="product-name">
          {product.name.length > 40
            ? product.name.slice(0, 40) + '...'
            : product.name}
        </h4>

        <p className="product-description">
          {ShortenText(product.description, 100)}
        </p>

        {/* Ratings component */}
        <Ratings averageRating={product?.ratings} />

        <article className="product-price-wrapper">
          <h5 className={`price`}>
            Current Price{' '}
            <span className="current-price">
              $
              {product.originalPrice === 0
                ? product.originalPrice
                : product.discountPrice}
            </span>
          </h5>
          <span className={`old-price`}>
            ${product.originalPrice ? product.originalPrice : null}
          </span>

          <p className="sold-product">{product?.sold_out} sold</p>
        </article>
      </Link>

      {/* side options */}
      <figure className="icon-container">
        {click ? (
          <AiFillHeart
            className={click ? 'active' : 'passive'}
            onClick={() => removeFromWishlistHandler(product._id)}
            color={click ? 'red' : 'black'}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            className={click ? 'active' : 'passive'}
            onClick={() => addToWishlistHandler(product)}
            color={click ? 'active' : 'passive'}
            title="Add to wishlist"
          />
        )}
        <AiOutlineEye
          className="icon"
          onClick={() => setOpen(!open)}
          title="Quick view"
        />
        <AiOutlineShoppingCart
          className="icon"
          onClick={() => addToCartHandler(product._id)}
          title="Add to cart"
        />
        {open ? <ProductCartDetails setOpen={setOpen} data={product} /> : null}
      </figure>
    </section>
  );
};

export default ProductCard;
