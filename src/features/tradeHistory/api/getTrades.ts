import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabaseClient";
import { combineDailyTrades } from "@/utils/sort";
import { useSetAtom } from "jotai";
import { tradeDataAtom } from "src/atoms";

export const useGetTrades = () => {
  const user = supabase.auth.user();
  const setTrades = useSetAtom(tradeDataAtom);

  const fetchTrades = async () => {
    const { data, error } = await supabase
      .from("trade_records")
      .select(`*`, { count: "exact" })
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Trades not found");
    }

    return data;
  };

  return useQuery(["trades"], () => fetchTrades(), {
    refetchOnMount: true,
    keepPreviousData: true,
    select: (trades) => combineDailyTrades(trades),
    onSuccess: (trades) => {
      setTrades(trades);
    },
  });
};
