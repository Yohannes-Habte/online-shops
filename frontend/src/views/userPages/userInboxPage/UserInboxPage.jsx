import { useEffect, useRef, useState } from "react";
import "./UserInboxPage.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import UserSideMessageList from "../../../components/chat/userSideMessageList/UserSideMessageList";
import UserSideSellerInbox from "../../../components/chat/userSideSellerInbox/UserSideSellerInbox";

// Import and connect socket.io-client
import socketIO from "socket.io-client";
const ENDPOINT = import.meta.env.VITE_REACT_APP_SOCKET;
const userSocket = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInboxPage = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sellerData, setSellerData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);


  // =============================================================================
  // Get all shop conversations
  // =============================================================================
  useEffect(() => {
    userSocket.on("getMessage", (data) => {
      setIncomingMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // =============================================================================
  // Incoming chat message from seller to user and update chat messages
  // =============================================================================
  useEffect(() => {
    if (
      incomingMessage &&
      selectedChat?.members.includes(incomingMessage.sender)
    ) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, selectedChat]);

  // =============================================================================
  // Get all user conversations
  // =============================================================================
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${API}/conversations/get-all-conversation-seller/${currentUser?._id}`,
          { withCredentials: true }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [currentUser, messages]);

  // =============================================================================
  // Add customer and seller to socket
  // =============================================================================
  useEffect(() => {
    if (currentUser && selectedChat) {
      userSocket.emit("addUser", currentUser._id);

      const shopId = selectedChat.members.find(
        (member) => member !== currentUser._id
      );
      if (shopId) {
        userSocket.emit("addUser", shopId);
      }
    }

    userSocket.on("connect", () => {
      if (currentUser) {
        userSocket.emit("addUser", currentUser._id);
      }

      if (selectedChat) {
        const shopId = selectedChat.members.find(
          (member) => member !== currentUser._id
        );
        if (shopId) {
          userSocket.emit("addUser", shopId);
        }
      }
    });

    userSocket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      userSocket.off("getUsers");
      userSocket.off("connect");
    };
  }, [currentUser, selectedChat]);

  // ==============================================================================
  // Check online users
  // ==============================================================================
  const onlineUsersCheck = (chat) => {
    if (!currentUser || !onlineUsers.length) return false;

    const chattingPartnerId = chat.members.find(
      (member) => member !== currentUser._id
    );

    const isOnline = onlineUsers.some(
      (user) => user.userId === chattingPartnerId
    );

    console.log(`Checking online status for ${chattingPartnerId} =`, isOnline);

    return isOnline;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${API}/messages/get-all-messages/${selectedChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [selectedChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: selectedChat._id,
    };

    const receiverId = selectedChat.members.find(
      (member) => member !== currentUser?._id
    );

    userSocket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        `${API}/messages/create-new-message`,
        message
      );
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
      updateLastMessage();
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const updateLastMessage = async () => {
    userSocket.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: currentUser._id,
    });

    await axios
      .put(`${API}/conversations/update-last-message/${selectedChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: currentUser._id,
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="user-inbox-page">
      <div className="user-inbox-container">
        {!open && (
          <>
            <h1 className="user-inbox-title">All Messages</h1>
            {conversations.map((conversation) => (
              <UserSideMessageList
                data={conversation}
                key={conversation._id}
                setOpen={setOpen}
                setSelectedChat={setSelectedChat}
                me={currentUser?._id}
                setSellerData={setSellerData}
                sellerData={sellerData}
                online={onlineUsersCheck(conversation)}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                loading={loading}
              />
            ))}
          </>
        )}

        {open && (
          <UserSideSellerInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            messageSenderId={currentUser._id}
            sellerData={sellerData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
          />
        )}
      </div>
    </main>
  );
};

export default UserInboxPage;
