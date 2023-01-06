import { useQueries } from "@tanstack/react-query";
import { timeToLocal } from "@/utils/helper";
import { supabase } from "@/utils/supabaseClient";
import { useAtomValue } from "jotai";
import { timeFrameAtom } from "src/atoms";

export const useTradeDetails = (
  symbol,
  contract_id,
  date_time,
  initialTradeData,
  allTags,
  tradeTags
) => {
  const user = supabase.auth.user();
  const timeFrame = useAtomValue(timeFrameAtom);

  return useQueries({
    queries: [
      {
        queryKey: ["symbol", symbol],
        queryFn: () => fetchStockInfo(symbol),
      },
      {
        queryKey: ["tradesById", contract_id, date_time],
        queryFn: () => fetchTradesById(contract_id, date_time, user.id),
        keepPreviousData: true,
        initialData: initialTradeData,
      },
      {
        queryKey: ["candles", symbol, date_time, timeFrame],
        queryFn: () => fetchCandles(symbol, date_time, timeFrame),
        select: transformCandleData,
        keepPreviousData: true,
      },
      {
        queryKey: ["tradeTags"],
        queryFn: () => fetchTradeTags(user.id),
        keepPreviousData: true,
        initialData: allTags,
      },
      {
        queryKey: ["tradeTagsByContract", contract_id, date_time],
        queryFn: () =>
          fetchTradeTagsByContract(contract_id, user.id, date_time),
        keepPreviousData: true,
        initialData: tradeTags,
      },
    ],
  });
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

  return { data };
};

export const fetchTradeTags = async (user_id: string) => {
  const { data, error } = await supabase
    .from("trade_tags")
    .select(`*`)
    .eq("user_id", user_id);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export const fetchTradesById = async (
  contract_id: string,
  date_time: Date,
  user_id: string
) => {
  const nextDay = new Date(date_time);
  nextDay.setDate(nextDay.getDate() + 1);

  const { data, error, count } = await supabase
    .from("trade_records")
    .select(`*`, { count: "exact" })
    .eq("user_id", user_id)
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

const fetchStockInfo = async (symbol) => {
  const data = await (
    await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    )
  ).json();
  return data;
};

/**
 * Returns Array containing candlestick data based on symbol and date/time
 *
 * @param {string} symbol The string containing the name of the stock to request data for
 * @return {string} date_time The string containng the selected date which is then used to get market time
 *                            Market is open from 9:30 AM EST - 4:00 PM EST (16:00 Military Time)
 */
const fetchCandles = async (symbol: string, date_time: Date, timeframe = 1) => {
  const marketOpen = new Date(`${date_time} 9:30:00`).getTime() / 1000;
  const marketClose = new Date(`${date_time} 16:00:00`).getTime() / 1000;

  const data = await (
    await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${timeframe}&from=${marketOpen}&to=${marketClose}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    )
  ).json();
  return data;
};

/**
 * Returns Array in specific order for CandleStick Charts
 *
 * @param {array} data The array that contains all the candlestick info
 * @return {array} data Transformed array in specific order [unixTime,[open,high,low,close]]
 */
const transformCandleData = (data) =>
  data.t.map((unixTime: number, index: number) => {
    return {
      time: timeToLocal(unixTime),
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      close: data.c[index],
      volume: data.v[index],
    };
  });
