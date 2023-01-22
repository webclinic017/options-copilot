import { useQuery } from "@tanstack/react-query";

import { getPagination, getTradeRangeTime } from "@/utils/helper";
import { supabase } from "@/utils/supabaseClient";

interface GetTradeParams {
  sortName: string;
  sortAsc: boolean;
  filterByDateRange: any | null;
  pageNumber: number;
  maxPageSize: number;
}

export const useGetTrades = ({
  sortName = "date_time",
  sortAsc = true,
  filterByDateRange = null,
  pageNumber,
  maxPageSize,
}: GetTradeParams) => {
  const user = supabase.auth.user();
  const { pageStart, pageEnd } = getPagination(pageNumber, maxPageSize);

  const fetchTrades = async (sortName, sortAsc, filterByDateRange) => {
    if (filterByDateRange) {
      const { startDate, endDate } = getTradeRangeTime(filterByDateRange);

      const response = getTradesByDate(
        startDate.toLocaleString(),
        endDate.toLocaleString()
      ).catch((error) => console.log("error", error));

      return response;
    } else {
      const { data, error, count } = await supabase
        .from("trade_records")
        .select(`*`, { count: "exact" })
        .range(pageStart, pageEnd)
        .eq("user_id", user.id)
        .order(sortName, { ascending: sortAsc });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Trades not found");
      }

      return { trades: data, count };
    }
  };

  const getTradesByDate = async (
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const { data, error, count } = await supabase
      .from("trade_records")
      .select(`*`, { count: "exact" })
      .range(pageStart, pageEnd)
      .eq("user_id", user.id)
      .gte("date_time", startDate)
      .lte("date_time", endDate)
      .order(sortName, { ascending: sortAsc });
    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Trades not found");
    }

    return { trades: data, count };
  };

  return useQuery(
    ["trades", sortName, sortAsc, filterByDateRange, pageNumber, maxPageSize],
    () => fetchTrades(sortName, sortAsc, filterByDateRange),
    {
      refetchOnMount: true,
      keepPreviousData: true,
    }
  );
};
