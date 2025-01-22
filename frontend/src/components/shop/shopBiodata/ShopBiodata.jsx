import "./ShopBiodata.scss";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSeller } from "../../../redux/actions/seller";
import LogoutShowOwner from "../../../utils/globalFunctions/LogoutShopOwner";

const ShopBiodata = () => {
  // Global state variables
  const { sellerSignOut } = LogoutShowOwner();
  const { products } = useSelector((state) => state.product);

  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  // Shop owner Details
  useEffect(() => {
    dispatch(fetchSingleSeller());
  }, [dispatch]);

  // Handle Seller logout
  const handleSellerLogout = async () => {
    await sellerSignOut();
  };

  // Provide a fallback for when `products` is temporarily undefined or null
  const totalReviewsLength = Array.isArray(products) && products.length > 0
  ? products.reduce((acc, product) => acc + product.reviews.length, 0)
  : 0;

const totalRatings = Array.isArray(products) && products.length > 0
  ? products.reduce(
      (acc, product) =>
        acc +
        (Array.isArray(product.reviews) 
          ? product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) 
          : 0),
      0
    )
  : 0;

const averageRating = totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;


  return (
    <div className="shop-biodata-container">
      <article className="article-box">
        <figure className="image-container">
          <img
            src={`${currentSeller?.LogoImage}`}
            alt={currentSeller?.name}
            className="image"
          />
        </figure>
        <h3 className="subTitle">{currentSeller?.name}</h3>
        <p className="text description">{currentSeller?.description}</p>
      </article>

      <article className="article-box">
        <h3 className="subTitle">Address</h3>
        <p className="text address">{currentSeller?.shopAddress}</p>
      </article>

      <article className="article-box">
        <h3 className="subTitle">Phone Number</h3>
        <p className="text phone">{currentSeller?.phoneNumber}</p>
      </article>

      <div className="article-box">
        <h3 className="subTitle">Total Products</h3>
        <p className="text product-length">{products && products.length}</p>
      </div>

      <article className="article-box">
        <h3 className="subTitle">Shop Ratings</h3>
        <p className="text average"> {averageRating} </p>
      </article>

      <article className="article-box">
        <h3 className="subTitle">Joined On</h3>
        <p className="text createdAt">
          {currentSeller?.createdAt?.slice(0, 10)}
        </p>
      </article>

      <article className="article-box">
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
    </div>
  );
};

export default ShopBiodata;
