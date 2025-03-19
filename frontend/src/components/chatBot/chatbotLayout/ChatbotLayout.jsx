import { useState } from "react";
import "./ChatbotLayout.scss";
import { FaRobot } from "react-icons/fa";
import ChatBotMessages from "../chatBotMessages/ChatBotMessages";
import ChatBotForm from "../chatBotForm/ChatBotForm";
import { IoMdClose } from "react-icons/io";

const ChatbotLayout = () => {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "How can I help you?",
    },
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="openai-chat-layout-container">
      {isChatOpen ? (
        <div className="chat-bot-icon-wrapper" onClick={toggleChat}>
          {" "}
          <IoMdClose />
        </div>
      ) : (
        <div className="chat-bot-close-icon-wrapper" onClick={toggleChat}>
          <FaRobot />
        </div>
      )}
      {isChatOpen && (
        <div className="chat-bot-messages-and-form-container">
          <div className="chat-bot-messages-display-wrapper">
            <ChatBotMessages messages={messages} />
          </div>

          <div className="chat-bot-form-display-container">
            <ChatBotForm setMessages={setMessages} messages={messages} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotLayout;
