import "./TrackOrderCard.scss";

const TrackOrderCard = ({ user, order }) => {
  const shop = order.orderedItems[0].shop;

  console.log("Shop traking", shop);

  console.log("Tracking an order", order);
  return (
    <section className="track-order-card">
      <h3 className="tracking-order-title">
        {" "}
        Track Your Order form {shop?.name}{" "}
      </h3>

      <p className="tracking-message">
        Hello <span className="tracking-user-info">{user?.name}</span>, thank
        you for shopping with{" "}
        <span className="tracking-shop-info">{shop?.name}</span>. Your order is
        currently{" "}
        <strong className="tracking-order-info">{order?.orderStatus}</strong>.
        At <span className="tracking-shop-info">{shop?.name}</span>, we value
        transparency and appreciate your trust in us. Your loyalty means a lot,
        and we are committed to providing you with the best shopping experience.
        We look forward to serving you again!
      </p>

      <div className="ordered-items-container">
        {/* User Order Details */}
        {order?.orderedItems.map((product) => {
          return (
            <figure key={product._id} className="images-container">
              <img
                src={product?.productImage}
                alt={product?.title}
                className="image"
              />
            </figure>
          );
        })}
      </div>

      <aside className="shipping-details">
        <h3 className="subTitle"> Customer Delivery Address</h3>
        <p className="address"> {user?.name}, </p>
        <p className="address"> {order?.shippingAddress?.address}, </p>
        <p className="address">
          {order?.shippingAddress?.zipCode} {order?.shippingAddress?.city}{" "}
        </p>
        <p className="address">
          {order?.shippingAddress?.state}, {order?.shippingAddress?.country}{" "}
        </p>
      </aside>
    </section>
  );
};

export default TrackOrderCard;
