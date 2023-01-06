import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/utils/supabaseClient";

const deleteTradeTags = async ({ contract_id, tag_id, date }) => {
  const { id: user_id } = supabase.auth.user();

  const { data, error } = await supabase
    .from("trade_details_tags")
    .delete()
    .match({
      contract_id,
      date,
      tag_id,
      user_id,
    });
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Trades not found");
  }

  return data;
};

export const useDeleteTradeTags = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { contract_id: number; tag_id: number; date: string | string[] }) =>
      deleteTradeTags(data),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["tradeTagsByContract"]);
      },
    }
  );
};
