import { useState } from "react";
import "./ShopInfo.scss";
import { useSelector } from "react-redux";
import Ratings from "../../products/ratings/Ratings";
import ProductCard from "../../products/productCard/ProductCard";
import { formatDistanceToNow } from "date-fns";
import ShopProducts from "../../../hooks/ShopProducts";

// The isOwner comes from ShopHome.jsx page
const ShopInfo = () => {
  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  // const { shopProducts } = useSelector((state) => state.product);
  const { events } = useSelector((state) => state.event);

  const { shopProducts } = ShopProducts();

  // Local state variables
  const [active, setActive] = useState(1);

  // All reviews
  const allReviews =
    shopProducts && shopProducts.map((product) => product.reviews).flat();

  return (
    <section className="shop-info-contianer">
      <h1 className="shop-title"> {currentSeller?.name} </h1>

      <article className="tabs-wrapper">
        <h3
          onClick={() => setActive(1)}
          className={active === 1 ? "active" : "passive"}
        >
          Shop Products
        </h3>

        <p
          onClick={() => setActive(2)}
          className={active === 2 ? "active" : "passive"}
        >
          Running Events
        </p>

        <p
          onClick={() => setActive(3)}
          className={active === 3 ? "active" : "passive"}
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
            {/* {shopEvents.map((event, index) => (
                <ProductCard
                  product={event}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))} */}
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
            allReviews.map((reviewer) => {
              // Find the product associated with this review
              const product = shopProducts.find((p) =>
                p.reviews.some((rev) => rev._id === reviewer._id)
              );

              return (
                <div key={reviewer._id} className="shop-review">
                  <figure className="image-container">
                    <img
                      src={`${reviewer.user.image}`}
                      className="image"
                      alt="User Avatar"
                    />
                  </figure>
                  <section className="user-rating">
                    <h3 className="reviewer-name">{reviewer.user?.name}</h3>
                    <p>{reviewer.user?.email}</p>
                    <div className="rating-wrapper">
                      <Ratings ratings={product?.ratings?.average || 0} />
                      <span>
                        {" "}
                        ({product?.ratings?.average?.toFixed(1) ||
                          "0.0"}/5){" "}
                      </span>
                    </div>

                    <p className="comment">{reviewer?.comment}</p>
                    <p className="review-date">
                      {formatDistanceToNow(new Date(reviewer.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </section>
                </div>
              );
            })}
          {allReviews && allReviews.length === 0 && (
            <h3 className="no-review">No Reviews for this shop!</h3>
          )}
        </article>
      )}
    </section>
  );
};

export default ShopInfo;
