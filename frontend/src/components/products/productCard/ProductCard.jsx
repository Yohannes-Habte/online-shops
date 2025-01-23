import "./ProductCard.scss";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import Ratings from "../ratings/Ratings";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { ShortenText } from "../../../utils/textHandler/text";

const ProductCard = ({ product }) => {
  const {
    title,
    description,
    originalPrice,
    discountPrice,
    soldOut,
    variants,
  } = product;
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // State to manage selected color and size
  const [selectedVariant, setSelectedVariant] = useState(variants[0]); // Default color variant
  const [selectedSize, setSelectedSize] = useState(
    variants[0]?.productSizes[0]?.size // Default size for the first variant
  );

  // Add to cart handler
  const addToCartHandler = () => {
    const isItemExists =
      cart &&
      cart.find(
        (item) =>
          item._id === product._id &&
          item.variant.productColor === selectedVariant.productColor &&
          item.variant.size === selectedSize
      );

    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (
      selectedVariant.productSizes.find((size) => size.size === selectedSize)
        ?.stock < 1
    ) {
      toast.error("Selected size is out of stock!");
    } else {
      const cartData = {
        ...product,
        qty: 1,
        variant: { ...selectedVariant, size: selectedSize },
      };
      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <section className={"product-card"}>
      <figure className="image-container">
        <Link to={`/products/${product._id}`}>
          <img
            src={selectedVariant.productImage}
            alt={title}
            className="product-image"
          />
        </Link>
      </figure>

      <div className="product-details">
        <h3 className="shop-name">{product.shop.name}</h3>
        <Link to={`/products/${product._id}`}>
          <h4 className="product-title">{ShortenText(title, 40)}</h4>
        </Link>
        <p className="product-description">{ShortenText(description, 100)}</p>
        <div className="display-rating-flex-row">
          Rating:
          <Ratings averageRating={product?.ratings} />
          <span className="reviewers-number">
            {product?.ratings?.count || 0} people reviewed this product
          </span>
        </div>

        <div className="product-price-sold-out-wrapper">
          <div className="price-wrapper">
            <span className="discount-price">
              Price: <strong className="price">${discountPrice}</strong>
            </span>
            {originalPrice && originalPrice > discountPrice && (
              <span className="original-price">${originalPrice}</span>
            )}
          </div>
          <div className="sold-out-wrapper">Sold: {soldOut}</div>
        </div>

        {/* Color Selector */}
        <div className="variant-selector">
          <label htmlFor="color-selector">Choose Color:</label>
          <select
            id="color-selector"
            onChange={(e) => {
              const selected = variants.find(
                (variant) => variant.productColor === e.target.value
              );
              setSelectedVariant(selected);
              setSelectedSize(selected?.productSizes[0]?.size); // Reset size on color change
            }}
          >
            {variants.map((variant, index) => (
              <option key={index} value={variant.productColor}>
                {variant.productColor}
              </option>
            ))}
          </select>
        </div>

        {/* Size Selector */}
        <div className="variant-selector">
          <label htmlFor="size-selector">Choose Size:</label>
          <select
            id="size-selector"
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {selectedVariant.productSizes.map((sizeObj, index) => (
              <option key={index} value={sizeObj.size}>
                {sizeObj.size} {sizeObj.stock < 1 ? "(Out of Stock)" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`add-to-cart-btn ${
            soldOut || !selectedSize ? "disabled" : ""
          }`}
          onClick={addToCartHandler}
        >
          <AiOutlineShoppingCart /> Add to Cart
        </button>
      </div>
    </section>
  );
};

export default ProductCard;
