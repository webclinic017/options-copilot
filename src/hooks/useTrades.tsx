import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import { getPagination } from "../utils/helper";

interface Props {
  sortName?: string;
  sortAsc?: boolean;
  filterByDateRange?: null | [Date, Date];
  pageNumber: number;
  maxPageSize: number;
}

export const useTrades = ({
  sortName = "date_time",
  sortAsc = true,
  filterByDateRange = null,
  pageNumber,
  maxPageSize,
}: Props) => {
  const [trades, setTrades] = useState([]);
  const [totalTrades, setTotalTrades] = useState(null);

  const user = supabase.auth.user();

  const { pageStart, pageEnd } = getPagination(pageNumber, maxPageSize);

  const addTrade = async (data: object) => {
    try {
      let { body } = await supabase.from("trade_records").insert(data);
      if (body.length) {
        getTrades();
      }
      return body;
    } catch (error) {
      console.log("error", error);
    }
  };
  const getTrades = async () => {
    const { data, error, count } = await supabase
      .from("trade_records")
      .select(`*`, { count: "exact" })
      .range(pageStart, pageEnd)
      .eq("user_id", user.id)
      .order(sortName, { ascending: sortAsc });
    setTrades(data);
    setTotalTrades(count);
  };

  const getTradesByDate = async (startDate: string, endDate: string) => {
    const { data, error, count } = await supabase
      .from("trade_records")
      .select(`*`, { count: "exact" })
      .range(pageStart, pageEnd)
      .eq("user_id", user.id)
      .gte("date_time", startDate)
      .lte("date_time", endDate)
      .order(sortName, { ascending: sortAsc });
    setTrades(data);
    setTotalTrades(count);
  };

  const deleteTrades = async (tradeToDelete: [string, number | string]) => {
    if (!tradeToDelete) return;
    try {
      const { data, error } = await supabase
        .from("trade_records")
        .delete()
        .match({ [tradeToDelete[0]]: tradeToDelete[1] });

      if (data.length) {
        getTrades();
        return data;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (user && !filterByDateRange) {
      getTrades().catch((error) => console.log("error", error));
    }

    if (user && filterByDateRange) {
      getTradesByDate(
        filterByDateRange[0].toLocaleString(),
        filterByDateRange[1].toLocaleString()
      ).catch((error) => console.log("error", error));
    }
  }, [user, sortName, sortAsc, filterByDateRange, pageNumber, maxPageSize]);

  return {
    trades,
    addTrade,
    setTrades,
    deleteTrades,
    totalTrades,
  };
};
