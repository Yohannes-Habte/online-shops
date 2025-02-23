import "./UserSingleOrderItems.scss";

const UserSingleOrderItems = ({ orderInfos, setOpen, setSelectedProduct }) => {
  return (
    <section className="user-ordered-items-container">
      <h2>Ordered Items</h2>
      {orderInfos?.orderedItems?.map((product) => (
        <article key={product._id} className="product-card">
          <figure className="product-image">
            <img
              src={product?.productImage || "https://via.placeholder.com/150"}
              alt={product?.title}
            />
          </figure>
          <div className="product-info">
            <h3>{product?.title}</h3>
            <p>
              Brand: <strong>{product?.brand?.brandName}</strong>
            </p>
            <p>Category: {product?.category?.categoryName}</p>
            <p>Subcategory: {product?.subcategory?.subcategoryName}</p>
            <p>Color: {product?.productColor}</p>
            <p>Size: {product?.size}</p>
            <p>Quantity: {product?.quantity}</p>
            <p>
              Price: <strong>${product?.price}</strong>
            </p>
            <p>
              Total: <strong>${product?.total}</strong>
            </p>

            <button
              onClick={() => {
                setOpen(true);
                setSelectedProduct(product);
              }}
            >
              Leave a Review
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};

export default UserSingleOrderItems;
