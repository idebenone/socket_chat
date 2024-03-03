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
        senderId: directParticipants.sender.id,
        receiverId: directParticipants.receiver.id,
        parent: "",
        room: room.id,
      });
      sendNotification({
        socket: socket.socket,
        receiver: directParticipants.receiver.id,
        sender: directParticipants.sender.id,
        username: directParticipants.sender.username,
        name: directParticipants.sender.name,
        type: "Message",
        description: `${directParticipants.sender.username} sent you a message`,
        message,
      });
      setMessage("");
    }
  };
  return (
    <>
      <div className="flex gap-2 w-full">
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
