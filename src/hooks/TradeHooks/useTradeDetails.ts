import { useQueries } from "@tanstack/react-query";
import { supabase } from "../../utils/supabaseClient";

export const useTradeDetails = (
  symbol,
  contract_id,
  date_time,
  initialTradeData
) => {
  const user = supabase.auth.user();
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
        queryKey: ["candles", symbol, date_time],
        queryFn: () => fetchCandles(symbol, date_time),
        select: transformCandleData,
      },
    ],
  });
};

export const fetchTradesById = async (
  contract_id: string,
  date_time: Date,
  userId: string
) => {
  const nextDay = new Date(date_time);
  nextDay.setDate(nextDay.getDate() + 1);

  const { data, error, count } = await supabase
    .from("trade_records")
    .select(`*`, { count: "exact" })
    .eq("user_id", userId)
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
const fetchCandles = async (symbol, date_time) => {
  const marketOpen = new Date(`${date_time} 9:30:00`).getTime() / 1000;
  const marketClose = new Date(`${date_time} 16:00:00`).getTime() / 1000;

  const data = await (
    await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=5&from=${marketOpen}&to=${marketClose}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
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
    return [
      unixTime * 1000,
      [data.o[index], data.h[index], data.l[index], data.c[index]],
    ];
  });
