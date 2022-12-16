import { useState, useEffect } from "react";
import { useDeleteTradeTags } from "../TradeTags/useDeleteTradeTags";
import { useAddTradeDetails } from "./useAddTradeDetails";
import { TradeTag } from "@/interfaces/trade";

const useTradeForm = (formState: TradeTag[]) => {
  const [formData, setFormData] = useState({
    setup: formState.filter((tag) => tag.tag_type === "setup") ?? [],
    mistake: formState.filter((tag) => tag.tag_type === "mistake") ?? [],
    custom: formState.filter((tag) => tag.tag_type === "custom") ?? [],
    loading: false,
    toggle: true,
  });

  const { mutate, isSuccess } = useAddTradeDetails();
  const { mutate: removeTag } = useDeleteTradeTags();

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        ...formData,
        loading: false,
      });
    }
  }, [isSuccess]);

  const handleDataChange = (
    data: TradeTag[],
    type: "setup" | "mistake" | "custom"
  ) => {
    console.log(data);
    console.log(formData);
    setFormData({ ...formData, [type]: data, toggle: false });
  };

  const handleDataSubmit = (
    contractId: number,
    tradeDate: string,
    userId: string,
    savedTags: TradeTag[]
  ) => {
    console.log("here");
    setFormData({
      ...formData,
      loading: true,
    });
    const flattenTradeTags = formData.setup
      .concat(formData.mistake, formData.custom)
      .map((tag) => ({
        contract_id: contractId,
        date: tradeDate,
        user_id: userId,
        tag_id: tag.tag_id,
      }));

    const tagsToRemove = savedTags
      .filter(
        ({ tag_id: tagId }) =>
          !flattenTradeTags.some(
            ({ tag_id: contractTagId }) => tagId === contractTagId
          )
      )
      .map((data) => data.tag_id);

    if (tagsToRemove.length !== 0) {
      tagsToRemove.forEach((tagId) =>
        removeTag({
          contract_id: contractId,
          tag_id: tagId,
          date: tradeDate,
        })
      );
    }

    mutate(flattenTradeTags);
  };

  return { formData, handleDataChange, handleDataSubmit };
};

export default useTradeForm;
