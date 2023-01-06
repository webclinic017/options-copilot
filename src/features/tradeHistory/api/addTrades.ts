import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ManualTrade } from "@/interfaces/trade";
import { supabase } from "@/utils/supabaseClient";

const addTrade = async (data: ManualTrade | ManualTrade[]) => {
  const { data: trades, error: err } = await supabase
    .from("trade_records")
    .insert(data);

  if (err) {
    console.log("err", err);
    throw err;
  }

  return trades;
};

export const useAddTrades = () => {
  const queryClient = useQueryClient();

  return useMutation((data: ManualTrade | ManualTrade[]) => addTrade(data), {
    onSuccess: () => {
      queryClient.refetchQueries(["trades"]);
    },
  });
};
