import React from 'react';
import './DrpDown.scss';
import { NavLink } from 'react-router-dom';

const DropDown = ({ products, setDropDown }) => {

  // Handle submit
  const handleSubmit = (e) => {
    setDropDown(false);
    window.location.reload();
  };
  return (
    <section className="categories-data-wrapper">
      {products &&
        products.map((product) => {
          return (
            <article
              key={product._id}
              onClick={() => handleSubmit(product)}
              className="product"
            >
              <h3 className="subTitle">
                <NavLink to={`/products/${product._id}`}>
                  {product.category}
                </NavLink>
              </h3>
            </article>
          );
        })}
    </section>
  );
};

export default DropDown;
