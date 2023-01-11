import React from "react";

import { useAtomValue, useSetAtom } from "jotai";
import { dateRangeAtom, dateRangeString } from "src/atoms";

import Layout from "@/components/Layout";
import {
  CsvButtonUpload,
  TradeTable,
  useGetTrades,
} from "@/features/tradeHistory";
import TradeDatePicker from "@/features/tradeHistory/components/TradeDatePicker";
import { supabase } from "@/utils/supabaseClient";

const trades = ({ user }) => {
  const setTradeRange = useSetAtom(dateRangeAtom);
  const dateRangeStr = useAtomValue(dateRangeString);

  useGetTrades(dateRangeStr);

  const handleSelect = (value) => {
    setTradeRange(value);
  };

  return (
    <Layout>
      <div className="md:flex justify-between space-y-5 md:space-y-0  ">
        <div className="text-3xl font-bold text-white">Trade History</div>
        <div className="btn-group">
          <button className="btn btn-outline btn-info">Add Trade</button>
          <CsvButtonUpload user={user} />
        </div>
      </div>
      <div className="absolute top-36 right-14 hidden md:inline-block">
        <TradeDatePicker handleSelect={handleSelect} />
      </div>
      <TradeTable />
    </Layout>
  );
};

export default trades;

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: { user } };
}

/**
 *TODO: Refactor Delete Trade Functionality to be cleaner and easier to understand
 *TODO: Create Search Functionality to get Trades by Symbol Name
 *
 */
