import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = ({ socket, username }: any) => {
  const [messagesReceived, setMessageReceived] = useState<any[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      setMessageReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  return (
    <>
      <ScrollArea className="pe-6 pb-12">
        <div className="flex flex-col gap-4">
          {messagesReceived.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 ${
                msg.username === username ? "items-end" : "items-start"
              }`}
            >
              <p className="text-[10px] font-bold text-muted-foreground">
                {msg.username !== "CHAT_BOT" && msg.username}
              </p>

              {msg.username === "CHAT_BOT" ? (
                <p className="text-[14px] text-muted-foreground text-center w-full">
                  {msg.message} 🤪✨
                </p>
              ) : (
                <p
                  className={`p-2 w-fit rounded-md ${
                    msg.username === username
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-900"
                  }`}
                >
                  {msg.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default Messages;
