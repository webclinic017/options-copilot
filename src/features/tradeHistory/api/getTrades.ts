import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabaseClient";

interface tradeOptions {
  sortName: string;
  sortAsc: boolean;
  filterByDateRange: any | null;
  pageNumber: number;
  maxPageSize: number;
}

export const useGetTrades = () => {
  const user = supabase.auth.user();

  const fetchTrades = async () => {
    const { data, error, count } = await supabase
      .from("trade_records")
      .select(`*`, { count: "exact" })
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Trades not found");
    }

    return { trades: data, count };
  };

  return useQuery(["trades"], () => fetchTrades(), {
    refetchOnMount: true,
    keepPreviousData: true,
  });
};
