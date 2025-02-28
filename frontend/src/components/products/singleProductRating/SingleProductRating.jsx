import "./SingleProductRating.scss";
import Ratings from "../ratings/Ratings";

const SingleProductRating = ({ currentProduct }) => {
  return (
    <div className="single-product-rating-wrapper">
      Rating:
      <Ratings ratings={currentProduct?.ratings?.average} />{" "}
      <span> ({currentProduct?.ratings.average.toFixed(1)}/5) </span>
      <span className="reviewers-count">
        <strong className="reviewers-number">
          {currentProduct?.ratings?.count || 0}
        </strong>{" "}
        people reviewed this product
      </span>
    </div>
  );
};

export default SingleProductRating;
