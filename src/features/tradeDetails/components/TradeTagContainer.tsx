import React, { useState } from "react";

import { Button } from "rsuite";

import { DeleteTagModal } from "@/features/tags";
import useTradeForm from "@/features/tradeDetails/api/useTradeForm";
import { DeleteTagState, TradeTag } from "@/interfaces/trade";

import { TradeTagDropdown } from "../components/TradeTagDropdown";

type Props = {
  allTags: {
    data: TradeTag[];
  };
  contractTags: {
    data: TradeTag[];
  };
  contractId: string | string[];
  dateTime: any;
};

export const TradeTagContainer = ({
  allTags,
  contractTags,
  contractId,
  dateTime,
}: Props) => {
  const [deleteTradeTag, setDeleteTradeTag] = useState<DeleteTagState>({
    modalToggle: false,
    deleteTagId: null,
  });
  const options = allTags.data.map((tag) => {
    return {
      value: tag.name,
      label: tag.name,
      tag_type: tag.tag_type,
      tag_id: tag.tag_id,
    };
  });

  const savedTags = allTags.data
    .filter(({ tag_id: tagId }) =>
      contractTags.data.some(
        ({ tag_id: contractTagId }) => tagId === contractTagId
      )
    )
    .map(({ name, tag_type, tag_id }) => {
      return {
        value: name,
        label: name,
        tag_type: tag_type,
        tag_id: tag_id,
      };
    });

  const selectedTagToDelete = options.find(
    (element) => element.tag_id === deleteTradeTag.deleteTagId
  );
  const { formData, handleDataChange, handleDataSubmit } =
    useTradeForm(savedTags);
  const { setup, mistake, custom, loading, toggle } = formData;

  const handleDeleteTagModalToggle = (
    modalToggle: boolean,
    deleteTagId: null | number
  ) => {
    setDeleteTradeTag({
      modalToggle,
      deleteTagId,
    });
  };
  return (
    <div>
      <div className="text-base flex-column">
        <p>Setups</p>
        <TradeTagDropdown
          options={options.filter((tag) => tag.tag_type === "setup")}
          dropdownType="setup"
          selectedTags={setup}
          handleDataChange={handleDataChange}
          handleDeleteTagModalToggle={handleDeleteTagModalToggle}
        />
      </div>
      <div className="text-base flex-column">
        <p>Mistakes</p>
        <TradeTagDropdown
          options={options.filter((tag) => tag.tag_type === "mistake")}
          dropdownType="mistake"
          selectedTags={mistake}
          handleDataChange={handleDataChange}
          handleDeleteTagModalToggle={handleDeleteTagModalToggle}
        />
      </div>
      <div className="text-base flex-column pb-4">
        <p>Custom</p>
        <TradeTagDropdown
          options={options.filter((tag) => tag.tag_type === "custom")}
          dropdownType="custom"
          selectedTags={custom}
          handleDataChange={handleDataChange}
          handleDeleteTagModalToggle={handleDeleteTagModalToggle}
        />
      </div>
      <Button
        disabled={toggle}
        appearance="primary"
        loading={loading}
        as={"div"}
        block
        onClick={() => handleDataSubmit(contractId, dateTime, savedTags)}
      >
        Save
      </Button>
      <DeleteTagModal
        deleteTradeTag={deleteTradeTag}
        handleDeleteTagModalToggle={handleDeleteTagModalToggle}
        selectedTagToDelete={selectedTagToDelete}
      />
    </div>
  );
};
