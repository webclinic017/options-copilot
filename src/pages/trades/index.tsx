import React from "react";

import { useAtomValue, useSetAtom } from "jotai";
import { dateRangeAtom, dateRangeString } from "src/atoms";

import Layout from "@/components/Layout";
import {
  CsvButtonUpload,
  TradeDatePicker,
  TradePagination,
  TradeTable,
  useGetTrades,
} from "@/features/tradeHistory";
import { supabase } from "@/utils/supabaseClient";

const trades = ({ user }) => {
  const setTradeRange = useSetAtom(dateRangeAtom);
  const dateRangeStr = useAtomValue(dateRangeString);
  const { data } = useGetTrades(dateRangeStr);

  const handleSelectDate = (value) => {
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
        <TradeDatePicker selectDate={handleSelectDate} />
      </div>

      <TradeTable />
      {!!data?.length && <TradePagination totalTrades={data.length} />}
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
