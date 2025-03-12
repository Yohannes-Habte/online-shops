import { useEffect, useState } from "react";
import "./ShopSideMessageList.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";

const ShopSideMessageList = ({
  data,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  loading,
}) => {
 
  const [user, setUser] = useState([]);
  const [active, setActive] = useState(0);

  // Handle click
  const handleClick = () => {
    setOpen(true);
    setActive(data._id);
    setCurrentChat(data);
    setUserData(user);
    setActiveStatus(online);
  };

  // Get user
  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${API}/users/user-info/${userId}`);

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

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
          <h3 className="user-name"> {data?.name} </h3>
          <p className="user-message">
            {!loading && data?.messageSenderId !== user?._id ? (
              <strong style={{ color: "green" }}>You:</strong>
            ) : (
              user?.name?.split(" ")[0] + ": "
            )}{" "}
            {data?.lastMessage}
          </p>
        </aside>

        <div className="active" />
      </article>

      <h5 onClick={() => setOpen(true)} className="chat-btn">
        Chat
      </h5>
    </div>
  );
};

export default ShopSideMessageList;
