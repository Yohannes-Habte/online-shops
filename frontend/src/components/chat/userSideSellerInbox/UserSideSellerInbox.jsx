import "./UserSideSellerInbox.scss";
import { AiOutlineSend } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosAttach } from "react-icons/io";
import { format } from "timeago.js";
import { IoCall } from "react-icons/io5";
import { LiaSearchSolid } from "react-icons/lia";
import { IoMdVideocam } from "react-icons/io";
import { useSelector } from "react-redux";

const UserSideSellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  messageSenderId,
  sellerData,
  scrollRef,
  handleImageUpload,
}) => {
  const { currentSeller } = useSelector((state) => state.seller);
  const userStatus = !!currentSeller; // If a user is logged in, they are online.

  return (
    <div className="user-inbox-wrapper">
      {/* Message sender header */}
      <article className="message-header-wrapper">
        <div className="user-left-box">
          <FaArrowLeft
            className="go-back-icon"
            title="Go back to message lists"
            onClick={() => setOpen(false)}
          />
          <figure className="image-container">
            <img
              src={sellerData?.LogoImage}
              alt={sellerData?.name}
              className="image"
            />
          </figure>
          <aside className="user-name-and-status">
            <h3 className="user-name"> {sellerData?.name} </h3>
            <p className="status">{userStatus ? "Online" : "Offline"}</p>
          </aside>
        </div>

        <div className="right-box">
          <IoMdVideocam className="header-icon" />
          <IoCall className="header-icon" />
          <LiaSearchSolid className="header-icon" />
        </div>
      </article>

      {/* List of Messages */}
      <div className="message-wrapper">
        {messages &&
          messages.map((message) => {
            return (
              <section
                key={message._id}
                className={
                  message.sender === messageSenderId
                    ? "justify-end"
                    : "justify-start"
                }
                ref={scrollRef}
              >
                {message?.sender !== messageSenderId && (
                  <figure className="image-container">
                    <img
                      src={sellerData?.LogoImage}
                      alt={sellerData?.name}
                      className="image"
                    />
                  </figure>
                )}

                {/* {message.images && (
                  <figure className="image-container">
                    <img src={`${message?.images}`} className="image" />
                  </figure>
                )} */}

                {message.textMessage !== "" && (
                  <article className="text-message-wrapper">
                    <div
                      className={
                        message.sender === messageSenderId
                          ? "active"
                          : "passive"
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
      <form className="chat-form" onSubmit={sendMessageHandler}>
        <div className="file-container">
          <input
            type="file"
            name="images"
            id="images"
            onChange={handleImageUpload}
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input-field"
          />

          <label htmlFor="newMessage" className="input-label">
            <AiOutlineSend
              onClick={sendMessageHandler}
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

export default UserSideSellerInbox;
