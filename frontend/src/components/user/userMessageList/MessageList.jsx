import React, { useEffect, useState } from 'react';
import './UserMessageList.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';

const MessageList = ({
  index,
  conversation,
  setOpen,
  setCurrentChat,
  currentUserId,
  userData,
  setUserData,
  setActiveStatus,
  online,
}) => {
  const navigate = useNavigate();

  // Local state variables
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);

  // Handle click
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  // Get a seller
  useEffect(() => {
    setActiveStatus(online);
    const userId = conversation.members.find((user) => user !== currentUserId);

    const getUser = async () => {
      try {
        const { data } = await axios.get(
          `${API}/shops/shop/${userId}`
        );
        setUser(data.shop);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getUser();
  }, [currentUserId, conversation]);

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
        active === index
          ? 'active-users-list-wrapper'
          : 'passive-users-list-wrapper'
      }
    >
      <article className="user-info-box">
        <figure className="image-container">
          <img src={user?.image} alt={user.name} className="image" />
          {online ? <div className="online" /> : <div className="offline" />}
        </figure>
        
        <aside className="user-name-and-message">
          <h3 className="user-name"> {user?.name} </h3>
          <p className="user-message">
            {conversation?.messageSenderId !== userData?._id ? (
              <strong style={{ color: 'green' }}>You:</strong>
            ) : (
              userData?.name?.split(' ')[0] + ': '
            )}{' '}
            {conversation?.lastMessage}
          </p>
        </aside>

        <div className="active" />
       
      </article>
    </section>
  );
};

export default MessageList;
