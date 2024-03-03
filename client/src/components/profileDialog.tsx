import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi, profileImageApi } from "./api/user";
import { useToast } from "./ui/use-toast";
import { setUser } from "@/store/userSlice";

interface ProfileDialogProps {
  dialogState: boolean;
  setDialogState: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  dialogState,
  setDialogState,
}) => {
  const { user } = useSelector((state: RootState) => state);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleUserProfile = async () => {
    await getProfileApi(user._id)
      .then((response) => {
        if (response.status === 200 || response.status === 201)
          dispatch(setUser(response.data.data));
      })
      .catch((error) => console.log(error));
  };

  const handleFileSelect = (e: any) => {
    console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) handleProfileImageApi(file);
  };

  const handleProfileImageApi = async (image: any) => {
    const formData = new FormData();
    formData.append("file", image, "profile.jpg");
    await profileImageApi(formData as any)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          toast({
            title: "Success",
            description: "Image has been updated successfully",
          });
          handleUserProfile();
        }
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to updated image",
        })
      );
  };
  return (
    <>
      <Dialog open={dialogState} onOpenChange={setDialogState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Profile</DialogTitle>
          </DialogHeader>

          <div className="w-full h-full flex gap-8 items-center">
            <div className="h-full">
              <label htmlFor="file" className="cursor-pointer">
                <img
                  src={user.profile_img}
                  alt="Profile Image"
                  height="200"
                  width="200"
                  className="border border-muted rounded-full object-fit"
                />
              </label>
              <input
                type="file"
                className="hidden"
                id="file"
                onChange={handleFileSelect}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <p className="text-lg">{user.name}</p>
              <p className="text-muted-foreground">{user.username}</p>

              <div className="flex gap-2">
                <span>
                  <p className="font-medium text-muted-foreground">Followers</p>
                  <p>{user.followers_count}</p>
                </span>

                <span>
                  <p className="font-medium text-muted-foreground">Following</p>
                  <p>{user.following_count}</p>
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDialog;
