import { useCSVReader } from "react-papaparse";

import { User } from "@supabase/supabase-js";
import { CsvData } from "../types";
import { useAddTrades } from "../api/addTrades";
import { mergeDuplicateTrade } from "@/utils/format";

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
          <button className="btn btn-primary gap-2" {...getRootProps()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"
              />
            </svg>

            <span>Import CSV</span>
          </button>
        </div>
      )}
    </CSVReader>
  );
};
