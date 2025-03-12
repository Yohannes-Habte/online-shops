import { useEffect, useRef, useState } from "react";
import "./UserInboxPage.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import socketIO from "socket.io-client";
import UserSideMessageList from "../../../components/chat/userSideMessageList/UserSideMessageList";
import UserSideSellerInbox from "../../../components/chat/userSideSellerInbox/UserSideSellerInbox";
const ENDPOINT = import.meta.env.VITE_REACT_APP_SOCKET;
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInboxPage = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sellerData, setSellerData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("connect", () => {
      console.log("Socket connected:", socketId.id);
    });

    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socketId.off("connect");
      socketId.off("getMessage");
    };
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          `${API}/conversations/get-all-conversation-user/${currentUser?._id}`,
          { withCredentials: true }
        );
        setConversations(res.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [currentUser, messages]);

  useEffect(() => {
    if (currentUser) {
      const sellerId = currentUser?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [currentUser]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== currentUser?._id
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

    if (!newMessage.trim()) return;

    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser?._id
    );

    socketId.emit("sendMessage", {
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
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: currentUser._id,
    });

    await axios
      .put(`${API}/conversations/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: currentUser._id,
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        imageSendingHandler(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    socketId.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${API}/messages/create-new-message`, {
          images: e,
          sender: currentUser._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
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
        lastMessageId: currentUser._id,
      }
    );
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
            {conversations.map((item, index) => (
              <UserSideMessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={currentUser?._id}
                setSellerData={setSellerData}
                sellerData={sellerData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
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
            handleImageUpload={handleImageUpload}
          />
        )}
      </div>
    </main>
  );
};

export default UserInboxPage;
