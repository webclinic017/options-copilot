import Image from "next/image";
import React from "react";
import { EMPTY_SELECTOR_STATE } from "../constants";
import { tradeData } from "../interfaces/trade";
import SortIconButton from "./SortIconButton";

interface Props {
  trades: tradeData[];
  hasDataLoaded: boolean;
  selectTradeToDelete: number | number[];
  setSelectTradeToDelete: (data: number | number[]) => void;
  sortOrder: {
    name: string;
    ascending: boolean;
    dateRange?: null | [Date, Date];
  };
  setSortOrder: (data: {}) => void;
}

const TradeTable = ({
  trades,
  hasDataLoaded,
  selectTradeToDelete,
  setSelectTradeToDelete,
  sortOrder,
  setSortOrder,
}: Props) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contractId = Number(event.target.value);

    selectTradeToDelete === contractId
      ? setSelectTradeToDelete(EMPTY_SELECTOR_STATE)
      : setSelectTradeToDelete(contractId);
  };

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.checked
      ? setSelectTradeToDelete(trades.map((trade) => trade.id))
      : setSelectTradeToDelete(EMPTY_SELECTOR_STATE);
  };

  return (
    <div
      className={`flex flex-col ${
        selectTradeToDelete == EMPTY_SELECTOR_STATE ? "mt-28" : "mt-5"
      }`}
    >
      <div className="overflow-x-auto max-h-[42rem] mb-5 sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          {trades.length && hasDataLoaded ? (
            <table className="min-w-full  ">
              <thead className="bg-gray-800 sticky top-0">
                <tr className="">
                  <th className="text-sm font-bold  text-white px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      onChange={(event) => handleCheckAll(event)}
                      checked={typeof selectTradeToDelete === "object"}
                    />
                  </th>
                  <th className="tableHeader">
                    Symbol
                    <SortIconButton
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      fieldName="symbol"
                    />
                  </th>
                  <th className="tableHeader">
                    Date/Time
                    <SortIconButton
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      fieldName="date_time"
                    />
                  </th>
                  <th className="tableHeader">Buy/Sell</th>
                  <th className="tableHeader">
                    Quantity
                    <SortIconButton
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      fieldName="quantity"
                    />
                  </th>
                  <th className="tableHeader">
                    Price
                    <SortIconButton
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      fieldName="trade_price"
                    />
                  </th>
                  <th className="tableHeader">
                    PnL
                    <SortIconButton
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                      fieldName="pnl_realized"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr
                    key={index}
                    className=" bg-gray-900 border-b border-gray-700 transition duration-300 ease-in-out hover:bg-gray-800 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center">
                      <input
                        type="checkbox"
                        value={trade.id}
                        onChange={(event) => handleOnChange(event)}
                        checked={
                          selectTradeToDelete === trade.id ||
                          typeof selectTradeToDelete === "object"
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-white">
                      {trade.symbol}
                      <div className="text-sm text-gray-400 mt-2">
                        Contract: {trade.description}
                      </div>
                    </td>
                    <td className="text-base text-white font-light px-6 py-4">
                      {trade.date_time.replace("T", " ")}
                    </td>
                    <td
                      className={`text-base font-light px-6 py-4 whitespace-nowrap ${
                        trade.quantity > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trade.quantity > 0 ? "Buy" : "Sell"}
                    </td>
                    <td className="text-base text-white font-light px-6 py-4 whitespace-nowrap">
                      {trade.quantity}
                    </td>
                    <td className="text-base text-white font-light px-6 py-4 whitespace-nowrap">
                      {trade.trade_price}
                    </td>
                    <td
                      className={`text-base text-white font-light px-6 py-4 whitespace-nowrap ${
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
          ) : !trades.length && hasDataLoaded ? (
            <div className="flex justify-center">
              <Image
                src="/noData.svg"
                alt="No Data"
                layout="fixed"
                width={400}
                height={500}
              />
            </div>
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
