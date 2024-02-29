import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { sendChat } from "./api/socket";
import { getUserId } from "./api/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SendMessageProps {
  user: string | "";
}

const SendMessage: React.FC<SendMessageProps> = ({ user }) => {
  const store = useSelector((state: RootState) => state);
  const [message, setMessage] = useState<string>("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") sendMessage();
  };

  const sendMessage = () => {
    if (message !== "" && store.socket.socket) {
      sendChat({
        socket: store.socket.socket,
        message,
        senderId: getUserId(),
        receiverId: user,
        parent: "",
        room: store.room.id,
      });
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
        <Button onClick={sendMessage} className="flex gap-2">
          <p>Send</p>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default SendMessage;
