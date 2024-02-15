import { UserType } from "@/components/interfaces";
import { Button } from "@/components/ui/button";
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
          <p className="capitalize text-lg font-semibold">Participants</p>
          {users.map((user, i) => (
            <div key={i}>
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
