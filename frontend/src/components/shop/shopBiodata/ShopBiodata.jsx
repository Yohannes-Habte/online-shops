import axios from 'axios';
import './ShopBiodata.scss';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';

const ShopBiodata = ({ isOwner }) => {
  // Global state variables
  const { products } = useSelector((state) => state.product);
  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  // Local state variables
  const [shopData, setShopData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shopProducts, setShopProducts] = useState([]);

  // Display products for a single shop
  useEffect(() => {
    const shopProducts = async () => {
      try {
        // dispatch(productsShopFetchStart());
        const { data } = await axios.get(
          `${API}/products/${currentSeller._id}/shop-products`
        );
        // dispatch(productsShopFetchSuccess(data));
        setShopProducts(data.products);
      } catch (error) {
        console.log(error);
        // dispatch(productsShopFetchFailure(error.response.data.message));
      }
    };
    shopProducts();
  }, []);

  // Get shop info
  useEffect(() => {
    const getShopInfo = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${API}/shops/shop/${currentSeller._id}`,
          { withCredentials: true }
        );
        setShopData(data.shop);
        setIsLoading(false);
      } catch (err) {
        toast.error(err.response.data.message);
        setIsLoading(false);
      }
    };
    getShopInfo();
  }, []);

  // Shop Logout handler
  const shopLogoutHandler = async () => {
    try {
      const { data } = await axios.get(`${API}/shops/logout-shop`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // How many times a particular product is reviewed
  const totalReviewsLength =
    shopProducts &&
    shopProducts.reduce((acc, product) => acc + product.reviews.length, 0);

  // The total sum of rating done by users
  const totalRatings =
    shopProducts &&
    shopProducts.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <div className="shop-biodata-container">
      <article className="article-box">
        <figure className="image-container">
          <img
            src={`${shopData.image}`}
            alt={shopData.name}
            className="image"
          />
        </figure>
        <h3 className="subTitle">{shopData.name}</h3>
        <p className="text description">{shopData.description}</p>
      </article>

      <article className="article-box">
        <h3 className="subTitle">Address</h3>
        <p className="text address">{shopData.shopAddress}</p>
      </article>

      <article className="article-box">
        <h3 className="subTitle">Phone Number</h3>
        <p className="text phone">{shopData.phoneNumber}</p>
      </article>

      <div className="article-box">
        <h3 className="subTitle">Total Products</h3>
        <p className="text product-length">
          {shopProducts && shopProducts.length}
        </p>
      </div>

      <article className="article-box">
        <h3 className="subTitle">Shop Ratings</h3>
        <p className="text average"> {averageRating} </p>
      </article>

      <article className="article-box">
        <h3 className="subTitle">Joined On</h3>
        <p className="text createdAt">{shopData?.createdAt?.slice(0, 10)}</p>
      </article>

      {isOwner && (
        <article className="article-box">
          <Link to="/dashboard">
            <p className="edit-shop"> Shop Dashboard</p>
          </Link>
          <Link to="/settings">
            <p className="edit-shop">Edit Shop</p>
          </Link>
          <h3 onClick={shopLogoutHandler} className="logout">
            Log Out
          </h3>
        </article>
      )}
    </div>
  );
};

export default ShopBiodata;
