import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MoveUpRight } from "lucide-react";

const Home = ({ socket }: any) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") connectToRoom();
  };

  const connectToRoom = () => {
    socket.emit("join_room", { username: username, room: "Demo" });
    navigate(`/chat/${username}`);
  };

  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Input disabled={true} placeholder="Demo" />
          <Button onClick={connectToRoom} className="flex gap-2">
            <p>Start Chatting</p>
            <MoveUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
