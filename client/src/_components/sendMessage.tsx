import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SendMessage = ({ socket, username, room }: any) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      socket.emit("send_message", { message, username, room, __createdtime__ });
      setMessage("");
    }
  };
  return (
    <>
      <div className="flex gap-2 p-2">
        <Input
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </>
  );
};

export default SendMessage;
