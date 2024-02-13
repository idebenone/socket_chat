import ChatRoom from "@/_components/chatRoom";
import Messages from "@/_components/messages";
import SendMessage from "@/_components/sendMessage";
import { useEffect, useState } from "react";

const Home = ({ socket }: any) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  // const [room, setRoom] = useState<string>("DemoRoom");

  useEffect(() => {
    if (username) setConnected(true);
  }, [username]);

  return (
    <>
      <div className="flex gap-2 h-full w-full p-6">
        <div className="w-1/4 p-2">
          <ChatRoom socket={socket} setUsername={setUsername} />
        </div>

        {connected ? (
          <div className="flex flex-col justify-between w-full p-2">
            <Messages socket={socket} />
            <SendMessage socket={socket} username={username} room={"Demo"} />
          </div>
        ) : (
          <div className="h-full w-full flex justify-center items-center bg-zinc-900 rounded-md">
            <p>Please select a room </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
