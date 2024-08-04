import React from 'react';
import './EventCard.scss';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CountDown from '../countDown/CountDown';
import { addToCart } from '../../../redux/reducers/cartReducer';

const EventCard = ({ active, data, key }) => {
  // Global state variables
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  console.log("The product id is:", data._id)
  // Add to cart
  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error('Item already in cart!');
    } else {
      if (data.stock < 1) {
        toast.error('Product stock limited!');
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  return (
    <section className={active ? 'event-cart-container' : 'event-cart-wrapper'}>
      <figure className="image-container">
        <img src={data.images} alt={data.name} className="image" />
      </figure>
      <article className="event-details-wrapper">
        <h2 className={`subTitle`}>{data.name}</h2>
        <p className="description">{data.description}</p>

        <article className="event-price-wrapper">
          <p className="old-price">${data.originalPrice}</p>
          <h5 className="original-price">
            ${data.originalPrice - data.discountPrice}
          </h5>
          <p className="sold">{data.sold_out} sold</p>
        </article>

        <article className="buttons-wrapper">
          <button
            className={`add-to-cart-btn`}
            onClick={() => addToCartHandler(data)}
          >
            Add to cart
          </button>
          <CountDown data={data} />
          <Link to={`/products/${data._id}`}>
            <h4 className={`see-details-btn`}>See Details</h4>
          </Link>
        </article>
      </article>
    </section>
  );
};

export default EventCard;
