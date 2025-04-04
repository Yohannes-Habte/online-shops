import { useEffect, useState, useMemo } from "react";
import "./ShopInventory.scss";
import { useDispatch, useSelector } from "react-redux";
import Ratings from "../../products/ratings/Ratings";
import ProductCard from "../../products/productCard/ProductCard";
import { formatDistanceToNow } from "date-fns";
import ShopProducts from "../../../hooks/ShopProducts";
import {
  clearEventErrorsAction,
  fetchShopEvents,
} from "../../../redux/actions/event";
import EventCard from "../../events/eventCart/EventCard";

const ShopInventory = () => {
  const dispatch = useDispatch();

  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { loading, shopEvents, error } = useSelector((state) => state.event);
  const { shopProducts } = ShopProducts();

  // Local state variables
  const [activeTab, setActiveTab] = useState(1);

  // Memoized computed value for performance optimization
  const allReviews = useMemo(() => {
    return shopProducts
      ? shopProducts.flatMap((product) => product.reviews || [])
      : [];
  }, [shopProducts]);

  useEffect(() => {
    if (currentSeller && shopEvents.length === 0) {
      dispatch(clearEventErrorsAction());
      dispatch(fetchShopEvents());
    }

    return () => {
      if (error) {
        dispatch(clearEventErrorsAction());
      }
    };
  }, [dispatch, currentSeller, error, shopEvents.length]);

  return (
    <section className="shop-inventory-container">
      <h1 className="shop-title">{currentSeller?.name || "Shop"}</h1>

      <article className="shop-tabs-wrapper">
        <h3
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? "active-shop-tab" : "passive-shop-tab"}
        >
          Shop Products
        </h3>

        <p
          onClick={() => setActiveTab(2)}
          className={activeTab === 2 ? "active-shop-tab" : "passive-shop-tab"}
        >
          Running Events
        </p>

        <p
          onClick={() => setActiveTab(3)}
          className={activeTab === 3 ? "active-shop-tab" : "passive-shop-tab"}
        >
          Shop Reviews
        </p>
      </article>

      <div className="horizontal-line"></div>

      {/* Shop Products */}
      {activeTab === 1 && (
        <div className="shop-products">
          {shopProducts?.length > 0 ? (
            shopProducts.map((product, index) => (
              <ProductCard
                product={product}
                key={product._id || index}
                isShop
              />
            ))
          ) : (
            <h3 className="no-products">No products available.</h3>
          )}
        </div>
      )}

      {/* Shop Events */}
      {activeTab === 2 && (
        <div className="shop-events-wrapper">
          {loading && <p className="loading">Loading events...</p>}

          {error && <p className="error"> {error || "No Events Found!"}</p>}

          {Array.isArray(shopEvents) &&
            shopEvents.length > 0 &&
            shopEvents.map((event, index) => (
              <EventCard data={event} key={event._id || index} />
            ))}
        </div>
      )}

      {/* Shop Reviews */}
      {activeTab === 3 && (
        <article className="shop-reviews-wrapper">
          {allReviews?.length > 0 ? (
            allReviews.map((review) => {
              const product = shopProducts.find((p) =>
                p.reviews.some((rev) => rev._id === review._id)
              );

              return (
                <div key={review._id} className="shop-review">
                  <figure className="image-container">
                    <img
                      src={review.user?.image || "/default-avatar.png"}
                      className="image"
                      alt="User Avatar"
                      loading="lazy"
                    />
                  </figure>
                  <section className="user-rating">
                    <h3 className="reviewer-name">
                      {review.user?.name || "Anonymous"}
                    </h3>
                    <p>{review.user?.email || "No email provided"}</p>
                    <div className="rating-wrapper">
                      <Ratings ratings={product?.ratings?.average || 0} />
                      <span>
                        {" "}
                        ({product?.ratings?.average?.toFixed(1) ||
                          "0.0"}/5){" "}
                      </span>
                    </div>

                    <p className="comment">
                      {review?.comment || "No comment provided"}
                    </p>
                    <p className="review-date">
                      {review.createdAt
                        ? formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })
                        : "Date not available"}
                    </p>
                  </section>
                </div>
              );
            })
          ) : (
            <h3 className="no-review">No reviews for this shop yet.</h3>
          )}
        </article>
      )}
    </section>
  );
};

export default ShopInventory;
