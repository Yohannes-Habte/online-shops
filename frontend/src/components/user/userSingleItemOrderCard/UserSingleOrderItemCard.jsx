import "./UserSingleOrderItemCard.scss";
import { animateScroll as scroll } from "react-scroll";

const UserSingleOrderItemCard = ({ product, setOpen, setSelectedProduct }) => {
  const handleRefundClick = () => {
    // Scroll to the refund section smoothly
    scroll.scrollTo(
      document.getElementById("refund-request-form-section").offsetTop,
      {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      }
    );
    setSelectedProduct(product);
  };

  return (
    <section className="user-order-item-card-container">
      <figure className="product-image">
        <img
          src={product?.productImage}
          alt={product?.title}
          className="item-image"
        />
        <figcaption className="refund-me" onClick={handleRefundClick}>
          Refund Me
        </figcaption>
      </figure>
      <div className="product-info">
        <h3>{product?.title}</h3>
        <p>
          Brand: <strong>{product?.brand?.brandName}</strong>
        </p>
        <p>Category: {product?.category?.categoryName}</p>
        <p>Subcategory: {product?.subcategory?.subcategoryName}</p>
        <p>Color: {product?.productColor}</p>
        <p>Size: {product?.size}</p>
        <p>Quantity: {product?.quantity}</p>
        <p>
          Price: <strong>${product?.price}</strong>
        </p>
        <p>
          Total: <strong>${product?.total}</strong>
        </p>

        <button
          onClick={() => {
            setOpen(true);
            setSelectedProduct(product);
          }}
          className="review-product-btn"
        >
         Review Product
        </button>
      </div>
    </section>
  );
};

export default UserSingleOrderItemCard;
