import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileDialogProps {
  dialogState: boolean;
  setDialogState: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  dialogState,
  setDialogState,
}) => {
  return (
    <>
      <Dialog open={dialogState} onOpenChange={setDialogState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Profile</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDialog;
