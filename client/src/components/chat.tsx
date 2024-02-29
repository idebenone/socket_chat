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

interface ChatProps {
  user: string | undefined;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const store = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handleMessages = async () => {
    await getMessageApi({
      senderId: store.directParticipants.senderId,
      receiverId: store.directParticipants.receiverId,
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        setMessages(response.data.data);
      }
      console.log(response.data.data);
      let room = response.data.data[0].room
        ? response.data.data[0].room
        : `dm-${store.directParticipants.senderId}-${store.directParticipants.receiverId}`;
      dispatch(setRoom({ id: room }));

      if (store.socket.socket)
        startChat({
          socket: store.socket.socket,
          room,
        });
    });
  };

  useEffect(() => {
    if (user) {
      handleMessages();
    }
  }, [store.directParticipants]);

  useEffect(() => {
    const handleReceiveMessage = (data: MessageType) => {
      console.log(data);
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
    if (store.socket.socket)
      store.socket.socket.on("receive_chat", handleReceiveMessage);
    return () => {
      if (store.socket.socket)
        store.socket.socket.off("receive_chat", handleReceiveMessage);
    };
  }, [store.socket]);

  return (
    <div className="flex gap-6 h-[700px]">
      <div className="w-1/4 h-full">
        <Recents />
      </div>

      <div className="w-full p-4 rounded-sm dark:bg-neutral-950 bg-neutral-100 relative">
        {user ? (
          <>
            <ScrollArea className="h-[620px] w-full pe-4">
              <div className="flex flex-col gap-2 w-full">
                {messages &&
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={
                        message.participants[0].user ===
                        store.directParticipants.senderId
                          ? `flex justify-end`
                          : `flex justify-start`
                      }
                    >
                      <p
                        className={
                          message.participants[0].user ===
                          store.directParticipants.senderId
                            ? `bg-blue-500 text-right py-2 px-4 rounded-sm w-fit`
                            : `bg-neutral-800 py-2 px-4 rounded-sm w-fit`
                        }
                      >
                        {message.message}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <SendMessage user={user} />
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
