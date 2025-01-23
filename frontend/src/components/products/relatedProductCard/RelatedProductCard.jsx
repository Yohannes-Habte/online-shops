import { Link } from "react-router-dom";
import "./RelatedProductCard.scss";
import { ShortenText } from "../../../utils/textHandler/text";

const RelatedProductCard = ({ product }) => {
  const { title, description, variants } = product;

  return (
    <section className="related-product-card">
      <figure className="image-container">
        <Link to={`/products/${product._id}`}>
          <img
            src={variants[0].productImage}
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
      </div>
    </section>
  );
};

export default RelatedProductCard;
