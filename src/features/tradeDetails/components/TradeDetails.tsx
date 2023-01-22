import React from "react";

import { useAtomValue } from "jotai";
import { Popover, Whisper } from "rsuite";

import { useGetSymbol } from "../api/getSymbol";
import {
  tradePnlRealizedAtom,
  totalTradeVolumeAtom,
  selectedDateAtom,
  tradeByIdAtom,
} from "../atom";

type Props = {
  symbol: string | string[];
  children?: React.ReactNode;
};

export const TradeDetails = ({ symbol, children }: Props) => {
  const { data: symbolData } = useGetSymbol(symbol);

  const selectedTrade = useAtomValue(tradeByIdAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const tradePnlRealized = useAtomValue(tradePnlRealizedAtom);
  const totalTradeVolue = useAtomValue(totalTradeVolumeAtom);

  return (
    <div
      data-theme="black"
      className="bg-primary flex-auto min-w-[22rem] mt-5 space-y-3 px-5"
    >
      <div className="text-xs flex justify-between mt-5">
        Symbol
        <span>Last</span>
      </div>
      <div className="text-base flex justify-between">
        {symbol}
        {symbolData && <span>{symbolData.c}</span>}
      </div>

      <div className="text-base flex justify-between">
        <span>Date</span>
        {selectedDate.toDateString()}
      </div>

      <div className="text-base flex justify-between">
        <div>Contract Desc</div>
        <span>{selectedTrade[0]?.description}</span>
      </div>

      <div className="text-base flex justify-between">
        NET P&L
        <span
          className={`${
            tradePnlRealized > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          ${tradePnlRealized.toFixed(2)}
        </span>
      </div>
      <div className="text-base flex justify-between  cursor-pointer">
        <Whisper
          followCursor
          speaker={
            <Popover className="bg-black">
              <ul>
                {selectedTrade.map((data) => (
                  <div key={data.id}>{`${data.quantity > 0 ? "Buy" : "Sell"} ${
                    data.quantity
                  } @ ${data.date_time.slice(11)}`}</div>
                ))}
              </ul>
            </Popover>
          }
        >
          <p className="underline">Options Traded</p>
        </Whisper>
        <span> {totalTradeVolue} </span>
      </div>

      <div className="text-base flex justify-between">Proft Target</div>

      <div className="text-base flex justify-between">Stop Loss</div>

      <div className="text-base flex justify-between">Trade Risk</div>
      <div className="text-base flex justify-between">Planned R:R Multiple</div>
      <div className="text-base flex justify-between">
        Realized R:R Multiple
      </div>
      {children}
    </div>
  );
};
