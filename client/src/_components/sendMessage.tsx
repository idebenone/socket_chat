import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

const SendMessage = ({ socket, username, room }: any) => {
  const [message, setMessage] = useState("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") sendMessage();
  };

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      socket.emit("send_message", { message, username, room, __createdtime__ });
      setMessage("");
    }
  };
  return (
    <>
      <div className="flex gap-2 p-2 absolute right-0 bottom-0 w-full">
        <Input
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={sendMessage}>
          <p>Send</p>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default SendMessage;
