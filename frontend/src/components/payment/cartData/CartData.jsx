import "./CartData.scss";

const CartData = ({ orderData }) => {
  return (
    <section className="cart-data-wrapper">
      <article className="box subtotal-price">
        <h3 className="cart-data-subTitle">Total Items Price:</h3>
        <p className="cart-data-paragraph">
          ${orderData?.subTotal?.toFixed(2)}
        </p>
      </article>

      <article className="box shipping-price">
        <h3 className="cart-data-subTitle">Tax Charge:</h3>
        <p className="cart-data-paragraph">${orderData?.tax?.toFixed(2)}</p>
      </article>

      <article className="box shipping-price">
        <h3 className="cart-data-subTitle">Shipping Charge:</h3>
        <p className="cart-data-paragraph">
          ${orderData?.shippingFee?.toFixed(2)}
        </p>
      </article>


      <article className="box discount-price">
        <h3 className="cart-data-subTitle">Discount:</h3>
        <p className="cart-data-paragraph">
          ${orderData ? orderData?.discount?.toFixed(2) : 1}
        </p>
      </article>
      <hr />
      <h2 className="cart-data-total-price">
        ${orderData?.grandTotal?.toFixed(2)}
      </h2>
    </section>
  );
};

export default CartData;
