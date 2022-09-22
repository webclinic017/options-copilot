import Image from "next/image";
import React from "react";
import { tradeData } from "../interfaces/trade";

interface Props {
  trades: tradeData[];
  dataLoaded: boolean;
}

const TradeTable = ({ trades, dataLoaded }: Props) => {
  return (
    <div className="flex flex-col mt-24 ">
      <div className="overflow-x-auto max-h-[42rem] sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          {trades.length && dataLoaded ? (
            <table className="min-w-full  ">
              <thead className="bg-gray-800 sticky top-0 ">
                <tr className="">
                  <th className="text-sm font-bold  text-white px-6 py-4 text-left  ">
                    Symbol
                  </th>
                  <th className="text-sm font-bold text-white px-6 py-4 text-left">
                    Date/Time
                  </th>
                  <th className="text-sm font-medium text-white px-6 py-4 text-left">
                    Buy/Sell
                  </th>
                  <th className="text-sm font-medium text-white px-6 py-4 text-left">
                    Quantity
                  </th>
                  <th className="text-sm font-medium text-white px-6 py-4 text-left">
                    Trade Price
                  </th>
                  <th className="text-sm font-medium text-white px-6 py-4 text-left">
                    PnL
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr
                    key={index}
                    className="bg-gray-900 border-b border-gray-700 transition duration-300 ease-in-out hover:bg-gray-800 "
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {trade.symbol}
                      <div className="text-xs text-gray-400 mt-2 ">
                        {trade.description}
                      </div>
                    </td>
                    <td className="text-sm text-white font-light px-6 py-4 ">
                      {trade.date_time.replace("T", " ")}
                    </td>
                    <td
                      className={`text-sm font-light px-6 py-4 whitespace-nowrap ${
                        trade.quantity > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trade.quantity > 0 ? "Buy" : "Sell"}
                    </td>
                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap ">
                      {trade.quantity}
                    </td>
                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                      {trade.trade_price}
                    </td>
                    <td
                      className={`text-sm text-white font-light px-6 py-4 whitespace-nowrap ${
                        trade.pnl_realized > 0
                          ? "text-green-500"
                          : trade.pnl_realized < 0
                          ? "text-red-500"
                          : "text-white"
                      }`}
                    >
                      {trade.pnl_realized.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !trades.length && dataLoaded ? (
            <div>hello</div>
          ) : (
            <div className=" flex flex-col items-center -space-y-10 ">
              <Image
                className="rounded-xl"
                // src="/DataLoadingIllustration.svg"
                // Image coming from React Suites Js
                src="https://rsuitejs.com/images/error-404.svg"
                alt="me"
                layout="fixed"
                width={400}
                height={500}
              />
              <div className="animate-pulse">Searching...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeTable;
