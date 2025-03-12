import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../../utils/security/secreteKey";
import "./UserSideMessageList.scss";

const UserSideMessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setSellerData,
  online,
  setActiveStatus,
  loading,
}) => {
  
  const [active, setActive] = useState(null);
  const [user, setUser] = useState([]);

  // Handle chat selection
  const handleClick = () => {
    setActive(index);
    setOpen(true);
    setCurrentChat(data);
    setSellerData(user);
    setActiveStatus(online);
  };

  // Fetch user/shop info
  useEffect(() => {
    setActiveStatus(online);

    const userId = data.members.find((user) => user !== me);

    const fetchShop = async () => {
      try {
        const res = await axios.get(`${API}/shops/get-shop-info/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data.shop);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchShop();
  }, [me, data, online]);

  console.log("User:", user);
  console.log("Data:", data);
  return (
    <div
      onClick={handleClick}
      className={
        active
          ? "user-side-message-list-active-mode-wrapper"
          : "user-side-message-list-passive-mode-wrapper"
      }
    >
      <section className="user-side-message-list-container">
        <figure className="image-container">
          <img
            src={user?.LogoImage} // Ensure safe access
            alt={user?.name} // Ensure fallback for null seller name
            className="image"
          />
          {online ? <div className="online" /> : <div className="offline" />}
        </figure>

        <aside className="user-side-shop-info-message-wrapper">
          <h3 className="shop-name">{user?.name || "Unknown User"}</h3>
          <p className="shop-message">
            {!loading && data?.messageSenderId !== user?._id ? (
              <strong style={{ color: "green" }}>You:</strong>
            ) : (
              user?.name?.split(" ")[0] + ": "
            )}{" "}
            {data?.lastMessage}
          </p>
        </aside>
      </section>

      <h5 onClick={() => setOpen(true)} className="user-side-chat-btn">
        Chat
      </h5>
    </div>
  );
};

export default UserSideMessageList;
