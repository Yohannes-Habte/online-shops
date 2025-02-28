import { Link } from "react-router-dom";
import "./SingleProductInfo.scss";

const SingleProductInfo = ({ currentProduct }) => {
  return (
    <aside className="single-product-infos-wrapper">
      <h3 className="product-info-title">Product Details</h3>
      <p className="product-prices-info">
        <strong>Discounted Price:</strong>
        <span className="discounted-price">
          {" "}
          ${currentProduct?.discountPrice}
        </span>
        <span className="original-price">
          {" "}
          ${currentProduct?.originalPrice}
        </span>
      </p>
      <p className="product-info">
        <strong>Shop:</strong> {currentProduct?.shop?.name || "N/A"}
      </p>

      <p className="product-info">
        <strong>Supplier:</strong>{" "}
        <Link
          to={`/suppliers/${currentProduct?.supplier?._id}`}
          style={{ color: "blue" }}
        >
          {currentProduct?.supplier?.supplierName || "N/A"}
        </Link>
      </p>

      <p className="product-info">
        <strong>Category:</strong>{" "}
        {currentProduct?.category?.categoryName || "N/A"}
      </p>

      <p className="product-info">
        <strong>Subcategory:</strong>{" "}
        {currentProduct?.subcategory?.subcategoryName || "N/A"}
      </p>

      <p className="product-info">
        <strong>Customer Category:</strong>{" "}
        {currentProduct?.customerCategory || "N/A"}
      </p>

      <p className="product-info">
        <strong>Brand:</strong> {currentProduct?.brand?.brandName || "N/A"}
      </p>

      <p className="product-info">
        <strong>Status:</strong> {currentProduct?.status}
      </p>

      <p className="product-info">
        <strong>Sold Out:</strong> {currentProduct?.soldOut}
      </p>

      <p className="product-info">
        <strong>Ratings:</strong> {currentProduct?.ratings?.average} (
        {currentProduct?.ratings?.count} reviews)
      </p>
    </aside>
  );
};

export default SingleProductInfo;
