import React, { useEffect, useState } from 'react';
import './ShopMessageList.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';

const ShopMessageList = ({
  conversation,
  index,
  setOpen,
  setCurrentChat,
  shopId,
  setUserData,
  userData,
  setActiveStatus,
  loading,
  online,
}) => {
  const navigate = useNavigate();
  console.log('user status', online);

  // Local state variables
  const [user, setUser] = useState([]);
  const [active, setActive] = useState(0);

  // Handle click
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };

  // Get user
  useEffect(() => {
    const userId = conversation.members.find((user) => user != shopId);

    const getUser = async () => {
      try {
        const { data } = await axios.get(`${API}/users/user/${userId}`);
        setUser(data.user);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getUser();
  }, []);

  return (
    <section
      onClick={() =>
        setActive(index) ||
        handleClick(conversation._id) ||
        setCurrentChat(conversation) ||
        setUserData(user) ||
        setActiveStatus('online')
      }
      className={
        active
          ? 'message-list-active-mode-wrapper'
          : 'message-list-passive-mode-wrapper'
      }
    >
      <article className="user-and-message-container">
        <figure className="image-container">
          <img src={user?.image} alt={user.name} className="image" />
          {online ? <div className="online" /> : <div className="offline" />}
        </figure>
        <aside className="user-name-and-message">
          <h3 className="user-name"> {userData?.name} </h3>
          <p className="user-message">
            {conversation?.messageSenderId !== user?._id ? (
              <strong style={{ color: 'green' }}>You:</strong>
            ) : (
              user?.name?.split(' ')[0] + ': '
            )}{' '}
            {conversation?.lastMessage}
          </p>
        </aside>

        <div className="active" />
      </article>

      <h5 onClick={() => setOpen(true)} className="chat-btn">
        Chat
      </h5>
    </section>
  );
};

export default ShopMessageList;
