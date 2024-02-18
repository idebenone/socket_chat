import { UserType } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBeforeUnload } from "react-use";
import { Socket } from "socket.io-client";

interface ParticipantsProps {
  socket: Socket;
  username: string | undefined;
}

const Participants: React.FC<ParticipantsProps> = ({ socket, username }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);

  const handleLeaveRoom = () => {
    socket.emit("leave_room", { username: username, room: "Demo" });
    localStorage.removeItem("session");
    navigate("/", { replace: true });
  };

  useBeforeUnload(() => {
    handleLeaveRoom();
    return false;
  }, "You're leaving the page, you sure about that?");

  useEffect(() => {
    const handleChatRoomUsers = (data: UserType[]) => {
      setUsers(data);
    };
    socket.on("chatroom_users", handleChatRoomUsers);
    return () => {
      socket.off("chatroom_users");
    };
  }, [socket]);

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="capitalize text-lg font-semibold mb-2 text-muted-foreground">
            Participants
          </p>
          {users.map((user, i) => (
            <div key={i} className="flex gap-3 items-center">
              <p className="h-2 w-2 bg-green-500 rounded"></p>
              <p className="mb-1">{user.username}</p>
            </div>
          ))}
        </div>
        <Button onClick={handleLeaveRoom} className="flex gap-2">
          <p>Leave Room</p>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default Participants;
