import Ratings from "../../products/ratings/Ratings";
import "./SingleOrderItems.scss";

const SingleOrderItems = ({ order }) => {
  return (
    <section className="ordered-items-wrapper">
      <h2 className="ordered-items-title">Ordered Items</h2>
      {order?.orderedItems?.map((item, index) => (
        <article key={index} className="ordered-product-card">
          <figure className="ordered-product-image-container">
            <img
              src={item.productImage}
              alt={item.title}
              className="ordered-product-image"
            />
          </figure>
          <article className="ordered-product-details">
            <h3 className="ordered-product-details-title">{item.title}</h3>
            <p className="ordered-product-info">
              Brand: {item.brand?.brandName}
            </p>
            <p className="ordered-product-info">
              Category: {item.category?.categoryName}
            </p>
            <p className="ordered-product-info">Color: {item.productColor}</p>
            <p className="ordered-product-info">Size: {item.size}</p>
            <p className="ordered-product-info">Quantity: {item.quantity}</p>
            <p className="ordered-product-info">Price: ${item.price}</p>
            <p className="ordered-product-info">Total: ${item.total}</p>
            <p className="rating-wrapper">
              Rating: <Ratings ratings={item?.product?.ratings?.average || 0} />
              <span>
                {" "}
                {item?.product?.ratings?.average?.toFixed(1) || "0.0"}/5){" "}
              </span>
            </p>
          </article>
        </article>
      ))}
    </section>
  );
};

export default SingleOrderItems;
