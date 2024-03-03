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

import { getToken, getUserId, removeToken } from "@/components/api/auth";
import { setSocket } from "@/store/socketSlice";
import { RootState } from "@/store/store";
import { NotificationType } from "@/lib/interfaces";
import { getProfileApi } from "@/components/api/user";
import { setUser } from "@/store/userSlice";
import { receiveNotifications } from "@/components/api/socket";

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
    socket.socket?.disconnect();
  };

  const handleNotifications = (data: NotificationType) => {
    toast({
      title: `Message from ${data.name}`,
      description: data.message,
    });
  };

  const handleSocketConnection = () => {
    const socket = io("http://localhost:3001", {
      query: { user: getUserId() },
    });
    dispatch(setSocket({ socket }));
  };

  const handleUserProfile = async () => {
    await getProfileApi(getUserId())
      .then((response) => {
        if (response.status === 200 || response.status === 201)
          dispatch(setUser(response.data.data));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    handleSocketConnection();
    handleUserProfile();
    if (!getToken()) navigate("/login");
  }, []);

  useEffect(() => {
    let cleanupNotificationConnection: () => void;
    if (socket.socket)
      cleanupNotificationConnection = receiveNotifications({
        socket: socket.socket,
        userId: getUserId(),
        onNotificationReceived: handleNotifications,
      });

    return () => {
      cleanupNotificationConnection ? cleanupNotificationConnection() : null;
    };
  }, [socket]);

  return (
    <div className="w-full h-full px-4 md:px-12 lg:px-56 py-4">
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

      <Chat user={user} />

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
