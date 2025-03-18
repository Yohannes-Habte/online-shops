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
const shopSocket = socketIO(ENDPOINT, { transports: ["websocket"] });

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

  console.log("selectedChat", selectedChat);

  // scrollRef: store scroll reference
  const scrollRef = useRef(null);

  // =============================================================================
  // Listen for incoming messages
  // =============================================================================

  useEffect(() => {
    const handleIncomingMessage = (data) => {
      console.log("Message received:", data);
      setIncomingMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    };

    shopSocket.on("receive-message", handleIncomingMessage);

    return () => {
      shopSocket.off("receive-message", handleIncomingMessage);
    };
  }, []);

  // =============================================================================
  // Update chat messages when a new message comes in
  // =============================================================================
  useEffect(() => {
    if (incomingMessage && selectedChat) {
      console.log("Incoming Message:", incomingMessage);
      console.log("Selected Chat Members:", selectedChat?.members);

      if (selectedChat.members?.includes(incomingMessage.sender)) {
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
  // Add seller and customer to socket
  // =============================================================================
  useEffect(() => {
    if (currentSeller && selectedChat) {
      shopSocket.emit("addUser", currentSeller._id);

      const customerId = selectedChat.members.find(
        (member) => member !== currentSeller._id
      );
      if (customerId) {
        shopSocket.emit("addUser", customerId);
      }
    }

    shopSocket.on("connect", () => {
      if (currentSeller) {
        shopSocket.emit("addUser", currentSeller._id);
      }

      if (selectedChat) {
        const customerId = selectedChat.members.find(
          (member) => member !== currentSeller._id
        );
        if (customerId) {
          shopSocket.emit("addUser", customerId);
        }
      }
    });

    shopSocket.on("getUsers", (users) => {
      setConnectedUsers(users);
    });

    return () => {
      shopSocket.off("getUsers");
      shopSocket.off("connect");
    };
  }, [currentSeller, selectedChat]); // Depend on selectedChat as well

  // =============================================================================
  // Check if user is online
  // =============================================================================
  const checkUserOnlineStatus = (chat) => {
    const chatPartnerId = chat.members.find(
      (member) => member !== currentSeller?._id
    );
    console.log("Chat Partner ID:", chatPartnerId);
    let users= connectedUsers.some((user) => user.userId === chatPartnerId);
    console.log("Users:", users);
    return users;
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
      (member) => member !== currentSeller._id
    );

    shopSocket.emit("sendMessage", {
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
    shopSocket.emit("updateLastMessage", {
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
                isUserOnline={isUserOnline}
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
