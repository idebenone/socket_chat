import Messages from "@/_components/messages";
import Participants from "@/_components/participants";
import SendMessage from "@/_components/sendMessage";
import { useParams } from "react-router-dom";

const Chat = ({ socket }: any) => {
  let { username } = useParams();
  return (
    <>
      <div className="h-full w-full">
        <div className="flex gap-2 h-full">
          <div className="w-1/4 p-2">
            <Participants socket={socket} username={username} />
          </div>
          <div className="flex flex-col justify-between w-full p-2 relative">
            <Messages socket={socket} username={username} />
            <SendMessage socket={socket} username={username} room={"Demo"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
