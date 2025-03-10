import { useEffect, useRef, useState } from "react";
import "./DashboardMessages.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import ShopMessageList from "../shopMessageList/ShopMessageList";

// Import and connect socket.io-client
import socketIO from "socket.io-client";
import { API } from "../../../utils/security/secreteKey";
import ShopUserInbox from "../shopInbox/UserShopInbox";
const ENDPOINT = import.meta.env.VITE_REACT_APP_SOCKET;
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
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

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

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

  useEffect(() => {
    if (currentSeller) {
      const sellerId = currentSeller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [currentSeller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== currentSeller?._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

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

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${API}/conversations/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: currentSeller._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-dashboar-modal">
      {!open && (
        <section className="message-dashboar-wrapper">
          <h1 className="message-dashboar-title">All Messages</h1>
          {conversations &&
            conversations.map((item, index) => {
              return (
                <ShopMessageList
                  data={item}
                  key={index}
                  index={index}
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
          <ShopUserInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            sellerId={currentSeller._id}
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

export default DashboardMessages;
