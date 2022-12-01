import React from "react";
import { useCSVReader } from "react-papaparse";
import { csvData } from "../interfaces/trade";
import { User } from "@supabase/supabase-js";
import { useAddTrades } from "../hooks/Trade/useAddTrades";

interface Props {
  user: User;
}

const ButtonFileUpload = ({ user }: Props) => {
  const { CSVReader } = useCSVReader();
  const { mutate } = useAddTrades();

  const handleOnDrop = async ({ data: fileData }) => {
    const dbData = fileData
      .filter((data: csvData) => data.UnderlyingSymbol)
      .map((filteredData: csvData) => {
        return {
          contract_id: filteredData.Conid,
          user_id: user.id,
          symbol: filteredData.UnderlyingSymbol,
          description: filteredData.Description,
          quantity: filteredData.Quantity,
          trade_price: filteredData.TradePrice,
          pnl_realized: filteredData.FifoPnlRealized,
          date_time: filteredData.DateTime,
        };
      });
    mutate(dbData);
  };

  return (
    <CSVReader
      config={{
        header: true,
        dynamicTyping: true,
      }}
      onUploadAccepted={(result: any) => handleOnDrop(result)}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => (
        <div>
          <button
            className="bg-blue-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center duration-300"
            {...getRootProps()}
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Import CSV</span>
          </button>
        </div>
      )}
    </CSVReader>
  );
};

export default ButtonFileUpload;
