import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

import { LogOut, Search } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

import { ModeToggle } from "@/components/mode-toggle";
import ProfileDialog from "@/components/profileDialog";
import SearchDialog from "@/components/searchDialog";
import Chat from "@/components/chat";

import { getToken, getUserId, removeToken } from "@/components/api/auth";
import { NotificationType } from "@/lib/interfaces";
import { getProfileApi } from "@/components/api/user";
import { setUser } from "@/store/userSlice";
import { receiveNotifications } from "@/components/api/socket";
import { useSocket } from "@/components/providers/socket-provider";

const Home = () => {
  const { socket, setSocket } = useSocket();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useParams();
  const { toast } = useToast();

  const [profileDialogState, setProfileDialogState] = useState<boolean>(false);
  const [searchDialogState, setSearchDialogState] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    socket?.disconnect();
  };

  const handleSocketNotifications = (data: NotificationType) => {
    console.log(data.sender, user);
    if (user !== data.sender)
      toast({
        title: `Message from ${data.name}`,
        description: data.message,
      });
  };

  const handleSocketConnection = () => {
    const socket = io("http://localhost:3001", {
      query: { user: getUserId() },
    });
    setSocket(socket);
  };

  const handleUserProfile = async () => {
    await getProfileApi(getUserId())
      .then((response) => {
        if (response.status === 200 || response.status === 201)
          dispatch(setUser(response.data.data));
      })
      .catch((error) => console.log(error));
  };

  // const handleVisibilityChange = () => {
  //   setIsVisible(!document.hidden);
  //   alert("hi");
  // };

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    } else {
      handleUserProfile();
      handleSocketConnection();
      // document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    // return () => {
    //   document.removeEventListener("visibilitychange", handleVisibilityChange);
    // };
  }, []);

  useEffect(() => {
    let cleanupNotificationConnection: () => void;
    if (socket)
      cleanupNotificationConnection = receiveNotifications({
        socket,
        userId: getUserId(),
        onNotificationReceived: handleSocketNotifications,
      });

    return () => {
      cleanupNotificationConnection ? cleanupNotificationConnection() : null;
    };
  }, [socket, user]);

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
