import React from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/utils/supabaseClient";

import {
  CsvButtonUpload,
  TradeTable,
  useGetTrades,
} from "@/features/tradeHistory";

const trades = ({ user }) => {
  useGetTrades();

  return (
    <Layout>
      <div className="md:flex justify-between space-y-5 md:space-y-0  ">
        <div className="text-3xl font-bold text-white">Trade History</div>
        <div className="btn-group">
          <button className="btn btn-outline btn-info">Add Trade</button>
          <CsvButtonUpload user={user} />
        </div>
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
