import "./SellerInbox.scss";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { IoIosAttach } from "react-icons/io";
import { format } from "timeago.js";
import { IoCall } from "react-icons/io5";
import { LiaSearchSolid } from "react-icons/lia";
import { IoMdVideocam } from "react-icons/io";

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  messageSenderId,
  sellerData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  console.log("Seller Data:", sellerData);
 
  return (
    <div className="user-inbox-wrapper">
      {/* Message sender header */}
      <article className="message-header-wrapper">
        <div className="user-left-box">
          <figure className="image-container">
            <img
              src={sellerData?.LogoImage}
              alt={sellerData?.name}
              className="image"
            />
          </figure>
          <aside className="user-name-and-status">
            <h3 className="user-name"> {sellerData?.name} </h3>
            <p className="status">
              {activeStatus ? "Active Now" : "not-active-status"}
            </p>
          </aside>

          <AiOutlineArrowRight
            size={20}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
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
                        message.sender === messageSenderId ? "active" : "passive"
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

export default SellerInbox;
