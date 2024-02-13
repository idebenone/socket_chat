import { useEffect, useState } from "react";

const Messages = ({ socket }: any) => {
  const [messagesReceived, setMessageReceived] = useState<any[]>([]);

  useEffect(() => {
    console.log("triggered");
    socket.on("receive_message", (data: any) => {
      console.log("Recieve Messages", data);
      setMessageReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // return () => socket.off("receive_message");
  }, [socket]);

  return (
    <>
      {messagesReceived.length != 0 ? (
        messagesReceived.map((msg, i) => (
          <div key={i}>
            {msg.message}
            {msg.username}
          </div>
        ))
      ) : (
        <div className="flex w-full h-full text-center">No Messages Found</div>
      )}
    </>
  );
};

export default Messages;
