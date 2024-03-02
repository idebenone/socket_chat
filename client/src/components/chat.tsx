import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { setRoom } from "@/store/roomSlice";

import { MessageType } from "@/lib/interfaces";

import { getMessageApi } from "./api/message";
import { startChat } from "./api/socket";

import Recents from "./recents";
import SendMessage from "./sendMessage";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getProfileApi } from "./api/user";
import { Info, PhoneCall, VideoIcon } from "lucide-react";

interface ChatProps {
  user: string | undefined;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const { socket, directParticipants } = useSelector(
    (state: RootState) => state
  );

  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState<any>({});
  const [messages, setMessages] = useState<MessageType[]>([]);

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
    if (user)
      await getProfileApi(user)
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

  useEffect(() => {
    if (user) {
      handleMessagesApi();
      handleUserProfile();
    }
  }, [directParticipants]);

  useEffect(() => {
    if (socket.socket) socket.socket.on("receive_chat", handleSocketMessage);
    return () => {
      if (socket.socket) socket.socket.off("receive_chat", handleSocketMessage);
    };
  }, [socket]);

  return (
    <div className="flex gap-6 h-[700px]">
      {/* <div className="w-1/4 h-full">
        <Recents />
      </div> */}

      <div className="w-full p-4 rounded-sm dark:bg-neutral-950 bg-neutral-100 relative">
        <div className="absolute top-0 left-0 border-b border-muted p-2 w-full z-10 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground">
                {userProfile.username}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="border rounded-md p-2 cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-950 bg-neutral-50">
                <PhoneCall className="h-4 w-4" />
              </span>

              <span className="border rounded-md p-2 cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-950 bg-neutral-50">
                <VideoIcon className="h-4 w-4" />
              </span>

              <span className="border rounded-md p-2 cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-100 dark:bg-neutral-950 bg-neutral-50">
                <Info className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
        {user ? (
          <>
            <ScrollArea className="h-[630px] w-full pe-4 pt-10">
              <div className="flex flex-col gap-2 w-full">
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
                            ? `bg-blue-500 text-right py-2 px-3 rounded-3xl w-fit text-sm`
                            : `bg-neutral-800 py-2 px-3 rounded-3xl w-fit text-sm`
                        }
                      >
                        {message.message}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <SendMessage />
          </>
        ) : (
          <p className="text-center font-bold">
            Let's start yapping about something
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
