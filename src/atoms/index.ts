import { atom } from "jotai";

import { TIME_FRAMES } from "../constants";

import { sortByDate } from "@/utils/sort";

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
