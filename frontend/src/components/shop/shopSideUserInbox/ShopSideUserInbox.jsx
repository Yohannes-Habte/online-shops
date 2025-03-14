import "./ShopSideUserInbox.scss";
import { AiOutlineSend } from "react-icons/ai";
import { IoIosAttach } from "react-icons/io";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { format } from "timeago.js";

const ShopSideUserInbox = ({
  setIsChatBoxOpen,
  typedMessage,
  setTypedMessage,
  handleSendMessage,
  chatMessages,
  userId,
  activeChatUser,
  isUserOnline,
  scrollRef,
}) => {
  console.log("chatMessages", chatMessages);
  return (
    <div className="shop-inbox-wrapper">
      {/* Message sender header, which is the user*/}
      <article className="message-header-wrapper">
        <figure className="image-container">
          <img
            src={activeChatUser?.image}
            alt={activeChatUser?.name}
            className="image"
          />
          <aside className="user-name-and-status-wrapper">
            <h3 className="user-name"> {activeChatUser?.name} </h3>
            <p className="user-online-status">
              {isUserOnline ? "Online" : "Offline"}
            </p>
          </aside>
        </figure>

        <FaArrowAltCircleLeft
          className="shop-go-back-icon"
          title="Shop Message Lists"
          onClick={() => setIsChatBoxOpen(false)}
        />
      </article>

      {/* List of Messages */}
      <div className="message-wrapper">
        {chatMessages &&
          chatMessages.map((message) => {
            return (
              <section
                key={message._id}
                className={
                  message.sender === userId ? "justify-end" : "justify-start"
                }
                ref={scrollRef}
              >
                {message.sender !== userId && (
                  <figure className="image-container">
                    <img
                      src={activeChatUser?.image}
                      alt={activeChatUser?.name}
                      className="image"
                    />
                  </figure>
                )}

                {message?.images && (
                  <img src={message.images} className="image" />
                )}

                {message.textMessage !== "" && (
                  <article className="text-message-wrapper">
                    <div
                      className={
                        message.sender === userId ? "text-bg" : "passive-bg"
                      }
                    />
                    <h5 className="createdAt">{format(message.createdAt)}</h5>
                    <p className="text">{message.textMessage}</p>
                  </article>
                )}
              </section>
            );
          })}
      </div>

      {/* Sending message form */}
      <form className="chat-form" onSubmit={handleSendMessage}>
        <div className="file-container">
          <input
            type="file"
            name="images"
            id="images"
            className="upload-image"
          />
          <label htmlFor="images" className="file-label">
            <IoIosAttach title="Upload Images" className="icon" />
          </label>
          <span className="input-highlight"></span>
        </div>

        <div className="input-container">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            className="input-field"
          />
          <label htmlFor="newMessage" className="input-label">
            <AiOutlineSend
              onClick={handleSendMessage}
              title="Send message"
              className="icon"
            />
          </label>
          <span className="input-highlight"></span>
        </div>
      </form>
    </div>
  );
};

export default ShopSideUserInbox;
