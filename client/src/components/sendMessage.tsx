import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartIcon, Send } from "lucide-react";
import { useState } from "react";
import { sendChat, sendNotification } from "./api/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SendMessageProps {
  onSendMessage: () => void;
  parent: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ onSendMessage, parent }) => {
  const { socket, directParticipants, room } = useSelector(
    (state: RootState) => state
  );
  const [message, setMessage] = useState<string>("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") sendMessage(message);
  };

  const sendMessage = (content: string) => {
    if (content !== "" && socket.socket) {
      sendChat({
        socket: socket.socket,
        message: content,
        senderId: directParticipants.sender.id,
        receiverId: directParticipants.receiver.id,
        parent,
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
        message: content,
      });

      setMessage("");
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col">
      {parent && (
        <div className="py-2 px-4 text-sm bg-gradient-to-r from-neutral-800 to-neutral-950 rounded-t-xl">
          <p className="text-muted-foreground font-medium text-[10px]">
            Replying to:
          </p>
          <p className=" ">{parent}</p>
        </div>
      )}
      <div className="flex gap-2 w-full items-center">
        <Input
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={handleKeyPress}
        />
        <HeartIcon
          onClick={() => sendMessage("❤️")}
          className="cursor-pointer hover:text-red-600 duration-500"
        />
        <Button onClick={() => sendMessage(message)}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SendMessage;
