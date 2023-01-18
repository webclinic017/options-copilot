import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/utils/supabaseClient";

export const useGetTradesById = (contract_id, date_time) => {
  const user = supabase.auth.user();

  return useQuery(
    ["tradesById", contract_id, date_time],
    () => fetchTradesById(contract_id, date_time, user),
    {
      refetchOnMount: true,
      keepPreviousData: true,
    }
  );
};

export const fetchTradesById = async (contract_id, date_time, user) => {
  const nextDay = new Date(date_time);
  nextDay.setDate(nextDay.getDate() + 1);

  const { data, error, count } = await supabase
    .from("trade_records")
    .select(`*`, { count: "exact" })
    .eq("user_id", user.id)
    .eq("contract_id", contract_id)
    .gte("date_time", date_time)
    .lt("date_time", nextDay.toLocaleDateString("en-US", { timeZone: "UTC" }));

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Trades not found");
  }

  return { trades: data, count };
};
