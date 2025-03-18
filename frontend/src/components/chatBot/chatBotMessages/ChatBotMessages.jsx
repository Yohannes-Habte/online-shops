import { useEffect, useRef } from "react";
import "./ChatBotMessages.scss";
import ChatBotMessageCart from "../chatBotMessageCart/ChatBotMessageCart";

const ChatBotMessages = ({ messages }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scrolling to the bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-bot-messages-container">
      {messages
        ?.filter((message) => message.role !== "system")
        .map((message) => {
          return <ChatBotMessageCart key={message.id} message={message} />;
        })}
      <div ref={chatEndRef} /> {/* This div is used to scroll to the bottom */}
    </div>
  );
};

export default ChatBotMessages;
