import { useEffect, useState } from "react";
import "./SingleProduct.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/userLayout/header/Header";
import Footer from "../../../components/userLayout/footer/Footer";
import { fetchProduct } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import RelatedProductCard from "../../../components/products/relatedProductCard/RelatedProductCard";

const SingleProduct = () => {
  const { productID } = useParams();
  // Global state variables
  const { loading, error, currentProduct, products } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  console.log("Related Products", relatedProducts);

  useEffect(() => {
    if (productID) {
      dispatch(fetchProduct(productID));
    }

    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch, productID]);

  useEffect(() => {
    if (
      currentProduct &&
      currentProduct.subcategory &&
      products &&
      products.length > 0
    ) {
      // Filter products by the same category and exclude the current product
      const related = products?.filter(
        (product) =>
          product.subcategory?._id === currentProduct.subcategory?._id &&
          product._id !== currentProduct._id
      );
      setRelatedProducts(related);
    }

    // Set the default image to the first variant's image if available
    if (
      currentProduct &&
      currentProduct.variants &&
      currentProduct.variants.length > 0
    ) {
      setSelectedImage(currentProduct.variants[0].productImage); // Use productImage from variants
    }
  }, [currentProduct, products]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentProduct) {
    return <div>Product not found.</div>;
  }

  const {
    title,
    description,
    originalPrice,
    discountPrice,
    shop,
    supplier,
    category,
    brand,
    tags,
    status,
    stock,
    soldOut,
    ratings,
    reviews,
    variants,
  } = currentProduct;

  return (
    <main className="single-product-page">
      <Header />

      <section className="single-product-container">
        <div className="product-image-section">
          <figure className="large-image-container">
            <img
              src={selectedImage || "/placeholder-image.jpg"} // Fallback image
              alt="Large product"
              className="large-image"
            />
          </figure>
          <div className="thumbnail-images">
            {variants.map((variant, index) => (
              <img
                key={index}
                src={variant.productImage || "/placeholder-image.jpg"}
                alt={`${variant.productColor} - ${variant.productSize}`}
                onClick={() => setSelectedImage(variant.productImage)}
                className="thumbnail-image"
              />
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1 className="product-title">{title}</h1>
          <p className="product-description">{description}</p>

          <div className="product-details">
            <p>
              <strong>Discounted Price:</strong> ${discountPrice} $
              {originalPrice}
            </p>
            <p>
              <strong>Shop:</strong> {shop?.name || "N/A"}
            </p>
            <p>
              <strong>Supplier:</strong> {supplier?.supplierName || "N/A"}
            </p>
            <p>
              <strong>Category:</strong> {category?.categoryName || "N/A"}
            </p>
            <p>
              <strong>Brand:</strong> {brand?.brandName || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>Stock Available:</strong> {stock}
            </p>
            <p>
              <strong>Sold Out:</strong> {soldOut}
            </p>
            <p>
              <strong>Ratings:</strong> {ratings.average} ({ratings.count}{" "}
              reviews)
            </p>
            <p>
              <strong>Tags:</strong> {tags?.join(", ") || "N/A"}
            </p>
          </div>

          <div className="product-variants">
            <h2>Variants</h2>
            {variants.length > 0 ? (
              <ul className="variants-list">
                {variants.map((variant, index) => (
                  <li key={index} className="variant-item">
                    <p>
                      <strong>Color:</strong> {variant.productColor}
                    </p>
                    <p>
                      <strong>Size:</strong> {variant.productSize}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No variants available.</p>
            )}
          </div>

          <div className="product-reviews">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((review, index) => (
                  <li key={index}>
                    <p>
                      <strong>User:</strong> {review.user}
                    </p>
                    <p>
                      <strong>Rating:</strong> {review.rating} / 5
                    </p>
                    <p>
                      <strong>Comment:</strong> {review.comment}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        </div>
      </section>

      <article className="related-products-container">
        <h4>Related Products</h4>
        <div className="related-products-list">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <RelatedProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default SingleProduct;
