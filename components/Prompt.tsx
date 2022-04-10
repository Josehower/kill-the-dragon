import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GameDialog } from '../database/dialogs';

export default function Prompt({
  promptDialog,
  setPromptDialog,
}: {
  promptDialog?: GameDialog;
  setPromptDialog: Dispatch<SetStateAction<GameDialog | undefined>>;
}) {
  const [dialogPosition, setDialogPosition] = useState(0);

  const test = useCallback(() => {
    console.log(promptDialog);
    if (promptDialog && dialogPosition + 1 === promptDialog.dialog.length) {
      setPromptDialog(undefined);
      setDialogPosition(0);
    } else {
      setDialogPosition((current) => current + 1);
    }
  }, [dialogPosition, promptDialog, setPromptDialog]);

  const handleKeyUp = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.code === 'Space') {
        test();
      }
    },
    [test],
  );

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  if (!promptDialog) return null;

  return (
    <div>
      {JSON.stringify(promptDialog)}
      <h1>{promptDialog.dialog[dialogPosition]?.name}</h1>
      <div>{promptDialog.dialog[dialogPosition]?.message}</div>
      <button
        onClick={() => {
          test();
        }}
      >
        next
      </button>
    </div>
  );
}
