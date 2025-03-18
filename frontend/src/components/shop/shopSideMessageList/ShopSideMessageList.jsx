import { useEffect, useState } from "react";
import "./ShopSideMessageList.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";

const ShopSideMessageList = ({
  conversation,
  setIsChatBoxOpen,
  setSelectedChat,
  shopId,
  setActiveChatUser,
  activeChatUser,
  online,
  setIsUserOnline,
  isUserOnline,
  loading,
}) => {
  const [user, setUser] = useState([]);
  const [active, setActive] = useState(0);

  // Display user online status
  useEffect(() => {
    setIsUserOnline(online);
  }, [online]);

  console.log("conversation", conversation);
  console.log("user online status:", isUserOnline);

  // Handle click
  const handleClick = () => {
    setIsChatBoxOpen(true);
    setActive(conversation._id);
    setSelectedChat(conversation);
    setActiveChatUser(user);
    setIsUserOnline(online);
  };

  // Get user
  useEffect(() => {
    setIsUserOnline(online);
    const userId = conversation.members.find((user) => user != shopId);

    const getUser = async () => {
      try {
        const res = await axios.get(`${API}/users/user-info/${userId}`);

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [shopId, conversation]);

  return (
    <div
      onClick={handleClick}
      className={
        active
          ? "message-list-active-mode-wrapper"
          : "message-list-passive-mode-wrapper"
      }
    >
      <article className="user-and-message-container">
        <figure className="image-container">
          <img src={user?.image} alt={user.name} className="image" />
          {online ? <div className="online" /> : <div className="offline" />}
        </figure>
        <aside className="user-name-and-message">
          <h3 className="user-name"> {activeChatUser?.name} </h3>
          <p className="user-message">
            {!loading && conversation?.messageSenderId !== user?._id ? (
              <strong style={{ color: "green" }}>You:</strong>
            ) : (
              user?.name?.split(" ")[0] + ": "
            )}{" "}
            {conversation?.lastMessage}
          </p>
        </aside>

        <div className="active" />
      </article>

      <h5 onClick={() => setIsChatBoxOpen(true)} className="chat-btn">
        Chat
      </h5>
    </div>
  );
};

export default ShopSideMessageList;
