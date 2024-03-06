import { MessageType } from "@/lib/interfaces";
import { HeartFilledIcon } from "@radix-ui/react-icons";

interface MessageProps {
  message: MessageType;
  onDoubleClick: (id: string) => void;
  isSender: boolean;
  handleParentMessage: (message: string) => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  onDoubleClick,
  isSender,
  handleParentMessage,
}) => {
  const isEmoji = (character: string): boolean => {
    const emojiRegex = /\p{Emoji}/u;
    return emojiRegex.test(character);
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      {isEmoji(message.message) ? (
        <p
          className="px-2 text-3xl"
          onClick={() => handleParentMessage(message.message)}
        >
          {message.message}
        </p>
      ) : (
        <div className="flex gap-2 items-center">
          {isSender && message.liked && (
            <span>
              <HeartFilledIcon className="text-red-600" />
            </span>
          )}
          <div>
            {message.parent ? (
              <div className="flex flex-col gap-2 mt-3">
                <p
                  className={
                    isSender
                      ? `text-muted-foreground text-sm text-right mt-2 px-3`
                      : `text-muted-foreground text-sm text-left mt-2 px-3`
                  }
                >
                  {message.parent}
                </p>
                <p
                  className={
                    isSender
                      ? `dark:bg-neutral-50 bg-neutral-800 dark:text-neutral-800 text-neutral-50 text-right py-2 px-6 rounded-3xl w-fit text-sm`
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
                    ? `dark:bg-neutral-50 bg-neutral-800 dark:text-neutral-800 text-neutral-50 text-right py-2 px-6 rounded-3xl w-fit text-sm`
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

export default Message;
