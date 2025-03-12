import "./ShopProfile.scss";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSeller } from "../../../redux/actions/seller";
import LogoutShowOwner from "../../../utils/globalFunctions/LogoutShopOwner";
import ShopProducts from "../../../hooks/ShopProducts";

const ShopProfile = () => {
  // Global state variables
  const { sellerSignOut } = LogoutShowOwner();
  const { products } = useSelector((state) => state.product);

  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const { shopProducts, error, loading } = ShopProducts();

  // Shop owner Details
  useEffect(() => {
    dispatch(fetchSingleSeller());
  }, [dispatch]);

  // Handle Seller logout
  const handleSellerLogout = async () => {
    await sellerSignOut();
  };

  // Shop Ratings calculation using reduce method
  /** 
  const totalReviewsLength =
    Array.isArray(shopProducts) && shopProducts.length > 0
      ? shopProducts.reduce((acc, product) => acc + product.reviews.length, 0)
      : 0;

  const totalRatings =
    Array.isArray(shopProducts) && shopProducts.length > 0
      ? shopProducts.reduce(
          (acc, product) =>
            acc +
            (Array.isArray(product.reviews)
              ? product.reviews.reduce(
                  (sum, review) => sum + (review.rating || 0),
                  0
                )
              : 0),
          0
        )
      : 0;

  const averageRating =
    totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;
    */

  // Shop Ratings calculation using forEach method
  let totalRating = 0;
  let totalReviews = 0;

  shopProducts.forEach((product) => {
    product.reviews.forEach((review) => {
      totalRating += review.rating;
      totalReviews++;
    });
  });

  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  return (
    <aside className="shop-profile-container">
      <article className="shop-profile-box">
        <figure className="image-container">
          <img
            src={`${currentSeller?.LogoImage}`}
            alt={currentSeller?.name}
            className="image"
          />
        </figure>
        <h3 className="shop-profile-subtitle">{currentSeller?.name}</h3>
        <p className="text description">{currentSeller?.description}</p>
      </article>

      <article className="shop-profile-box">
        <h3 className="shop-profile-subtitle">Address</h3>
        <p className="text address">{currentSeller?.shopAddress}</p>
      </article>

      <article className="shop-profile-box">
        <h3 className="shop-profile-subtitle">Phone Number</h3>
        <p className="text phone">{currentSeller?.phoneNumber}</p>
      </article>

      <div className="shop-profile-box">
        <h3 className="shop-profile-subtitle">Total Products</h3>
        <p className="text product-length">{products && products.length}</p>
      </div>

      <article className="shop-profile-box">
        <h3 className="shop-profile-subtitle">Shop Ratings</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p className="text average"> {averageRating?.toFixed(1)}/5 </p>
        )}
      </article>

      <article className="shop-profile-box">
        <h3 className="shop-profile-subtitle">Joined On</h3>
        <p className="text createdAt">
          {currentSeller?.createdAt?.slice(0, 10)}
        </p>
      </article>

      <article className="shop-profile-box">
        <Link to="/shop/dashboard">
          <p className="edit-shop"> Shop Dashboard</p>
        </Link>
        <Link to="/shop/dashboard">
          <p className="edit-shop">Edit Shop</p>
        </Link>
        <h3 onClick={handleSellerLogout} className="logout">
          Log Out
        </h3>
      </article>
    </aside>
  );
};

export default ShopProfile;
