import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon, Send } from "lucide-react";

import { searchUserApi } from "./api/user";

import { User } from "@/lib/interfaces";
import { startConversation } from "@/store/directParticipantsSlice";
import { RootState } from "@/store/store";

interface SearchDialogProps {
  dialogState: boolean;
  setDialogState: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  dialogState,
  setDialogState,
}) => {
  const { user } = useSelector((state: RootState) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = async (event: React.KeyboardEvent) => {
    if (event.key == "Enter")
      await searchUserApi(searchText)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setUsers(response.data.data);
          }
        })
        .catch((error) => console.log(error));
  };

  const handleStartMessaging = (data: any) => {
    dispatch(
      startConversation({
        sender: { id: user._id, name: user.name, username: user.username },
        receiver: { id: data._id, name: data.name, username: data.username },
      })
    );

    navigate(`/${data._id}`);
  };

  return (
    <>
      <Dialog open={dialogState} onOpenChange={setDialogState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search your enemies and friends</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search user"
            onKeyDown={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {users.map((val, key) => (
            <div key={key} className="flex justify-between items-center">
              <p>{val.username}</p>

              <div className="flex gap-2">
                <Button className="flex gap-4">
                  <p>Follow</p>
                  <PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  className="flex gap-4"
                  variant={"secondary"}
                  onClick={() => handleStartMessaging(val)}
                >
                  <p>Message</p>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchDialog;
