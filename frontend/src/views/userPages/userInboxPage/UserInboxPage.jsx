import React, { useEffect, useRef, useState } from 'react';
import './UserInboxPage.scss';
import Header from '../../../components/userLayout/header/Header';
import UserInbox from '../../../components/user/userInbox/UserInbox';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import and connect socket.io-client
import socketIO from 'socket.io-client';
import { format } from 'timeago.js';
import MessageList from '../../../components/user/userMessageList/MessageList';
const ENDPOINT = 'http://localhost:4000/';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });

const UserInboxPage = () => {
  // Global state variables
  const { currentUser, loading } = useSelector((state) => state.user);

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

  console.log('Data of user:', userData);

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
  // Get all user conversations
  // ===============================================================
  useEffect(() => {
    const getConversations = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/conversations/user-conversations/${currentUser?._id}`
        );

        setConversations(data.conversations);
      } catch (error) {
        // toast.error(error.response.data.message);
      }
    };
    getConversations();
  }, [currentUser, messages]);

  // ===============================================================
  // Dispaly active seller
  // ===============================================================
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser?._id;
      socketId.emit('addUser', userId);
      socketId.on('getUsers', (data) => {
        setOnlineUsers(data);
      });
    }
  }, [currentUser]);

  // ===============================================================
  // Online check
  // ===============================================================
  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== currentUser?._id
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
          `http://localhost:5000/api/messages/sender-messages/${currentChat?._id}`
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
      sender: currentUser._id,
      textMessage: textMessage,
      conversationId: currentChat._id,
    };

    // Receiver id tha will be used in the sendMessage socketId below
    const receiverId = currentChat.members.find(
      (member) => member.id !== currentUser._id
    );

    // Send message from the socket
    socketId.emit('sendMessage', {
      senderId: currentUser._id,
      receiverId,
      text: textMessage,
    });

    try {
      if (newTextMessage !== '') {
        const { data } = await axios.post(
          `http://localhost:5000/api/messages/create-message`,
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
      sellerId: currentUser._id,
    });

    try {
      // Body for update message
      const updateMessage = {
        lastMessage: textMessage,
        messageSenderId: currentUser._id,
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/conversations/update-lastMessage/${currentChat._id}`,
        updateMessage
      );
      setTextMessage('');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <main className="user-inbox-page">
      <Header />
      <section className="user-inbox-container">
        <section className="chats-lists-wrapper">
          <h1 className="chats-title"> Chats with Sellers </h1>
          {conversations &&
            conversations.map((conversation, index) => {
              return (
                <MessageList
                  key={index}
                  index={index}
                  conversation={conversation}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  currentUserId={currentUser._id}
                  userData={userData}
                  setUserData={setUserData}
                  setActiveStatus={setActiveStatus}
                  loading={loading}
                  online={onlineCheck(conversation)}
                />
              );
            })}
        </section>
        <div className='chat-messages-container'>
          {/* If open is true, then show us Chatting Shop inbox */}
          {open && (
            <UserInbox
              setOpen={setOpen}
              textMessage={textMessage}
              setTextMessage={setTextMessage}
              sendTextMessageHandler={sendTextMessageHandler}
              messages={messages}
              currentUserId={currentUser._id}
              userData={userData}
              activeStatus={activeStatus}
              scrollRef={scrollRef}
              setMessages={setMessages}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default UserInboxPage;
