import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

import { LogOut, Search } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

import { ModeToggle } from "@/components/mode-toggle";
import ProfileDialog from "@/components/profileDialog";
import SearchDialog from "@/components/searchDialog";
import Chat from "@/components/chat";

import { getUserId, removeToken } from "@/components/api/auth";
import { setSocket } from "@/store/socketSlice";
import { RootState } from "@/store/store";
import { NotificationType } from "@/lib/interfaces";

const Home = () => {
  const { socket } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useParams();
  const { toast } = useToast();

  const [profileDialogState, setProfileDialogState] = useState<boolean>(false);
  const [searchDialogState, setSearchDialogState] = useState<boolean>(false);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      query: { user: getUserId() },
    });
    dispatch(setSocket({ socket }));
  }, []);

  useEffect(() => {
    const handleReceiveNotifications = (data: NotificationType) => {
      console.log(data);
      toast({
        title: "Message",
        description: data.message,
      });
    };

    if (socket.socket)
      socket.socket.on(
        `receive-notifications-${getUserId()}`,
        handleReceiveNotifications
      );

    return () => {
      if (socket.socket)
        socket.socket.off(
          `receive-notifications-${getUserId()}`,
          handleReceiveNotifications
        );
    };
  }, [socket]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-between items-center">
        <span
          className="border rounded-md p-2 cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-950 bg-neutral-50"
          onClick={() => setSearchDialogState(true)}
        >
          <Search className="h-4 w-4" />
        </span>

        <div className="flex gap-2 items-center">
          <ModeToggle />
          <span
            className="border rounded-md p-2 cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-950 bg-neutral-50"
            onClick={() => setProfileDialogState(true)}
          >
            <PersonIcon className="h-4 w-4" />
          </span>
          <span
            className="border rounded-md p-2 cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-950 bg-neutral-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="mt-4 h-full">
        <Chat user={user} />
      </div>

      <ProfileDialog
        dialogState={profileDialogState}
        setDialogState={() => setProfileDialogState(false)}
      />
      <SearchDialog
        dialogState={searchDialogState}
        setDialogState={() => setSearchDialogState(false)}
      />
    </div>
  );
};

export default Home;
