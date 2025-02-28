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
      <figure className="event-image">
        <img src={mainImage} alt={data.eventName} className="main-image" />
        <div className="thumbnail-container">
          {data.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </figure>

      {/* Event Details */}
      <article className="event-details">
        <h2 className="event-title">{data.eventName}</h2>
        <p className="event-description">{data.description}</p>

        <div className="event-meta">
          <h5 className="discounted-price">Price: ${data.discountPrice}</h5>
          <p className="old-price">${data.originalPrice.toFixed(2)}</p>

          <span className={`status ${data.eventStatus}`}>
            {data.eventStatus}
          </span>
          <p className="sold-count">{data.soldOut} sold</p>
        </div>

        {/* Event Actions */}
        <div className="event-actions">
          <button
            className="cart-btn"
            // onClick={() => addToCartHandler(data)}
            disabled={
              data.eventStatus === "completed" ||
              data.eventStatus === "canceled"
            }
          >
            Add to Cart
          </button>
          <CountDown data={data} />
          <Link to={`/event/${data.eventCode}`} className="details-btn">
            See Details
          </Link>
        </div>
      </article>
    </section>
  );
};

export default EventCard;
