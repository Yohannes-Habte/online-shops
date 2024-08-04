import React, { useEffect, useRef, useState } from 'react';
import './DashboardMessages.scss';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import ShopMessageList from '../shopMessageList/ShopMessageList';
import ShopInbox from '../shopInbox/ShopInbox';

// Import and connect socket.io-client
import socketIO from 'socket.io-client';
import { format } from 'timeago.js';
import { API } from '../../../utils/security/secreteKey';
const ENDPOINT = 'http://localhost:4000/';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

const DashboardMessages = () => {
  // Global state variables
  const { currentSeller, loading } = useSelector((state) => state.seller);

  // Local state variables for conversation (refer to backend conversation model)
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(); // conversation Model
  const [conversations, setConversations] = useState([]);

  // Local state variables for sending new message using Message Model
  const [images, setImages] = useState();
  const [textMessage, setTextMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  // Local state variables for user and status (active or passive)
  const [userData, setUserData] = useState(null);
  const [activeStatus, setActiveStatus] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // use ref
  const scrollRef = useRef(null);

  // ===============================================================
  // Connect socket
  // ===============================================================

  useEffect(() => {
    socketId.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        textMessage: data.textMessage,
        createdAt: Date.now(),
      });
    });
  }, []);

  // ===============================================================
  // Dispaly the last arrived message, which is chat updating
  // ===============================================================

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // ===============================================================
  // Get all shop conversations
  // ===============================================================
  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.get(
          `${API}/conversations/shop-conversations/${currentSeller?._id}`
        );

        setConversations(data.conversations);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getConversation();
  }, [currentSeller, messages]);

  // ===============================================================
  // Dispaly active seller
  // ===============================================================
  useEffect(() => {
    if (currentSeller) {
      const sellerId = currentSeller?._id;
      socketId.emit('addUser', sellerId);
      socketId.on('getUsers', (data) => {
        setOnlineUsers(data);
      });
    }
  }, [currentSeller]);

  // ===============================================================
  // Online check
  // ===============================================================
  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== currentSeller?._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // ===============================================================
  // Display all conversations for a specific conversationId
  // ===============================================================
  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API}/messages/sender-messages/${currentChat?._id}`
        );

        setMessages(data.messages);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getMessages();
  }, [currentChat]);

  // ===============================================================
  // Send text message handler
  // ===============================================================
  const sendTextMessageHandler = async (e) => {
    e.preventDefault();

    // Body for new message
    const newTextMessage = {
      sender: currentSeller._id,
      textMessage: textMessage,
      conversationId: currentChat._id,
    };

    // Receiver id tha will be used in the sendMessage socketId below
    const receiverId = currentChat.members.find(
      (member) => member.id !== currentSeller._id
    );

    // Send message from the socket
    socketId.emit('sendMessage', {
      senderId: currentSeller._id,
      receiverId,
      text: textMessage,
    });

    try {
      if (newTextMessage !== '') {
        const { data } = await axios.post(
          `${API}/messages/create-message`,
          newTextMessage
        );

        setMessages([...messages, data.message]);
        updateLastMessage();
        setTextMessage('');
      } else {
        toast.error('Please enter text message');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // ===============================================================
  // Update the latest message
  // ===============================================================
  const updateLastMessage = async () => {
    socketId.emit('updateLastMessage', {
      lastMessage: textMessage,
      sellerId: currentSeller._id,
    });

    try {
      // Body for update message
      const updateMessage = {
        lastMessage: textMessage,
        messageSenderId: currentSeller._id,
      };

      const { data } = await axios.put(
        `${API}/conversations/update-lastMessage/${currentChat._id}`,
        updateMessage
      );
      setTextMessage('');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="message-dashboar-modal">
      {/* If open is not true, show us All messages list */}
      {!open && (
        <section className="message-dashboar-wrapper">
          <h1 className="message-dashboar-title">All Messages</h1>
          {conversations &&
            conversations.map((conversation, index) => {
              return (
                <ShopMessageList
                  key={index}
                  index={index}
                  conversation={conversation}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  shopId={currentSeller._id}
                  userData={userData}
                  setUserData={setUserData}
                  setActiveStatus={setActiveStatus}
                  loading={loading}
                  online={onlineCheck(conversation)}
                />
              );
            })}
        </section>
      )}

      {/* If open is true, then show us Chatting Shop inbox */}
      {open && (
        <ShopInbox
          setOpen={setOpen}
          textMessage={textMessage}
          setTextMessage={setTextMessage}
          sendTextMessageHandler={sendTextMessageHandler}
          messages={messages}
          sellerId={currentSeller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default DashboardMessages;
