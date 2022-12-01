import { useState } from "react";
import { useAddTradeDetails } from "./useAddTradeDetails";

const useTradeForm = (formState) => {
  const [formData, setFormData] = useState({
    setup: formState.filter((tag) => tag.tag_type === "setup") ?? [],
    mistake: formState.filter((tag) => tag.tag_type === "mistake") ?? [],
    custom: formState.filter((tag) => tag.tag_type === "custom") ?? [],
  });

  const { mutate } = useAddTradeDetails();

  const handleDataChange = (data, type) => {
    setFormData({ ...formData, [type]: data });
  };

  const handleDataSubmit = (
    contractId: number,
    tradeDate: string,
    userId: string
  ) => {
    const flattenTradeTags = formData.setup
      .concat(formData.mistake, formData.custom)
      .map((tag) => ({
        contract_id: contractId,
        date: tradeDate,
        user_id: userId,
        tag_id: tag.tag_id,
      }));

    mutate(flattenTradeTags);
  };

  return { formData, handleDataChange, handleDataSubmit };
};

export default useTradeForm;
