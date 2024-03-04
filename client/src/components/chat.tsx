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
import { HeartFilledIcon } from "@radix-ui/react-icons";

interface ChatProps {
  user: string | undefined;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const { socket, directParticipants, room } = useSelector(
    (state: RootState) => state
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState<any>({});
  const [messages, setMessages] = useState<MessageType[]>([]);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const isScrolledToBottom = useRef<boolean>(true);
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
    if (socket.socket)
      startChat({
        socket: socket.socket,
        room,
      });
  };

  const handleUserProfile = async () => {
    await getProfileApi(directParticipants.receiver.id)
      .then((response) => setUserProfile(response.data.data))
      .catch((error) => console.log(error));
  };

  const handleSocketMessage = (data: MessageType) => {
    setMessages((state) => [...state, { ...data }]);
  };

  const navigateBack = () => {
    navigate("/");
    if (socket.socket) endChat(socket.socket);
    dispatch(leaveRoom());
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
    if (socket.socket)
      cleanupMessageConnection = receiveChat({
        socket: socket.socket,
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
              {messages.map((message) => (
                <MessageItem
                  key={message._id}
                  message={message}
                  onDoubleClick={handleLikeMessage}
                  isSender={
                    message.participants[0].user ===
                    directParticipants.sender.id
                  }
                  profile_img={userProfile.profile_img}
                  handleParentMessage={handleParentMessage}
                />
              ))}
            </div>
          </div>

          <SendMessage
            onSendMessage={handleSendMessage}
            parent={parentMessage}
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

const MessageItem: React.FC<{
  message: MessageType;
  onDoubleClick: (id: string) => void;
  isSender: boolean;
  profile_img: string;
  handleParentMessage: (message: string) => void;
}> = ({
  message,
  onDoubleClick,
  isSender,
  profile_img,
  handleParentMessage,
}) => {
  const isEmoji = (character: string): boolean => {
    const emojiRegex = /\p{Emoji}/u;
    return emojiRegex.test(character);
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      {isEmoji(message.message) ? (
        <div className="flex gap-2 items-center">
          {/* {!isSender && (
            <div>
              <img
                src={profile_img}
                height="40"
                width="40"
                className="rounded-full border border-muted"
              />
            </div>
          )} */}

          <p className="px-2"> {message.message}</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          {isSender && message.liked && (
            <span>
              <HeartFilledIcon className="text-red-600" />
            </span>
          )}
          {/* 
          {!isSender && (
            <div>
              <img
                src={profile_img}
                height="40"
                width="40"
                className="rounded-full border border-muted"
              />
            </div>
          )} */}

          <div>
            {message.parent ? (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm text-right mt-2 px-3">
                  {message.parent}
                </p>
                <p
                  className={
                    isSender
                      ? `dark:bg-neutral-50 bg-neutral-950 dark:text-neutral-950 text-neutral-50 text-right py-2 px-6 rounded-3xl w-fit text-sm`
                      : `border dark:border-muted border-muted-foreground py-2 px-6 rounded-3xl w-fit text-sm`
                  }
                  onClick={() => handleParentMessage(message.message)}
                  onDoubleClick={() => onDoubleClick(message._id)}
                >
                  {message.message}
                </p>
              </div>
            ) : (
              <p
                className={
                  isSender
                    ? `dark:bg-neutral-50 bg-neutral-950 dark:text-neutral-950 text-neutral-50 text-right py-2 px-6 rounded-3xl w-fit text-sm`
                    : `border dark:border-muted border-muted-foreground py-2 px-6 rounded-3xl w-fit text-sm`
                }
                onClick={() => handleParentMessage(message.message)}
                onDoubleClick={() => onDoubleClick(message._id)}
              >
                {message.message}
              </p>
            )}
          </div>

          {!isSender && message.liked && (
            <span>
              <HeartFilledIcon className="text-red-600" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default Chat;
