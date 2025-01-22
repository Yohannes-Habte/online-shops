import "./CartInfo.scss";

const CartInfo = ({ subTotal, shippingFee, totalPrice, discount }) => {
  return (
    <section className="cart-info-wrapper">
      <h2 className="cart-info-title"> Price Summary</h2>
      {/* subtotal */}
      <article className="info-container">
        <h3 className="subTitle">Subtotal Price:</h3>
        <p className="outcome">${subTotal.toFixed(2)}</p>
      </article>

      {/* Discount */}
      <article className="info-container">
        <h3 className="subTitle">Shipping Price:</h3>
        <p className="outcome">${shippingFee.toFixed(2)}</p>
      </article>

      {/* Discount */}
      <article className="info-container">
        <h3 className="subTitle">Discount Price:</h3>
        <p className="outcome"> {discount ? discount.toFixed(2) : 1} </p>
      </article>

      {/* Total Price */}
      <h2 className="total-price"> Total Price: ${totalPrice.toFixed(2)}</h2>
    </section>
  );
};

export default CartInfo;
