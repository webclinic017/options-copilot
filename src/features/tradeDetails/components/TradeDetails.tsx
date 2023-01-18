import React from "react";

import { Popover, Whisper } from "rsuite";

import { TradeData } from "@/features/tradeHistory";

import { useGetSymbol } from "../api/getSymbol";

type Props = {
  symbol: string | string[];
  tradeData: TradeData[]; // fix this type import to general typing,
  children?: React.ReactNode;
};

export const TradeDetails = ({ symbol, tradeData, children }: Props) => {
  const { data: symbolData } = useGetSymbol(symbol);
  const selectedDate = new Date(tradeData[0]?.date_time);

  const profitOrLoss =
    tradeData.reduce((acc, obj) => {
      return acc + obj.pnl_realized;
    }, 0) ?? 0;

  const totalOptionsTraded =
    tradeData?.reduce((acc, obj) => {
      return acc + Math.abs(obj.quantity);
    }, 0) ?? 0;
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
        <span>{tradeData[0]?.description}</span>
      </div>

      <div className="text-base flex justify-between">
        NET P&L
        <span
          className={`${profitOrLoss > 0 ? "text-green-500" : "text-red-500"}`}
        >
          ${profitOrLoss.toFixed(2)}
        </span>
      </div>
      <div className="text-base flex justify-between  cursor-pointer">
        <Whisper
          followCursor
          speaker={
            <Popover className="bg-black">
              <ul>
                {tradeData.map((data) => (
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
        <span> {totalOptionsTraded} </span>
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
