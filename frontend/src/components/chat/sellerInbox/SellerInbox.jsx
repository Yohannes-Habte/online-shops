import React from 'react';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';
import { TfiGallery } from 'react-icons/tfi';

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="seller-message-wrapper">
      {/* message header */}
      <article className="message-header">
        <figure className="image-container">
          <img src={`${userData?.avatar?.url}`} alt="" className="image" />
          <h1>{activeStatus ? 'Active Now' : ''}</h1>
        </figure>
        <h2 className="subTitle">{userData?.name}</h2>
        <AiOutlineArrowRight
          className="message-icon"
          onClick={() => setOpen(false)}
        />
      </article>

      {/* messages */}
      <div className="messages-wrapper">
        {messages &&
          messages.map((item, index) => (
            <div
              className={` ${
                item.sender === sellerId ? 'justify-end' : 'justify-start'
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={`${userData?.avatar?.url}`}
                  className="image"
                  alt=""
                />
              )}
              {item.images && (
                <img src={`${item.images?.url}`} className="images" />
              )}
              {item.text !== '' && (
                <div>
                  <div
                    className={` ${
                      item.sender === sellerId ? 'active' : 'passive'
                    } `}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="createdAt">{/* {format(item.createdAt)} */}</p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="message-icon" />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input-field"
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default SellerInbox;
