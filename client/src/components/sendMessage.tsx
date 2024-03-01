import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { sendChat, sendNotification } from "./api/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SendMessage = () => {
  const { socket, directParticipants, room } = useSelector(
    (state: RootState) => state
  );
  const [message, setMessage] = useState<string>("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") sendMessage();
  };

  const sendMessage = () => {
    if (message !== "" && socket.socket) {
      sendChat({
        socket: socket.socket,
        message,
        senderId: directParticipants.senderId,
        receiverId: directParticipants.receiverId,
        parent: "",
        room: room.id,
      });
      sendNotification({
        socket: socket.socket,
        senderId: directParticipants.senderId,
        user: directParticipants.receiverId,
        message: `${directParticipants.senderId} sent you a message`,
        type: "Message",
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
