import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/utils/supabaseClient";

export const useGetTradeTags = (contract_id, date_time) => {
  const user = supabase.auth.user();
  return useQuery(
    ["tradeTags", contract_id, date_time],
    () => fetchAllTags(contract_id, user.id, date_time),

    {
      refetchOnMount: true,
      keepPreviousData: true,
    }
  );
};

const fetchAllTags = async (
  contract_id: number,
  user_id: string,
  contract_date: string
) => {
  const tradeTags = await fetchTradeTags(user_id);
  const contractTags = await fetchTradeTagsByContract(
    contract_id,
    user_id,
    contract_date
  );

  return [tradeTags, contractTags];
};

export const fetchTradeTagsByContract = async (
  contract_id: number,
  user_id: string,
  contract_date: string
) => {
  const { data, error } = await supabase
    .from("trade_details_tags")
    .select(`*`)
    .eq("user_id", user_id)
    .eq("contract_id", contract_id)
    .eq("date", contract_date);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchTradeTags = async (user_id: string) => {
  const { data, error } = await supabase
    .from("trade_tags")
    .select(`*`)
    .eq("user_id", user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
