import { useEffect, useState } from "react";
import "./SingleProduct.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import RelatedProductCard from "../../../components/products/relatedProductCard/RelatedProductCard";
import Header from "../../../components/layouts/header/Header";
import Footer from "../../../components/layouts/footer/Footer";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toast } from "react-toastify";
import Ratings from "../../../components/products/ratings/Ratings";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/reducers/wishListReducer";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import ProductDetails from "../../../components/products/productDetails/ProductDetails";

const SingleProduct = () => {
  const navigate = useNavigate();
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
  const { currentSeller } = useSelector((state) => state.seller);
  const { currentUser } = useSelector((state) => state.user);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [variantToggles, setVariantToggles] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [clickWishlist, setClickWishlist] = useState(false);

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
  // Add to Wishlist Handler and remove from Wishlist Handler
  // ===========================================================================

  // Add wishlist
  const addToWishlistHandler = (product) => {
    setClickWishlist(!clickWishlist);
    dispatch(addToWishlist(product));
  };

  // Remove wishlist
  const removeFromWishlistHandler = (id) => {
    setClickWishlist(!clickWishlist);
    dispatch(removeFromWishlist(id));
  };

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

  // =========================================================
  // Handle conversation Submit Function
  // =========================================================
  const handleMessageSubmit = async () => {
    if (currentUser) {
      // body
      const newConversation = {
        groupTitle: currentProduct._id + currentUser._id,
        userId: currentUser._id,
        sellerId: currentSeller._id,
      };

      try {
        const { data } = await axios.post(
          `${API}/conversations/create-conversation`,
          newConversation
        );
        navigate(`/inbox?${data.conversation._id}`);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  // ===========================================================================
  // Single Product Rating section
  // ===========================================================================

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
                  src={variant.productImage}
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
            <h1 className="single-product-title">{currentProduct?.title}</h1>
            <p className="single-product-description">
              {currentProduct?.description}
            </p>

            {/* Single Product Rating */}
            {singleProductRating()}

            <ProductDetails
              variantToggles={variantToggles}
              addToCartHandler={addToCartHandler}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              currentProduct={currentProduct}
              selectedVariant={selectedVariant}
              handleToggle={handleToggle}
              handleMessageSubmit={handleMessageSubmit}
              addToWishlistHandler={addToWishlistHandler}
              removeFromWishlistHandler={removeFromWishlistHandler}
              clickWishlist={clickWishlist}
            />
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
