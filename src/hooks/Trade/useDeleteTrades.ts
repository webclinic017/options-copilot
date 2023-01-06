import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/utils/supabaseClient";

const deleteTrades = async (tradeToDelete: [string, number | string]) => {
  const { data, error } = await supabase
    .from("trade_records")
    .delete()
    .match({ [tradeToDelete[0]]: tradeToDelete[1] });
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Trades not found");
  }

  return data;
};

export const useDeleteTrades = () => {
  const queryClient = useQueryClient();
  return useMutation((data: [string, number | string]) => deleteTrades(data), {
    onSuccess: () => {
      queryClient.refetchQueries(["trades"]);
    },
  });
};
