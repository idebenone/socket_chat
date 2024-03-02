import { useEffect, useState } from "react";
import { getRecentApi } from "./api/message";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { startConversation } from "@/store/directParticipantsSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";

const Recents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state);
  const [recents, setRecents] = useState<any[]>([]);

  const handleRecentsApi = async () => {
    await getRecentApi()
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          setRecents(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleStartMessaging = (data: any) => {
    dispatch(
      startConversation({
        sender: { id: user._id, name: user.name, username: user.username },
        receiver: {
          id: data.user._id,
          name: data.user.name,
          username: data.user.username,
        },
      })
    );

    navigate(`/${data.user._id}`);
  };

  useEffect(() => {
    handleRecentsApi();
  }, []);

  return (
    <div className="dark:bg-neutral-950 bg-neutral-100 p-4 rounded-sm h-full">
      <Input placeholder="Search" className="mb-2" />
      <div className="flex flex-col gap-2">
        {recents.map((recent, index) => (
          <div
            className="p-4 cursor-pointer bg-neutral-900 hover:bg-neutral-800 duration-500 rounded-lg"
            key={index}
            onClick={() => handleStartMessaging(recent)}
          >
            <p className="font-bold">{recent.user.name}</p>
            <p className="text-muted-foreground">{recent.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;
