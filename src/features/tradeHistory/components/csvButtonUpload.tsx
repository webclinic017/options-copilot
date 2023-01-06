import { useCSVReader } from "react-papaparse";

import { User } from "@supabase/supabase-js";
import { CsvData } from "../types";
import { useAddTrades } from "../api/addTrades";
import { mergeDuplicateTrade } from "@/utils/sort";

interface Props {
  user: User;
}

export const CsvButtonUpload = ({ user }: Props) => {
  const { CSVReader } = useCSVReader();
  const { mutate } = useAddTrades();

  const handleOnDrop = async ({ data: fileData }) => {
    const incomingData = fileData
      .filter((data: CsvData) => data.Symbol)
      .map((filteredData: CsvData) => {
        return {
          contract_id: filteredData.Conid,
          user_id: user.id,
          symbol: filteredData.Symbol.substring(0, 4).trim(),
          description: filteredData.Description,
          quantity: filteredData.Quantity,
          trade_price: filteredData.TradePrice,
          pnl_realized: filteredData.FifoPnlRealized,
          date_time: filteredData.DateTime,
        };
      });

    // const mergedTrades = mergeDuplicateTrade(incomingData);
    // mutate(mergedTrades)
    mutate(mergeDuplicateTrade(incomingData));
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
            className="btn btn-primary rounded-l-none"
            {...getRootProps()}
          >
            <svg
              width="24px"
              height="24px"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>

            <span>Import CSV</span>
          </button>
        </div>
      )}
    </CSVReader>
  );
};
