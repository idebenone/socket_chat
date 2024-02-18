import Messages from "@/_components/messages";
import Participants from "@/_components/participants";
import SendMessage from "@/_components/sendMessage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { MessageType } from "@/lib/interfaces";
import { Separator } from "@/components/ui/separator";

interface ChatProps {
  socket: Socket;
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  let { username } = useParams();
  const [messagesReceived, setMessageReceived] = useState<MessageType[]>([]);

  useEffect(() => {
    const handleReceiveMessage = (data: MessageType) => {
      setMessageReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  return (
    <>
      <div className="h-full w-full lg:p-16 p-4">
        <div className="flex gap-2 h-full">
          <div className="w-1/4 p-2">
            <Participants socket={socket} username={username} />
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col justify-between w-full p-2 relative">
            <Messages username={username} messagesReceived={messagesReceived} />
            <SendMessage socket={socket} username={username} room={"Demo"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
