import { Link } from "react-router-dom";
import "./RelatedProductCard.scss";
import { ShortenText } from "../../../utils/textHandler/text";

const RelatedProductCard = ({ product }) => {
  const { title, variants } = product;

  return (
    <section className="related-product-card">
      <figure className="related-image-container">
        <Link to={`/products/${product._id}`}>
          <img
            src={variants[0].productImage}
            alt={title}
            className="related-product-image"
          />
        </Link>
      </figure>

      <aside className="product-details">
        <h3 className="shop-name">{product.shop.name}</h3>
        <Link to={`/products/${product._id}`}>
          <p className="product-title">{ShortenText(title, 40)}</p>
        </Link>
      </aside>
    </section>
  );
};

export default RelatedProductCard;
