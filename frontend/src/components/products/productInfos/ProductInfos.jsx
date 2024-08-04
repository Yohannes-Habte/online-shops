import React, { useState } from 'react';
import './ProductInfos.scss';
import Ratings from '../ratings/Ratings';
import { Link } from 'react-router-dom';

const ProductInfos = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="product-infos">
      <article className="tabs-wrapper">
        <h5
          className={active === 1 ? 'active' : 'passive'}
          onClick={() => setActive(1)}
        >
          Product Details
        </h5>

        <h5
          className={active === 2 ? 'active' : 'passive'}
          onClick={() => setActive(2)}
        >
          Product Reviews
        </h5>

        <h5
          className={active === 3 ? 'active' : 'passive'}
          onClick={() => setActive(3)}
        >
          Shop Information
        </h5>
      </article>

      {/* product Details */}
      {active === 1 ? (
        <article className="product-details-wrapper">
          <h3 className="product-name"> {data.name} </h3>
          <p className="description">{data.description}</p>
        </article>
      ) : null}

      {/* product reviews */}
      {active === 2 ? (
        <section className="product-reviews-wrapper">
          {data &&
            data.reviews.map((item) => (
              <div className="single-review-container">
                <figure className="image-container">
                  <img
                    src={`${item.user.image}`}
                    alt={item.user.name}
                    className="image"
                  />
                </figure>

                <article className="reviewer-rating-comment">
                  <h3 className="subTitle">{item.user.name}</h3>
                  {/* Ratings Component */}
                  <Ratings averageRating={data?.ratings} />
                  <p className="comment">{item.comment}</p>
                </article>
              </div>
            ))}

          {data && data.reviews.length === 0 && (
            <h3 className="no-product-review">
              No Reviews have for this product!
            </h3>
          )}
        </section>
      ) : null}

      {/* Shop Information */}
      {active === 3 && (
        <div className="product-and-shop-information-wrapper">
          <article className="product-information-wrapper">
            <figure className="image-container">
              <Link to={`/shop/preview/${data._id}`} className="link">
                <img
                  src={`${data?.images}`}
                  alt={data.name}
                  className="image"
                />
              </Link>
            </figure>

            <Link to={`/shop/preview/${data.shop._id}`} className="link">
              <h3 className={`shop-name`}>{data.name}</h3>
              <p className="shop-rating">Average Rating: {averageRating}</p>
              <p className="product-description">{data.description}</p>{' '}
            </Link>
          </article>

          <article className="shop-information-wrapper">
            <hp className="shop">
              Joined on:
              <span className="span">{data.createdAt?.slice(0, 10)}</span>
            </hp>
            <p className="shop">
              Total Products:
              <span className="span">{products && products.length}</span>
            </p>
            <h3 className="shop">
              Total Reviews:
              <span className="span">{totalReviewsLength}</span>
            </h3>
            <Link to="/">
              <p className="visit-shop">Go to Shoping</p>
            </Link>
          </article>
        </div>
      )}
    </div>
  );
};

export default ProductInfos;
