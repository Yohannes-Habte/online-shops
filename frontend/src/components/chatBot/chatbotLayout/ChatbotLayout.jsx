import { useState } from "react";
import "./ChatbotLayout.scss";
import { FaRobot } from "react-icons/fa";
import ChatBotForm from "../chatBotFrom/ChatBotForm";
import ChatBotMessages from "../chatBotMessages/ChatBotMessages";


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
        <div className="chat-bot-container">
          <div className="chat-bot-icon-wrapper">
            <button className="robot-chat-btn" onClick={toggleChat}>
              <FaRobot className="robot-chat-btn-icon" />
            </button>
          </div>
    
          {isChatOpen && (
            <div className="messages-and-form-wrapper">
              <ChatBotMessages messages={messages} />
    
              <ChatBotForm setMessages={setMessages} messages={messages} />
            </div>
          )}
        </div>
      );
    };

export default ChatbotLayout
