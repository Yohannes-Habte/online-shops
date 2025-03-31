import UserSingleOrderItemCard from "../userSingleItemOrderCard/UserSingleOrderItemCard";
import "./UserSingleOrderItems.scss";

const UserSingleOrderItems = ({ orderInfos, setOpen, setSelectedProduct }) => {
  return (
    <section className="user-ordered-items-container">
      <h2 className="user-order-items-title">Ordered Items</h2>
      {orderInfos?.orderedItems?.map((item) => (
        <UserSingleOrderItemCard
          key={item._id}
          product={item}
          setOpen={setOpen}
          setSelectedProduct={setSelectedProduct}
        />
      ))}
    </section>
  );
};

export default UserSingleOrderItems;
