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
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/reducers/wishListReducer";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import SingleProductDetails from "../../../components/products/singleProductDetails/SingleProductDetails";
import SingleProductRating from "../../../components/products/singleProductRating/SingleProductRating";
import SingleProductImages from "../../../components/products/singleProductImages/SingleProductImages";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { productID } = useParams();
  const dispatch = useDispatch();
  const { wishList } = useSelector((state) => state.wishList);

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

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [clickWishlist, setClickWishlist] = useState(false);
  const [variantToggles, setVariantToggles] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
      setSelectedSize("");

      // Initialize variantToggles state to match the number of variants
      setVariantToggles(new Array(currentProduct.variants.length).fill(false));
    }
  }, [currentProduct]);

  // ===========================================================================
  // Add to Wishlist Handler
  // ===========================================================================

  const addToWishlistHandler = () => {
    if (!selectedVariant || !selectedSize) {
      toast.error("Please select a color and size before adding to wishlist.");
      return;
    }

    const item = {
      ...currentProduct,
      variant: {
        productColor: selectedVariant.productColor,
        size: selectedSize,
      },
    };

    const isInWishlist = wishList.some(
      (i) =>
        i._id === item._id &&
        i.variant?.productColor === item.variant?.productColor &&
        i.variant?.size === item.variant?.size
    );

    if (isInWishlist) {
      dispatch(
        removeFromWishlist({
          productId: item._id,
          productColor: item.variant.productColor,
          size: item.variant.size,
        })
      );
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(item));
      toast.success("Added to wishlist");
    }
  };

  // ===========================================================================
  // Remove from Wishlist Handler
  // ===========================================================================
  const removeFromWishlistHandler = (productId, productColor, size) => {
    setClickWishlist(!clickWishlist);
    dispatch(removeFromWishlist(productId, productColor, size));
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
      if (!selectedSize) {
        toast.error("Please select a size before adding to cart.");
        return;
      }
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
  // Generate a secure random conversation identifier
  // =========================================================
  const generateConversationId = () => crypto.randomUUID();

  // =========================================================
  // Handle conversation Submit Function
  // =========================================================
  const handleConversationMSubmit = async () => {
    if (!currentUser) {
      return toast.error("Please login to create a conversation");
    }

    if (!currentSeller) {
      return toast.error("Seller not found!");
    }

    if (!selectedVariant) {
      return toast.error(
        "Please select a product color before starting a conversation."
      );
    }

    if (!selectedSize) {
      return toast.error(
        "Please select a product size before starting a conversation."
      );
    }

    const newConversation = {
      groupTitle: `${currentUser._id}-${currentSeller._id}-${currentProduct._id}-${selectedVariant.productColor}-${selectedSize}`,
      userId: currentUser._id,
      sellerId: currentSeller._id,
      productId: currentProduct._id,
      variant: selectedVariant,
      productColor: selectedVariant.productColor,
      productSize: selectedSize,
    };

    try {
      const response = await axios.post(
        `${API}/conversations/create-new-conversation`,
        newConversation,
        { withCredentials: true }
      );

      const conversationId = response?.data?.conversation?._id; // Ensure safe access
      if (!conversationId) {
        throw new Error("Conversation ID not found in response.");
      }

      navigate(
        `/profile?isActive=7&key=${conversationId}&identifier=${generateConversationId()}`
      );
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <main className="single-product-page">
      <Header />
      <div className="single-product-page-container">
        <section className="single-product-wrapper">
          <SingleProductImages
            currentProduct={currentProduct}
            selectedImage={selectedImage}
            setSelectedVariant={setSelectedVariant}
            setSelectedSize={setSelectedSize}
            setSelectedImage={setSelectedImage}
            selectedVariant={selectedVariant}
          />

          <section className="product-details-wrapper">
            <h1 className="single-product-title">{currentProduct?.title}</h1>
            <p className="single-product-description">
              {currentProduct?.description}
            </p>

            {/* Single Product Rating */}
            <SingleProductRating currentProduct={currentProduct} />

            {/* Single Product Details */}
            <SingleProductDetails
              variantToggles={variantToggles}
              addToCartHandler={addToCartHandler}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              currentProduct={currentProduct}
              selectedVariant={selectedVariant}
              handleToggle={handleToggle}
              handleConversationMSubmit={handleConversationMSubmit}
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
