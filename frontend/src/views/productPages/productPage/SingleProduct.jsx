import { useEffect, useState } from "react";
import "./SingleProduct.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import RelatedProductCard from "../../../components/products/relatedProductCard/RelatedProductCard";
import Header from "../../../components/layouts/header/Header";
import Footer from "../../../components/layouts/footer/Footer";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toast } from "react-toastify";
import Ratings from "../../../components/products/ratings/Ratings";

const SingleProduct = () => {
  const { productID } = useParams();
  const dispatch = useDispatch();

  // Fetch product data
  useEffect(() => {
    if (productID) {
      dispatch(fetchProduct(productID));
    }

    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch, productID]);

  const { currentProduct, products } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.cart);

  console.log("products:", products);
  console.log("currentProduct:", currentProduct);

  const [selectedImage, setSelectedImage] = useState(null);
  const [variantToggles, setVariantToggles] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  console.log("Related products:", relatedProducts);

  useEffect(() => {
    const related = products.filter(
      (product) =>
        product.category?._id === currentProduct.category?._id &&
        product.subcategory?._id === currentProduct.subcategory?._id &&
        product.customerCategory === currentProduct.customerCategory &&
        product._id !== currentProduct._id
    );
    setRelatedProducts(related);
  }, [products, currentProduct]);

  // Set selected variant and size when currentProduct is available
  useEffect(() => {
    if (currentProduct?.variants?.length > 0) {
      const defaultVariant = currentProduct.variants[0];
      setSelectedVariant(defaultVariant); // Set the default variant
      setSelectedImage(defaultVariant.productImage); // Set the default image

      // Set the first available size for the selected variant
      if (defaultVariant.productSizes?.length > 0) {
        setSelectedSize(defaultVariant.productSizes[0].size); // Set default size
      }

      // Initialize variantToggles state to match the number of variants
      setVariantToggles(new Array(currentProduct.variants.length).fill(false));
    }
  }, [currentProduct]);

  // ===========================================================================
  // Add to Cart Handler
  // ===========================================================================

  const addToCartHandler = () => {
    const isItemExists =
      cart &&
      cart.find(
        (item) =>
          item._id === productID &&
          item.variant.productColor === selectedVariant.productColor &&
          item.variant.size === selectedSize
      );

    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (
      selectedVariant.productSizes.find((size) => size.size === selectedSize)
        ?.stock < 1
    ) {
      toast.error("Selected size is out of stock!");
    } else {
      const cartData = {
        ...currentProduct,
        qty: 1,
        variant: { ...selectedVariant, size: selectedSize },
      };
      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  // Toggle the visibility of variant details
  const handleToggle = (index) => {
    setVariantToggles((prev) =>
      prev.map((toggle, i) => (i === index ? !toggle : toggle))
    );
  };

  // ===========================================================================
  // Single Product Rating section
  // =========================================================================

  const singleProductRating = () => (
    <div className="product-rating-wrapper">
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

  return (
    <main className="single-product-page">
      <Header />
      <div className="single-product-page-container">
        <section className="single-product-container">
          <div className="product-image-section">
            <figure className="large-image-container">
              <img
                src={selectedImage}
                alt="Large product"
                className="large-image"
              />
            </figure>
            <div className="thumbnail-images">
              {currentProduct?.variants.map((variant, index) => (
                <img
                  key={index}
                  src={variant.productImage || "/placeholder-image.jpg"}
                  alt={`${variant.productColor}`}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setSelectedSize(""); // Reset size when color changes
                    setSelectedImage(variant.productImage);
                  }}
                  className={`thumbnail-image ${
                    selectedVariant === variant ? "selected" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <section className="product-details">
            <h1 className="product-title">{currentProduct?.title}</h1>
            <p className="product-description">{currentProduct?.description}</p>

            {/* Single Product Rating */}
            {singleProductRating()}

            <div className="product-parts-wrapper">
              <article className="product-infos">
                <h3>Product Details</h3>
                <p>
                  <strong>Discounted Price:</strong> $
                  {currentProduct?.discountPrice} $
                  {currentProduct?.originalPrice}
                </p>
                <p>
                  <strong>Shop:</strong> {currentProduct?.shop?.name || "N/A"}
                </p>
                <p>
                  <strong>Supplier:</strong>{" "}
                  {currentProduct?.supplier?.supplierName || "N/A"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {currentProduct?.category?.categoryName || "N/A"}
                </p>

                <p>
                  <strong>Subcategory:</strong>{" "}
                  {currentProduct?.subcategory?.subcategoryName || "N/A"}
                </p>

                <p>
                  <strong>Customer Category:</strong>{" "}
                  {currentProduct?.customerCategory || "N/A"}
                </p>

                <p>
                  <strong>Brand:</strong>{" "}
                  {currentProduct?.brand?.brandName || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {currentProduct?.status}
                </p>
                <p>
                  <strong>Sold Out:</strong> {currentProduct?.soldOut}
                </p>
                <p>
                  <strong>Ratings:</strong> {currentProduct?.ratings?.average} (
                  {currentProduct?.ratings?.count} reviews)
                </p>
              </article>

              <div className="product-variants">
                <h2>Product Variants</h2>
                {currentProduct?.variants.length > 0 ? (
                  <ul className="variants-list">
                    {currentProduct?.variants.map((variant, index) => (
                      <li key={index} className="variant-item">
                        <p>
                          <strong>Color:</strong> {variant.productColor}{" "}
                          <button
                            className="toggle-button"
                            onClick={() => handleToggle(index)}
                          >
                            {variantToggles[index]
                              ? "Hide Details"
                              : "Show Details"}
                          </button>
                        </p>
                        {variantToggles[index] && (
                          <ul className="variant-details">
                            {variant.productSizes.map((size, idx) => (
                              <li key={idx}>
                                <strong>Size:</strong> {size.size} -{" "}
                                {size.stock} in stock
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No variants available.</p>
                )}
              </div>

              <article className="product-size-selection-wrapper">
                <h2 className="product-size-title">Select Product Size</h2>
                <form
                  className="size-selection-form"
                  onSubmit={addToCartHandler}
                >
                  <label htmlFor="size-selector">Choose Size:</label>
                  <select
                    id="size-selector"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {selectedVariant?.productSizes?.map((sizeObj, index) => (
                      <option key={index} value={sizeObj.size}>
                        {sizeObj.size}{" "}
                        {sizeObj.stock < 1 ? "(Out of Stock)" : ""}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="size-button"
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </form>
              </article>
            </div>
          </section>
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
      </div>
      <Footer />
    </main>
  );
};

export default SingleProduct;
