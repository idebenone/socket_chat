import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const ChatRoom = ({ socket, setUsername }: any) => {
  const [_username, _setUsername] = useState("");
  const [_room, _setRoom] = useState("");

  const handleusername = () => {
    setUsername(_username);
  };

  useEffect(() => {
    socket.on("chatroom_users", (data: any) => {
      console.log("Chat Room Users", data);
    });
  }, [socket]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Enter your username"
          onChange={(e) => _setUsername(e.target.value)}
        />
        <Input disabled={true} placeholder="Demo" />
        <Button onClick={handleusername}>Join Room</Button>
      </div>
    </>
  );
};

export default ChatRoom;
