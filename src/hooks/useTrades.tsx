import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export const useTrades = (user: User, from: number, to: number) => {
  const [trades, setTrades] = useState([]);
  const [totalTrades, setTotalTrades] = useState(null);

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
      .range(from, to)
      .eq("user_id", user.id)
      .order("date_time", { ascending: false });
    setTrades(data);
    setTotalTrades(count);
  };

  const deleteTrades = async (tradeToDelete: any[]) => {
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
    if (user) {
      getTrades().catch((error) => console.log("error", error));
    }
  }, [user, from, to]);

  return {
    trades,
    addTrade,
    totalTrades,
    setTrades,
    deleteTrades,
  };
};
