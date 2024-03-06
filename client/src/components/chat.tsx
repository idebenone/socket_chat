import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { leaveRoom, setRoom } from "@/store/roomSlice";

import { MessageType } from "@/lib/interfaces";

import { getMessageApi, likeMessageApi } from "./api/message";
import { endChat, receiveChat, startChat } from "./api/socket";

import Recents from "./recents";
import SendMessage from "./sendMessage";

import { getProfileApi } from "./api/user";
import { ArrowLeft, Info, PhoneCall, VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./providers/socket-provider";
import Message from "./message";
import { leaveConverSation } from "@/store/directParticipantsSlice";

interface ChatProps {
  user: string | undefined;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { directParticipants, room } = useSelector((state: RootState) => state);

  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const isScrolledToBottom = useRef<boolean>(true);

  const [userProfile, setUserProfile] = useState<any>({});
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [parentMessage, setParentMessage] = useState<string>("");

  const handleMessagesApi = async () => {
    await getMessageApi({
      senderId: directParticipants.sender.id,
      receiverId: directParticipants.receiver.id,
    })
      .then((response) => {
        let newRoom = "";

        if (response.data.data.length !== 0) {
          setMessages(response.data.data);
          newRoom = response.data.data[0].room;
        } else {
          newRoom = `dm-${directParticipants.sender.id}-${directParticipants.receiver.id}`;
        }

        if (!room.id) {
          dispatch(setRoom({ id: newRoom }));
          connectToRoom(newRoom);
        }
      })
      .catch((error) => console.log(error));
  };

  const connectToRoom = (room: string) => {
    if (socket)
      startChat({
        socket: socket,
        room,
      });
  };

  const handleUserProfile = async () => {
    await getProfileApi(directParticipants.receiver.id)
      .then((response) => setUserProfile(response.data.data))
      .catch(() => navigate("/", { replace: true }));
  };

  const handleSocketMessage = (data: MessageType) => {
    setMessages((state) => [...state, { ...data }]);
  };

  const navigateBack = () => {
    navigate("/", { replace: true });
    if (socket) endChat(socket);
    dispatch(leaveRoom());
    dispatch(leaveConverSation());
    setParentMessage("");
  };

  const handleLikeMessage = async (id: string) => {
    try {
      await likeMessageApi(id);
      const updatedMessage = messages.map((message) => {
        if (message._id == id) return { ...message, ["liked"]: true };
        return message;
      });
      setMessages(updatedMessage);
      if (chatAreaRef.current)
        isScrolledToBottom.current =
          chatAreaRef.current?.scrollHeight - chatAreaRef.current?.scrollTop ===
          chatAreaRef.current?.clientHeight;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      isScrolledToBottom.current = true;
    }
    setParentMessage("");
  };

  const handleParentMessage = (message: string) => {
    setParentMessage(message);
  };

  useEffect(() => {
    if (user) {
      handleMessagesApi();
      handleUserProfile();
    }
  }, [directParticipants]);

  useEffect(() => {
    let cleanupMessageConnection: () => void;
    if (socket)
      cleanupMessageConnection = receiveChat({
        socket: socket,
        onMessageReceived: handleSocketMessage,
      });

    return () => {
      cleanupMessageConnection && cleanupMessageConnection();
    };
  }, [socket]);

  useEffect(() => {
    if (chatAreaRef.current && isScrolledToBottom.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      isScrolledToBottom.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      {user ? (
        <>
          <div className="p-2 w-full z-10 backdrop-blur-sm border rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <ArrowLeft
                  className="h-4 w-4 cursor-pointer"
                  onClick={navigateBack}
                />
                <div className="flex gap-4 items-center">
                  <img
                    src={userProfile.profile_img}
                    alt={userProfile.username}
                    height="40"
                    width="40"
                    className="border border-muted rounded-full"
                  />
                  <div>
                    <p className="text-sm">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="rounded-md p-2 cursor-pointer hover:text-green-500 duration-500">
                  <PhoneCall className="h-4 w-4" />
                </span>

                <span className="rounded-md p-2 cursor-pointer hover:text-green-500 duration-500">
                  <VideoIcon className="h-4 w-4" />
                </span>

                <span className="rounded-md p-2 cursor-pointer hover:text-green-500 duration-500">
                  <Info className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <div
            ref={chatAreaRef}
            className="p-2 overflow-auto h-[650px] w-full border rounded-md"
            id="chat"
          >
            <div className="flex flex-col gap-2 w-full p-2">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  message={message}
                  onDoubleClick={handleLikeMessage}
                  isSender={
                    message.participants[0].user ===
                    directParticipants.sender.id
                  }
                  handleParentMessage={handleParentMessage}
                />
              ))}
            </div>
          </div>

          <SendMessage
            onSendMessage={handleSendMessage}
            parent={parentMessage}
            onRemoveParentMessage={() => setParentMessage("")}
          />
        </>
      ) : (
        <div className="w-full h-full flex">
          <div className="w-full md:w-1/2 lg:w-1/4 h-full">
            <Recents />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
