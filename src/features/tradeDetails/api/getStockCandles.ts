import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useAtomValue } from "jotai";
import { timeFrameAtom } from "src/atoms";

import { timeToLocal } from "@/utils/helper";

import { stockCandlesAtom } from "../atom";

export const useGetStockCandles = (symbol, date_time) => {
  const timeFrame = useAtomValue(timeFrameAtom);
  const setStockCandles = useSetAtom(stockCandlesAtom);

  return useQuery(
    ["candles", symbol, date_time, timeFrame],
    () => fetchCandles(symbol, date_time, timeFrame),

    {
      onSuccess: (data) => setStockCandles(data),
      select: transformCandleData,
      refetchOnMount: true,
      keepPreviousData: true,
    }
  );
};

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
