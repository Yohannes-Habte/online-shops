import { useState } from "react";
import "./EventCard.scss";
import CountDown from "../countDown/CountDown";
import Ratings from "../../products/ratings/Ratings";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addEventToCart } from "../../../redux/reducers/cartReducer";

const EventCard = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState(data?.images?.[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // ✅ Prevent errors if data is missing
  if (!data || Object.keys(data).length === 0) {
    return (
      <section className="event-card-container">
        <p className="no-event-message">No event available.</p>
      </section>
    );
  }

  const isOutOfStock = data.totalInventory < 1;
  const isDisabled =
    data.eventStatus === "completed" ||
    data.eventStatus === "canceled" ||
    isOutOfStock ||
    !selectedSize ||
    !selectedColor;

  // Add to cart handler
  const addEventToCartHandler = (data) => {
    if (!data || isDisabled) {
      return toast.error("This event is no longer available.");
    }

    if (!selectedSize || !selectedColor) {
      return toast.error("Please select size and color.");
    }

    const isItemExists = cart?.find(
      (item) =>
        item._id === data._id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (isItemExists) {
      return toast.error("Item already in cart!");
    } else {
      const cartData = {
        ...data,
        selectedColor,
        selectedSize,
        qty: 1,
      };

      dispatch(addEventToCart(cartData));
      toast.success("Item added to cart!");
    }
  };

  return (
    <section className="event-card-container">
      {/* Image Gallery */}
      <figure className="event-product-images">
        <img
          src={mainImage}
          alt={data.title}
          className="event-large-product-image"
        />
        <div className="event-thumbnail-images-container">
          {data.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="event-small-product-image"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </figure>

      {/* Event Details */}
      <article className="event-details-wrapper">
        <h2 className="event-title">{data.title}</h2>
        <p className="event-description">{data.description}</p>

        {/* Ratings */}
        <div className="event-rating-wrapper">
          Rating:
          <Ratings ratings={data?.ratings?.average} />
          <span> ({data?.ratings?.average.toFixed(1)}/5) </span>
          <span className="reviewers-count">
            <strong className="reviewers-number">
              {data?.ratings?.count || 0}
            </strong>{" "}
            people reviewed this product
          </span>
        </div>

        <div className="event-meta-wrapper">
          <h5 className="discounted-price">
            Price: ${data.discountPrice.toFixed(2)}
          </h5>
          {data.discountPrice < data.originalPrice && (
            <p className="original-price">
              <s>${data.originalPrice.toFixed(2)}</s>
            </p>
          )}

          <span className={`status ${data.eventStatus}`}>
            {data.eventStatus}
          </span>
          <p className="sold-count">{data.soldOut} sold</p>
          <p className="inventory-count">
            Stock: {isOutOfStock ? "Out of stock" : data.totalInventory}
          </p>
        </div>

        {/* Size and Color Selection */}
        <div className="event-selection-wrapper">
          <label>
            Size:
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select Size</option>
              {data.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color:
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Select Color</option>
              {data.colors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Event Actions */}
        <div className="event-actions-wrapper">
          <button
            className="event-cart-btn"
            disabled={isDisabled}
            onClick={() => addEventToCartHandler(data)}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <CountDown data={data} />
        </div>
      </article>
    </section>
  );
};

export default EventCard;
