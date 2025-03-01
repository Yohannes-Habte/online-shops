import { useState } from "react";
import "./EventCard.scss";
import { Link } from "react-router-dom";
import CountDown from "../countDown/CountDown";

const EventCard = ({ data }) => {
  // const dispatch = useDispatch();
  // const { cart } = useSelector((state) => state.cart);

  // Set the default big image to the first image in the array
  const [mainImage, setMainImage] = useState(data?.images?.[0]);

  // Add to cart handler
  // const addToCartHandler = (data) => {
  //   if (
  //     !data ||
  //     data.eventStatus === "completed" ||
  //     data.eventStatus === "canceled"
  //   ) {
  //     return toast.error("This event is no longer available.");
  //   }

  //   const isItemExists = cart?.some(
  //     (item) => item.eventCode === data.eventCode
  //   );
  //   if (isItemExists) {
  //     return toast.error("Item already in cart!");
  //   }

  //   if (data.stock < 1) {
  //     return toast.error("Out of stock!");
  //   }

  //   dispatch(addToCart({ ...data, qty: 1 }));
  //   toast.success("Item added to cart!");
  // };

  return (
    <section className="event-card-container">
      {/* Image Gallery */}
      <figure className="event-product-images">
        <img
          src={mainImage}
          alt={data.eventName}
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
        <h2 className="event-title">{data.eventName}</h2>
        <p className="event-description">{data.description}</p>

        <div className="event-meta-wrapper">
          <h5 className="discounted-price">Price: ${data.discountPrice}</h5>
          <p className="original-price">${data.originalPrice.toFixed(2)}</p>

          <span className={`status ${data.eventStatus}`}>
            {data.eventStatus}
          </span>
          <p className="sold-count">{data.soldOut} sold</p>
        </div>

        {/* Event Actions */}
        <div className="event-actions-wrapper">
          <button
            className="event-cart-btn"
            // onClick={() => addToCartHandler(data)}
            disabled={
              data.eventStatus === "completed" ||
              data.eventStatus === "canceled"
            }
          >
            Add to Cart
          </button>
          <CountDown data={data} />
          <Link to={`/event/${data.eventCode}`} className="event-details-btn">
            See Details
          </Link>
        </div>
      </article>
    </section>
  );
};

export default EventCard;
