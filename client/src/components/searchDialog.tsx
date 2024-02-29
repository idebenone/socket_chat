import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon, Send } from "lucide-react";

import { searchUserApi } from "./api/user";
import { getUserId } from "./api/auth";

import { User } from "@/lib/interfaces";
import { startConversation } from "@/store/directParticipantsSlice";

interface SearchDialogProps {
  dialogState: boolean;
  setDialogState: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  dialogState,
  setDialogState,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = async (event: React.KeyboardEvent) => {
    if (event.key == "Enter")
      await searchUserApi(searchText)
        .then((response) => {
          console.log(response.data.data);
          if (response.status == 200) {
            setUsers(response.data.data);
          }
        })
        .catch((error) => console.log(error));
  };

  const handleStartMessaging = (data: any) => {
    dispatch(
      startConversation({ senderId: getUserId(), receiverId: data._id })
    );

    navigate(`/${data._id}`);
  };

  return (
    <>
      <Dialog open={dialogState} onOpenChange={setDialogState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
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
