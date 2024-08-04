import React, { useState } from 'react';
import './Blog.scss';
import { Link } from 'react-router-dom';
import ButtonLoader from '../../utils/loader/ButtonLoader';

const Blog = () => {
  // Local state variables
  const [loading, setLoading] = useState(false);
  return (
    <section className="blog-container">
      <h1 className="blog-title"> Best Docartion for Home Decoration </h1>
      <p className="pargraph">
        If you have been reading this blog for a while, you have probably seen
        at least one of our customer spotlights. We love our customers! As a
        former small business marketer myself, I love our passionate dedication
        to empowering and supporting small business growth. That is why this
        website is for you to realize your dream.
      </p>
      <Link to={'/products'} className="link">
        <button className="blog-btn">
          {loading && <ButtonLoader />}
          {loading && <span>Loading...</span>}
          {!loading && <span>Shop Now</span>}
        </button>
      </Link>
    </section>
  );
};

export default Blog;
