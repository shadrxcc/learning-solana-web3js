import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "./alert-dialog";
import { Button } from "./button";
import Solana from "./solana";

const ConfirmTransfer = ({
  amount,
  to,
  from,
  loading,
  onSubmit,
}: {
  amount: number;
  to: string;
  from: string;
  onSubmit: () => void;
  loading: boolean;
}) => {
  return (
    <AlertDialogContent className="bg-black flex flex-col gap-y-5 rounded-md outline-none max-w-[90%] sm:max-w-lg">
      <div className="mx-auto">
        <Solana />
      </div>

      <div className="flex flex-col gap-y-5">
        <h1 className="font-black text-center text-white text-4xl">
          {amount} SOL
        </h1>

        <div>
          <div className="flex items-center text-sm text-teal-50 gap-x-6 justify-between">
            <p>from:</p>
            <p className="truncate">{from}</p>
          </div>

          <div className="flex items-center text-teal-50 gap-x-6 text-sm justify-between">
            <p>to:</p>
            <p className="truncate">{to}</p>
          </div>
        </div>
      </div>

      <AlertDialogFooter className="flex flex-col-reverse gap-y-4">
        <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
        <Button onClick={onSubmit} className="bg-lime-400">
          Confirm
          {loading && (
            <div className="w-3 h-3 rounded-full bg-transparent border-2 border-white animate-spin" />
          )}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default ConfirmTransfer;
