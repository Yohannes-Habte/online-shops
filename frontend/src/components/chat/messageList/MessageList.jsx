import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../../utils/security/secreteKey";
import "./MessageList.scss";

const MessageList = ({
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
      className={`message-list-item ${active === index ? "active" : ""}`}
      onClick={handleClick}
    >
      <figure className="image-container">
        <img
          src={user?.LogoImage} // Ensure safe access
          alt={user?.name} // Ensure fallback for null seller name
          className="image"
        />
        <div className={online ? "online" : "offline"} />
      </figure>

      <article className="shop-info">
        <h3 className="user-name">{user?.name || "Unknown User"}</h3>
        <p className="user-message">
          {!loading && data?.messageSenderId !== user?._id ? (
            <strong style={{ color: "green" }}>You:</strong>
          ) : (
            user?.name?.split(" ")[0] + ": "
          )}{" "}
          {data?.lastMessage}
        </p>
      </article>
    </div>
  );
};

export default MessageList;
