import { useState } from "react";
import "./ChatBotForm.scss";
import { FaPaperPlane } from "react-icons/fa";
import { API } from "../../../utils/security/secreteKey";

const ChatBotForm = ({ setMessages, messages }) => {
  const [{ stream, message }, setState] = useState({
    stream: true,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input change
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, newMessage]);

    const response = await fetch(`${API}/openai/chat/completions`, {
      method: "POST",
      headers: {
        provider: "open-ai",
        // mode: "production",
        mode: "mock", // Make sure we use the mock API in development
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [...messages, newMessage],
        stream,
      }),
    });

    setState({ stream, message: "" });

    if (stream) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let result;
      const messageId = crypto.randomUUID();
      while (!(result = await reader.read()).done) {
        const chunk = decoder.decode(result.value, { stream: true });
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data:")) {
            const jsonStr = line.replace("data:", "").trim();
            try {
              const data = JSON.parse(jsonStr);
              const content = data.choices[0]?.delta?.content;
              if (content) {
                setMessages((prev) => {
                  const found = prev.find((m) => m.id === messageId);

                  if (found) {
                    return prev.map((m) =>
                      m.id === messageId
                        ? { ...m, content: `${m.content}${content}` }
                        : m
                    );
                  }

                  return [
                    ...prev,
                    { role: "assistant", content, id: messageId },
                  ];
                });
              }
            } catch (error) {
              console.error("Failed to parse JSON:", error);
            }
          }
        });
      }
    } else {
      const { message: newMessage } = await response.json();
      setMessages((prev) => [
        ...prev,
        { ...newMessage, id: crypto.randomUUID() },
      ]);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} action="" className="chat-bot-form">
      <textarea
        name="message"
        placeholder="Type a message..."
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Listen for Enter key
        value={message}
        className="cht-bot-input"
        style={{ resize: "none", maxHeight: "50px" }}
      ></textarea>
      <button type="submit" className="cht-bot-btn">
        <FaPaperPlane className="cht-bot-btn-icon" />
      </button>
    </form>
  );
};

export default ChatBotForm;
