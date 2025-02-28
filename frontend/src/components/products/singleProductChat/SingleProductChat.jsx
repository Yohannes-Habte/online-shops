import { AiOutlineMessage } from "react-icons/ai";
import "./SingleProductChat.scss";

const SingleProductChat = ({ handleMessageSubmit }) => {
  return (
    <aside className="single-product-message-wrapper">
      <h4 className="send-message-title">Have Questions?</h4>
      <div className="send-message-container">
        <p className="send-message-paragraph">
          Need help? Click the message icon to chat.
        </p>
        <p onClick={handleMessageSubmit} className="send-message">
          Send a Message <AiOutlineMessage className="send-message-icon" />
        </p>
      </div>
    </aside>
  );
};

export default SingleProductChat;
