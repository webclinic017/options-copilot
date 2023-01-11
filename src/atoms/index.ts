import { atom } from "jotai";
import type { PrimitiveAtom } from "jotai";

import { getTradeRangeTime } from "@/utils/helper";
import { sortByDate } from "@/utils/sort";

import { TIME_FRAMES } from "../constants";

type SortType = {
  name: "symbol" | "date" | "quantity" | "trade_price" | "pnl_realized";
  ascending: boolean;
};

export const timeFrameAtom = atom(TIME_FRAMES.ONE_MIN_TIMEFRAME);

export const tradeDataAtom = atom([]);

export const sortType = atom<SortType>({
  name: "date",
  ascending: false,
});

export const sortedTrades = atom((get) => {
  const trades = get(tradeDataAtom);
  const { name, ascending } = get(sortType);

  if (name === "symbol") {
    trades.sort((a, b) => a?.symbol.localeCompare(b?.symbol));
  } else if (["quantity", "trade_price", "pnl_realized"].includes(name)) {
    trades.sort((a, b) => a?.[name] - b?.[name]);
  } else sortByDate(trades);

  return ascending ? trades : trades.reverse();
});

type DateRangeType = {
  value: [Date];
};

export const dateRangeAtom = atom<PrimitiveAtom<DateRangeType>[]>([]);

export const dateRangeString = atom((get) => {
  const dateRange = get(dateRangeAtom);
  if (!dateRange.length) {
    return null;
  }
  const { startDate, endDate } = getTradeRangeTime(dateRange);
  return { startDate, endDate };
});
