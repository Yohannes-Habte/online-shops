import { MdLocalShipping } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import "./Categories.scss";
import { RiPriceTagFill, RiSecurePaymentLine } from "react-icons/ri";

const Categories = () => {
  return (
    <div className="categories">
      <article className="category-wrapper">
        <MdLocalShipping className="icon" />
        <div className="title-paragraph">
          <h3 className="category-title">Free Shipping</h3>
          <p className="paragraph">From all orders over $100</p>
        </div>
      </article>

      <article className="category-wrapper">
        <MdLocalOffer className="icon" />

        <div className="title-paragraph">
          <h3 className="category-title">Daily Surprise Offers</h3>
          <p className="paragraph">Save up to 20% off</p>
        </div>
      </article>

      <article className="category-wrapper">
        <RiPriceTagFill className="icon" />
        <div className="title-paragraph">
          <h3 className="category-title">Affordable Prices</h3>
          <p className="paragraph">Get Factor direct price</p>
        </div>
      </article>

      <article className="category-wrapper">
        <RiSecurePaymentLine className="icon" />
        <div className="title-paragraph">
          <h3 className="category-title">Secure Payments</h3>
          <p className="paragraph">100% protected payments</p>
        </div>
      </article>
    </div>
  );
};

export default Categories;
