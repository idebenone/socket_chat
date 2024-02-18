import { MessageType } from "@/lib/interfaces";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageProps {
  username: string | undefined;
  messagesReceived: MessageType[];
}

const Messages: React.FC<MessageProps> = ({ username, messagesReceived }) => {
  return (
    <>
      <ScrollArea className="pe-6 pb-12">
        <div className="flex flex-col gap-4">
          {messagesReceived.map((msg: any, i: any) => (
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
