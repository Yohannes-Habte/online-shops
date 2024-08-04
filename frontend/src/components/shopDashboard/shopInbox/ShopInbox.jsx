import React from 'react';
import './ShopInbox.scss';
import { AiOutlineSend } from 'react-icons/ai';
import { IoIosAttach } from 'react-icons/io';
import { FaArrowCircleRight } from 'react-icons/fa';
import { format } from 'timeago.js';

const ShopInbox = ({
  scrollRef,
  setOpen,
  textMessage,
  setTextMessage,
  sendTextMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  console.log('userData in the shop info', userData);
  return (
    <div className="shop-inbox-wrapper">
      {/* Message sender header */}
      <article className="message-header-wrapper">
        <figure className="image-container">
          <img src={userData?.image} alt={userData?.name} className="image" />
          <aside className="user-name-and-status">
            <h3 className="user-name"> {userData?.name} </h3>
            <p className="status">
              {activeStatus ? 'Active Now' : 'not-active-status'}
            </p>
          </aside>
        </figure>

        <FaArrowCircleRight
          title="Message Lists"
          className="icon"
          onClick={() => setOpen(false)}
        />
      </article>

      {/* List of Messages */}
      <div className="message-wrapper">
        {messages &&
          messages.map((message) => {
            return (
              <section
                key={message._id}
                className={
                  message.sender === sellerId ? 'justify-end' : 'justify-start'
                }
                ref={scrollRef}
              >
                {message.sender !== sellerId && (
                  <figure className="image-container">
                    <img
                      src={userData?.image}
                      alt={userData?.name}
                      className="image"
                    />
                  </figure>
                )}

                {message?.images && (
                  <img src={message.images} className="image" />
                )}

                {message.textMessage !== '' && (
                  <article className="text-message-wrapper">
                    <div
                      className={
                        message.sender === sellerId ? 'text-bg' : 'passive-bg'
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
      <form className="chat-form" onSubmit={sendTextMessageHandler}>
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
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="input-field"
          />

          <label htmlFor="newMessage" className="input-label">
            <AiOutlineSend
              onClick={sendTextMessageHandler}
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

export default ShopInbox;
