import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { setRoom } from "@/store/roomSlice";

import { MessageType } from "@/lib/interfaces";

import { getMessageApi } from "./api/message";
import { endChat, receiveChat, startChat } from "./api/socket";

import Recents from "./recents";
import SendMessage from "./sendMessage";

import { getProfileApi } from "./api/user";
import { ArrowLeft, Info, PhoneCall, VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatProps {
  user: string | undefined;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const { socket, directParticipants } = useSelector(
    (state: RootState) => state
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState<any>({});
  const [messages, setMessages] = useState<MessageType[]>([]);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);

  const handleMessagesApi = async () => {
    await getMessageApi({
      senderId: directParticipants.sender.id,
      receiverId: directParticipants.receiver.id,
    })
      .then((response) => {
        let newRoom = "";
        if (response.status === 200 || response.status === 201) {
          if (response.data.data.length !== 0) {
            setMessages(response.data.data);
            newRoom = response.data.data[0].room;
          } else {
            newRoom = `dm-${directParticipants.sender.id}-${directParticipants.receiver.id}`;
          }
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
    setMessages((state) => [
      ...state,
      {
        message: data.message,
        participants: data.participants,
        room: data.room,
        parent: data.parent,
        created_at: data.created_at,
        modified_at: data.modified_at,
      },
    ]);
  };

  const navigateBack = () => {
    navigate("/");
    if (socket.socket) endChat(socket.socket);
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
      cleanupMessageConnection ? cleanupMessageConnection() : null;
    };
  }, [socket]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
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
            className="p-2 overflow-auto h-[700px] w-full border rounded-md"
            id="chat"
          >
            <div className="flex flex-col gap-2 w-full p-2">
              {messages &&
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.participants[0].user ===
                      directParticipants.sender.id
                        ? `flex justify-end`
                        : `flex justify-start`
                    }
                  >
                    <p
                      className={
                        message.participants[0].user ===
                        directParticipants.sender.id
                          ? `dark:bg-neutral-50 bg-neutral-950 dark:text-neutral-950 text-neutral-50 text-right py-2 px-3 rounded-3xl w-fit text-sm`
                          : `border dark:border-muted border-muted-foreground py-2 px-3 rounded-3xl w-fit text-sm`
                      }
                    >
                      {message.message}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <SendMessage />
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
