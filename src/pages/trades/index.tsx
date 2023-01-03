import React, { useState } from "react";
import Image from "next/image";

import Layout from "@/components/Layout";
import TradeTable from "@/components/TradeTable";
import DrawerView from "@/components/DrawerView";

import { supabase } from "@/utils/supabaseClient";

import {
  EMPTY_SELECTOR_STATE,
  MOBILE_BREAK_POINT,
  TABLE_BREAK_POINT,
  DEFAULT_PAGE_LIMIT,
} from "@/constants/index";

import DateRangePicker from "rsuite/DateRangePicker";
import Pagination from "rsuite/Pagination";

import {
  // useGetTrades,
  useDeleteTrades,
  useTradeFilters,
  useWindowSize,
} from "@/hooks/index";
import { CsvButtonUpload } from "@/features/tradeHistory";
import { useGetTrades } from "@/features/tradeHistory/api/getTrades";

const trades = ({ user }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectTradeToDelete, setSelectTradeToDelete] = useState<
    number | number[]
  >(EMPTY_SELECTOR_STATE);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);

  const { sortOrder, setSortOrder } = useTradeFilters();

  const { data, isLoading } = useGetTrades();

  const { mutate } = useDeleteTrades();

  const deleteTrade = async (data: number | number[]) => {
    if (!data) return;
    const dateToDelete: [string, number] =
      typeof data === "object" ? ["user_id", user.id] : ["id", data];
    mutate(dateToDelete);

    setSelectTradeToDelete(EMPTY_SELECTOR_STATE);
  };

  const handleDatePicker = (value: [Date, Date]) => {
    setActivePage(1);

    setSortOrder({
      ...sortOrder,
      dateRange: value,
    });
  };

  const windowSize = useWindowSize();
  console.log("incomingData", data);
  return (
    <Layout>
      <div className="md:flex justify-between space-y-5 md:space-y-0  ">
        <div className="text-3xl font-bold text-white">Trade History</div>
        <div className="btn-group">
          <button
            className="btn btn-outline"
            onClick={() => setShowDrawer(true)}
          >
            Add Trade
          </button>
          <CsvButtonUpload user={user} />
        </div>
      </div>
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
