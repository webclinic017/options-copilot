import { atom } from "jotai";

import { getPagination, getTradeRangeTime } from "@/utils/helper";
import { sortByDate } from "@/utils/sort";

import { TIME_FRAMES } from "../constants";

type SortType = {
  name: "symbol" | "date" | "quantity" | "trade_price" | "pnl_realized";
  ascending: boolean;
};

export const timeFrameAtom = atom(TIME_FRAMES.ONE_MIN_TIMEFRAME);

export const tradeDataAtom = atom([]);
export const tradePageAtom = atom(1);

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

export const paginatedTrades = atom((get) => {
  const trades = get(sortedTrades);
  //observes changes on sortType
  get(sortType);

  const currentPage = get(tradePageAtom);
  const { pageStart, pageEnd } = getPagination(currentPage);
  return trades.filter((_, index) => index >= pageStart && index <= pageEnd);
});

export const dateRangeAtom = atom([]);

export const dateRangeString = atom((get) => {
  const dateRange = get(dateRangeAtom);
  if (!dateRange.length) {
    return null;
  }
  const { startDate, endDate } = getTradeRangeTime(dateRange);
  return { startDate, endDate };
});

export const datePickerAtom = atom((get) => {
  const dateRange = get(dateRangeAtom);
  if (!dateRange.length) {
    return null;
  }

  const demo: [Date, Date] = [new Date(dateRange[0]), new Date(dateRange[1])];

  return demo;
});
/*
TODO: Look into seperating this file between different features/global atoms
*/
