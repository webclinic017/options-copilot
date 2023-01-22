import { atom } from "jotai";

export const tradeByIdAtom = atom([]);
export const stockCandlesAtom = atom([]);

export const tradePnlRealizedAtom = atom((get) => {
  const trades = get(tradeByIdAtom);
  return trades.reduce((acc, obj) => {
    return acc + obj.pnl_realized;
  }, 0);
});

export const totalTradeVolumeAtom = atom((get) => {
  const trades = get(tradeByIdAtom);
  return trades.reduce((acc, obj) => {
    return acc + Math.abs(obj.quantity);
  }, 0);
});

export const selectedDateAtom = atom((get) => {
  const trades = get(tradeByIdAtom);
  return new Date(trades[0]?.date_time);
});
