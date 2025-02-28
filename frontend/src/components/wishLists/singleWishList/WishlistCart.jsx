import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlusSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./WishlistCart.scss";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";

const WishlistCart = ({ data, removeFromWishlistHandler, setOpenWishList }) => {
  const { title, discountPrice, variants = [] } = data;
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  // Ensure product has a valid variant
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedSize, setSelectedSize] = useState(
    selectedVariant?.productSizes[0]?.size
  );

  const addToCartHandler = () => {
    const newItem = {
      ...data,
      qty: 1,
      variant: { ...selectedVariant, size: selectedSize },
    };

    // If the newItem exists in the cart, alert the user
    const isItemExist = cart.find(
      (i) =>
        i._id === newItem._id &&
        i.variant?.productColor === newItem.variant?.productColor &&
        i.variant?.size === newItem.variant?.size
    );

    if (isItemExist) {
      alert("Item already exists in the cart!");
      return;
    } else {
      dispatch(addToCart(newItem));
      dispatch(removeFromWishlistHandler(data._id));
    }

    setOpenWishList(false);
  };

  return (
    <section className="wishlist-cart-wrapper">
      <div className="wishlist-add-to-cart-btn-container">
        <button className="wishlist-add-to-cart-btn" onClick={addToCartHandler}>
          <FaPlusSquare className="add-to-cart-icon" title="Add to Cart" /> Add
          To Cart
        </button>
      </div>

      <figure
        className="image-container"
        onClick={() => setOpenWishList(false)}
      >
        <Link to={`/products/${data._id}`}>
          <img
            src={selectedVariant?.productImage}
            alt={title}
            className="image"
          />
        </Link>
      </figure>
      <h3
        className="single-wishlist-product-title"
        onClick={() => setOpenWishList(false)}
      >
        {" "}
        <Link to={`/products/${data._id}`}>{title}</Link>{" "}
      </h3>
      <p className="single-wishlist-product-price">
        Price:{" "}
        <strong className="price-amount">
          ${discountPrice?.toFixed(2) || "0.00"}
        </strong>
      </p>

      {/* Product Color Selection */}
      <div className="wishlist-product-variant-selection-container">
        <label
          htmlFor="product-color"
          className="wishlist-product-variant-label"
        >
          Color:
        </label>
        <select
          value={selectedVariant?.productColor}
          onChange={(e) =>
            setSelectedVariant(
              variants.find((v) => v.productColor === e.target.value) ||
                selectedVariant
            )
          }
          className="wishlist-product-variant-select-field"
        >
          {variants.map((variant) => (
            <option
              key={variant.productColor}
              value={variant.productColor}
              className="wishlist-product-variant-option"
            >
              {variant.productColor}
            </option>
          ))}
        </select>
      </div>

      {/* Product Size Selection */}
      <div className="wishlist-product-variant-selection-container">
        <label
          htmlFor="product-size"
          className="wishlist-product-variant-label color-label"
        >
          Size:
        </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="wishlist-product-variant-select-field"
        >
          {selectedVariant?.productSizes.map((size) => (
            <option
              key={size.size}
              value={size.size}
              className="wishlist-product-variant-option"
            >
              {size.size}{" "}
              {size.stock > 0 ? `(Stock: ${size.stock})` : `(Out of stock)`}
            </option>
          ))}
        </select>
      </div>

      <div className="wishlist-cart-delete-btn-container">
        <button
          className="wishlist-remove-from-cart-btn"
          onClick={() => {
            removeFromWishlistHandler(data._id);
          }}
        >
          <MdDelete className="delete-icon" title="Remove from Wishlist" />{" "}
          Delete
        </button>
      </div>
    </section>
  );
};

export default WishlistCart;
