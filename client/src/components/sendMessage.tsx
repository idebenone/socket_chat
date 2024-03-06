import { Input } from "@/components/ui/input";
import { HeartIcon, Send, X } from "lucide-react";
import { useState } from "react";
import { sendChat, sendNotification } from "./api/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "./providers/socket-provider";
interface SendMessageProps {
  onSendMessage: () => void;
  parent: string;
  onRemoveParentMessage: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({
  onSendMessage,
  parent,
  onRemoveParentMessage,
}) => {
  const { socket } = useSocket();

  const directParticipants = useSelector(
    (state: RootState) => state.directParticipants
  );
  const room = useSelector((state: RootState) => state.room);
  const [message, setMessage] = useState<string>("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") sendMessage(message);
  };

  const sendMessage = (content: string) => {
    if (content !== "" && socket) {
      sendChat({
        socket,
        message: content,
        senderId: directParticipants.sender.id,
        receiverId: directParticipants.receiver.id,
        parent,
        room: room.id,
      });

      sendNotification({
        socket,
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
        <div className="py-2 px-4 text-sm relative">
          <p className="text-muted-foreground font-medium text-[10px]">
            Replying to:
          </p>
          <p className=" ">{parent}</p>

          <X
            className="h-4 w-4 absolute top-4 right-4 cursor-pointer hover:rotate-90 duration-500"
            onClick={onRemoveParentMessage}
          />
        </div>
      )}
      <div className="flex gap-5 w-full items-center pe-4">
        <Input
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={handleKeyPress}
          className="rounded-3xl"
        />
        <HeartIcon
          onClick={() => sendMessage("❤️")}
          className="h-8 w-8 cursor-pointer hover:text-red-600 duration-500"
        />
        <Send
          onClick={() => sendMessage(message)}
          className="h-7 w-7 cursor-pointer text-blue-500 hover:rotate-45 duration-500"
        />
      </div>
    </div>
  );
};

export default SendMessage;
