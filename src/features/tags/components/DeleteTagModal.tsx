import { useEffect } from "react";
import Modal from "rsuite/Modal";
import TrashIcon from "@rsuite/icons/Trash";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import { useDeleteTag } from "../api/deleteTag";
import { DeleteTagState, TradeTag } from "@/interfaces/trade";

type DeleteTagModalProps = {
  deleteTradeTag: DeleteTagState;
  selectedTagToDelete: TradeTag;
  handleDeleteTagModalToggle: (
    modalToggle: boolean,
    deleteTagId: null | number
  ) => void;
};

export const DeleteTagModal = ({
  deleteTradeTag,
  selectedTagToDelete,
  handleDeleteTagModalToggle,
}: DeleteTagModalProps) => {
  const deleteTradeTagMutation = useDeleteTag();

  const handleModalSubmit = async () =>
    await deleteTradeTagMutation.mutateAsync(selectedTagToDelete?.tag_id);

  useEffect(() => {
    if (deleteTradeTagMutation.data) handleDeleteTagModalToggle(false, null);
  }, [deleteTradeTagMutation.isSuccess]);

  return (
    <Modal backdrop="static" keyboard={false} open={deleteTradeTag.modalToggle}>
      <div className="flex flex-col items-center justify-items-center space-y-7">
        <div className="text-lg text-black text-center">
          Delete Tag {selectedTagToDelete?.value}
        </div>

        <div className="w-40 h-28 z-30">
          <div className="absolute top-16 ml-8  bg-red-500 w-20 h-20 -z-20 rounded-full"></div>
          <div className="z-40">
            <TrashIcon
              style={{
                fontSize: "3rem",
                marginLeft: "3rem",
                marginTop: "2px",
              }}
            />
          </div>
        </div>

        <div className="inline-flex w-full justify-evenly">
          <button
            className="w-24 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleModalSubmit()}
          >
            {deleteTradeTagMutation.isLoading ? (
              <SpinnerIcon spin />
            ) : (
              "Confirm"
            )}
          </button>
          <button
            onClick={() => handleDeleteTagModalToggle(false, null)}
            className="w-24 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
