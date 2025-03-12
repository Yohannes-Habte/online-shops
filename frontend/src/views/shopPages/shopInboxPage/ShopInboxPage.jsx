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

const ShopInboxPage = () => {
  const { currentSeller, loading } = useSelector((state) => state.seller);

  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  // const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  // ============================================================================================
  // socketId.on() is a method used in Socket.IO, a library for real-time, bidirectional communication between web clients and servers.

  //What does socketId.on(event, callback) do?
  // * It listens for a specific event (event) emitted by the server.
  // * When the event occurs, it executes the provided callback function.
  // ============================================================================================
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // ============================================================================================
  // Get all conversations for the current seller
  // ============================================================================================
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // ============================================================================================
  // Get all conversations for the current seller
  // ============================================================================================
  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${API}/conversations/get-all-conversation-seller/${currentSeller?._id}`,
          { withCredentials: true }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [currentSeller, messages]);

  // ============================================================================================
  // socketId.emit(event, data) is a Socket.IO method used to send (emit) an event with optional data from the client to the server (or vice versa).
  // It is used for real-time communication in web applications.
  // Get online users and add user to the list of online users.
  // Ensures onlineUsers always updates when users join or leave.
  // ============================================================================================
  useEffect(() => {
    if (currentSeller) {
      const sellerId = currentSeller?._id;
      socketId.emit("addUser", sellerId);

      // Listen for the updated list of online users
      socketId.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [currentSeller]);

  // ============================================================================================
  // Check if user is online
  // ============================================================================================
  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== currentSeller?._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    console.log("online", online);
    return online ? true : false;
  };

  // ============================================================================================
  // Get all messages for the current chat
  // ============================================================================================
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${API}/messages/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // ============================================================================================
  // sendMessageHandler() is a function that sends a message to the server and updates the last message in the conversation.
  // ============================================================================================
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    console.log("Sending message:", newMessage);

    const message = {
      sender: currentSeller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== currentSeller._id
    );

    socketId.emit("sendMessage", {
      senderId: currentSeller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${API}/messages/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ============================================================================================
  // updateLastMessage() is a function that updates the last message in the conversation.
  // ============================================================================================
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: currentSeller._id,
    });

    await axios
      .put(`${API}/conversations/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: currentSeller._id,
      })
      .then((res) => {
        console.log(res);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ============================================================================================
  // handleImageUpload() is a function that reads the image file and sends it to the server.
  // ============================================================================================
  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        // setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  // ============================================================================================
  // imageSendingHandler() is a function that sends an image to the server and updates the last message in the conversation.
  // ============================================================================================
  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== currentSeller._id
    );

    socketId.emit("sendMessage", {
      senderId: currentSeller._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${API}/messages/create-new-message`, {
          images: e,
          sender: currentSeller._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          // setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  // ============================================================================================
  // updateLastMessageForImage() is a function that updates the last message in the conversation when an image is sent.
  // ============================================================================================
  const updateLastMessageForImage = async () => {
    await axios.put(
      `${API}/conversations/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: currentSeller._id,
      }
    );
  };

  // ============================================================================================
  // Return the ShopInboxPage component
  // ============================================================================================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-dashboard-modal">
      {!open && (
        <section className="message-dashboard-wrapper">
          <h1 className="message-dashboard-title">All Messages</h1>
          {conversations &&
            conversations.map((item, index) => {
              return (
                <ShopSideMessageList
                  data={item}
                  key={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={currentSeller._id}
                  setUserData={setUserData}
                  userData={userData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                  loading={loading}
                />
              );
            })}
        </section>
      )}

      {open && (
        <section className="message-box-wrapper">
          <ShopSideUserInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            userId={currentSeller._id}
            userData={userData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
            setMessages={setMessages}
            handleImageUpload={handleImageUpload}
          />
        </section>
      )}
    </div>
  );
};

export default ShopInboxPage;
