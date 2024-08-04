import React from 'react';
import './WishList.scss';
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../../redux/reducers/wishListReducer';
import { addToCart } from '../../../redux/reducers/cartReducer';
import { RxCross1 } from 'react-icons/rx';
import CartSingle from '../singleWishList/CartSingle';

const WishList = ({ setOpenWishList }) => {
  // Global state variables
  const { wishList } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  // Total price
  const totalPrice = wishList.reduce(
    (acc, item) => acc + item.discountPrice,
    0
  );

  // Change quantity handler
  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(newData));
    setOpenWishList(false);
  };
  // Remove from wishlist handler
  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <main className="whilist">
      <article className="wishlist-container">
        {wishList && wishList.length === 0 ? (
          <section className="empty-wishlist-wrapper">
            <RxCross1
              className="close-empty-icon"
              onClick={() => setOpenWishList(false)}
            />
            <h2 className="empty-cart">Cart wishlist Items is empty!</h2>
          </section>
        ) : (
          <section className="wishlist-order-wrapper">
            <RxCross1
              className="close-order-icon"
              onClick={() => setOpenWishList(false)}
            />

            {/* Item length */}
            <AiOutlineHeart size={25} style={{ color: 'red' }} />
            <h5 className="wishlist-items">
              {wishList &&
                wishList.length === 0 &&
                `THere is ${wishList.length} Item in the Wishlist`}
              {wishList &&
                wishList.length > 1 &&
                `THere are ${wishList.length} Items in the Wishlist`}
            </h5>

            {/* cart Single Items */}
            <div className="single-cart-wrapper">
              {wishList &&
                wishList.map((product) => (
                  <CartSingle
                    key={product._id}
                    data={product}
                    addToCartHandler={addToCartHandler}
                    removeFromWishlistHandler={removeFromWishlistHandler}
                  />
                ))}
            </div>
          </section>
        )}
        <h3> Total Price: ${totalPrice} </h3>
      </article>
    </main>
  );
};

export default WishList;
