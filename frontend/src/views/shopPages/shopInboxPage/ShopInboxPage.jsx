import { useEffect, useRef, useState } from "react";
import "./ShopInboxPage.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import ShopSideMessageList from "../../../components/shop/shopSideMessageList/ShopSideMessageList";
import ShopSideUserInbox from "../../../components/shop/shopSideUserInbox/ShopSideUserInbox";

// Import and connect socket.io-client
import socketIO from "socket.io-client";
const ENDPOINT = import.meta.env.VITE_REACT_APP_SOCKET;
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
socketId.on("connect", () => {
  console.log("Connected to socket: =>", socketId.id);
});

const ShopInboxPage = () => {
  const { currentSeller, loading } = useSelector((state) => state.seller);

  // Local state variables
  const [chatConversations, setChatConversations] = useState([]); // store all shop conversations
  const [incomingMessage, setIncomingMessage] = useState(null); // store incoming message from user to seller (shop)
  const [selectedChat, setSelectedChat] = useState(); // store selected chat conversation
  const [chatMessages, setChatMessages] = useState([]); // store all messages for selected chat conversation
  const [activeChatUser, setActiveChatUser] = useState(null); // store active chat user
  const [typedMessage, setTypedMessage] = useState(""); // store typed message
  const [connectedUsers, setConnectedUsers] = useState([]); // store all connected users
  const [isUserOnline, setIsUserOnline] = useState(false); // store user online status
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

  // scrollRef: store scroll reference
  const scrollRef = useRef(null);

  console.log("incomingMessage", incomingMessage);
  console.log("selectedChat", selectedChat);
  

  // =============================================================================
  // Get all shop conversations
  // =============================================================================
  useEffect(() => {
    const handleIncomingMessage = (data) => {
      console.log("Message received:", data); // Debugging
      setIncomingMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    };

    socketId.on("getMessage", handleIncomingMessage);

    return () => {
      socketId.off("getMessage", handleIncomingMessage);
    };
  }, []);

  // =============================================================================
  // Incoming chat message from user to seller (shop) and update chat messages
  // =============================================================================
  useEffect(() => {
    if (incomingMessage && selectedChat) {
      console.log("Incoming Message:", incomingMessage);
      console.log("Selected Chat Members:", selectedChat.members);

      if (selectedChat.members.includes(incomingMessage.sender)) {
        setChatMessages((prev) => [...prev, incomingMessage]);
      }
    }
  }, [incomingMessage, selectedChat]);

  // =============================================================================
  // Get all shop conversations
  // =============================================================================
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${API}/conversations/get-all-conversation-seller/${currentSeller?._id}`,
          { withCredentials: true }
        );
        setChatConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [currentSeller, chatMessages]);

  // =============================================================================
  // Add user to socket
  // =============================================================================
  useEffect(() => {
    if (currentSeller) {
      socketId.emit("addUser", currentSeller?._id);

      socketId.on("getUsers", (users) => {
        setConnectedUsers(users);
      });
    }
  }, [currentSeller]);

  // =============================================================================
  // Check if user is online
  // =============================================================================
  const checkUserOnlineStatus = (chat) => {
    const chatPartnerId = chat.members.find(
      (member) => member !== currentSeller?._id
    );
    return connectedUsers.some((user) => user.userId === chatPartnerId);
  };

  // =============================================================================
  // Get all messages for selected chat conversation
  // =============================================================================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API}/messages/get-all-messages/${selectedChat?._id}`
        );
        setChatMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  // =============================================================================
  // Handle sending message to user
  // =============================================================================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      sender: currentSeller._id,
      text: typedMessage,
      conversationId: selectedChat._id,
    };

    const recipientId = selectedChat.members.find(
      (member) => member.id !== currentSeller._id
    );

    socketId.emit("sendMessage", {
      senderId: currentSeller._id,
      receiverId: recipientId,
      text: typedMessage,
    });

    try {
      if (typedMessage !== "") {
        const res = await axios.post(
          `${API}/messages/create-new-message`,
          newMessage
        );
        setChatMessages([...chatMessages, res.data.message]);
        updateLastMessage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =============================================================================
  // Update the last message
  // =============================================================================
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: typedMessage,
      lastMessageId: currentSeller._id,
    });

    try {
      const updatedMessage = {
        lastMessage: typedMessage,
        lastMessageId: currentSeller._id,
      };
      await axios.put(
        `${API}/conversations/update-last-message/${selectedChat._id}`,
        updatedMessage
      );

      setTypedMessage("");
    } catch (error) {
      alert("Error updating last message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="message-dashboard-modal">
      {!isChatBoxOpen && (
        <section className="message-dashboard-wrapper">
          <h1 className="message-dashboard-title">All Messages</h1>
          {chatConversations &&
            chatConversations.map((conversation) => (
              <ShopSideMessageList
                conversation={conversation}
                key={conversation._id}
                setIsChatBoxOpen={setIsChatBoxOpen}
                setSelectedChat={setSelectedChat}
                shopId={currentSeller._id}
                setActiveChatUser={setActiveChatUser}
                activeChatUser={activeChatUser}
                online={checkUserOnlineStatus(conversation)}
                setIsUserOnline={setIsUserOnline}
                loading={loading}
              />
            ))}
        </section>
      )}

      {isChatBoxOpen && (
        <section className="message-box-wrapper">
          <ShopSideUserInbox
            setIsChatBoxOpen={setIsChatBoxOpen}
            typedMessage={typedMessage}
            setTypedMessage={setTypedMessage}
            handleSendMessage={handleSendMessage}
            chatMessages={chatMessages}
            userId={currentSeller._id}
            activeChatUser={activeChatUser}
            isUserOnline={isUserOnline}
            scrollRef={scrollRef}
          />
        </section>
      )}
    </div>
  );
};

export default ShopInboxPage;
