import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../utils/security/secreteKey';

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
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

  // display shop info
  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${API}/shops/shop/get-shop-info/${userId}`
        );
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={active === index ? 'active' : 'not-active'}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <figure className="image-container">
        <img src={`${user?.avatar?.url}`} alt="" className="image" />
        {online ? <div className="online" /> : <div className="offline" />}
      </figure>

      <article className="user-info">
        <h1 className="user-name">{user?.name}</h1>
        <p className="user-message">
          {!loading && data?.lastMessageId !== userData?._id
            ? 'You:'
            : userData?.name.split(' ')[0] + ': '}{' '}
          {data?.lastMessage}
        </p>
      </article>
    </div>
  );
};

export default MessageList;
