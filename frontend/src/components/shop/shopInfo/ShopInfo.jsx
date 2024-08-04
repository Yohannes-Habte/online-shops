import React, { useEffect, useState } from 'react';
import './ShopInfo.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Ratings from '../../products/ratings/Ratings';
import { eventsShopFetchSuccess } from '../../../redux/reducers/eventReducer';
import { productsShopFetchSuccess } from '../../../redux/reducers/productReducer';
import ProductCard from '../../products/productCard/ProductCard';
import axios from 'axios';
import { API } from '../../../utils/security/secreteKey';

// The isOwner comes from ShopHome.jsx page
const ShopInfo = ({ isOwner }) => {
  const { id } = useParams();
  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const { events } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  console.log('Shop is', currentSeller);

  // Local state variables
  const [active, setActive] = useState(1);
  const [shopProducts, setShopProducts] = useState([]);
  const [shopEvents, setShopEvents] = useState([]);

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

  // Display events for a single shop
  useEffect(() => {
    const getShopEvents = async () => {
      try {
        const { data } = await axios.get(
          `${API}/events/${currentSeller._id}/shop-events`
        );
        setShopEvents(data.events);
      } catch (error) {
        console.log(error);
      }
    };
    getShopEvents();
  }, []);

  useEffect(() => {
    dispatch(eventsShopFetchSuccess(id));
    dispatch(productsShopFetchSuccess(id));
  }, [dispatch]);

  // All reviews
  const allReviews =
    shopProducts && shopProducts.map((product) => product.reviews).flat();

  // Total millisenconds per day
  const totalMillisecondsPerDay = 1000 * 60 * 60 * 24;
  // Date now
  const now = new Date();
  const dateNow = now.getTime();

  // Review Created Date

  return (
    <section className="shop-info-contianer">
      <h1 className="shop-title"> {currentSeller.name} </h1>

      <article className="tabs-wrapper">
        <h3
          onClick={() => setActive(1)}
          className={active === 1 ? 'active' : 'passive'}
        >
          Shop Products
        </h3>

        <p
          onClick={() => setActive(2)}
          className={active === 2 ? 'active' : 'passive'}
        >
          Running Events
        </p>

        <p
          onClick={() => setActive(3)}
          className={active === 3 ? 'active' : 'passive'}
        >
          Shop Reviews
        </p>
      </article>

      {/* Shop Products */}
      {active === 1 && (
        <div className="shop-products">
          {shopProducts &&
            shopProducts.map((product, index) => (
              <ProductCard product={product} key={index} isShop={true} />
            ))}
        </div>
      )}

      {/* Shop Events */}
      {active === 2 && (
        <article className="shop-events-wrapper">
          <div className="shop-events">
            {shopEvents &&
              shopEvents.map((event, index) => (
                <ProductCard
                  product={event}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h3 className="no-events">No Events have for this shop!</h3>
          )}
        </article>
      )}

      {/* Shop Reviews */}
      {active === 3 && (
        <article className="shop-reviews-wrapper">
          {allReviews &&
            allReviews.map((reviewer) => (
              <div key={reviewer._id} className="shop-review">
                <figure className="image-container">
                  <img
                    src={`${reviewer.user.image}`}
                    className="image"
                    alt=""
                  />
                </figure>
                <section className="user-rating">
                  <h3 className="reviewer-name">{reviewer.user.name}</h3>
                  <Ratings averageRating={reviewer.rating} />

                  <p className="comment">{reviewer?.comment}</p>
                  <p className="review-date">2days ago</p>
                </section>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h3 className="no-review">No Reviews have for this shop!</h3>
          )}
        </article>
      )}
    </section>
  );
};

export default ShopInfo;
