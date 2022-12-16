import React, { useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/utils/supabaseClient";
import TradeTable from "@/components/TradeTable";
import ButtonFileUpload from "@/components/ButtonFileUpload";
import DrawerView from "@/components/DrawerView";
import {
  EMPTY_SELECTOR_STATE,
  MOBILE_BREAK_POINT,
  TABLE_BREAK_POINT,
  DEFAULT_PAGE_LIMIT,
} from "@/constants/index";
import useTradeFilters from "@/hooks/useTradeFilters";
import DateRangePicker from "rsuite/DateRangePicker";
import Pagination from "rsuite/Pagination";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useGetTrades } from "@/hooks/Trade/useGetTrades";
import Image from "next/image";
import { useDeleteTrades } from "@/hooks/Trade/useDeleteTrades";

const trades = ({ user }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectTradeToDelete, setSelectTradeToDelete] = useState<
    number | number[]
  >(EMPTY_SELECTOR_STATE);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);

  const { sortOrder, setSortOrder } = useTradeFilters();

  const { data, isLoading } = useGetTrades({
    sortName: sortOrder.name,
    sortAsc: sortOrder.ascending,
    filterByDateRange: sortOrder.dateRange,
    pageNumber: activePage,
    maxPageSize: limit,
  });

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

  return (
    <Layout>
      <div className="md:flex justify-between space-y-5 md:space-y-0  ">
        <div className="text-3xl font-bold text-white">Trade History</div>
        <div className="flex space-x-3">
          <button
            className="bg-gray-700 hover:bg-blue-400 text-white text-center font-bold py-2 px-4 rounded duration-300 w-32 "
            onClick={() => setShowDrawer(true)}
          >
            Add Trade
          </button>
          <ButtonFileUpload user={user} />
        </div>
      </div>
      {selectTradeToDelete != EMPTY_SELECTOR_STATE && (
        <div className=" py-3 mt-8 flex ">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-center font-bold py-2 px-4 rounded duration-300 w-32 "
            onClick={() => deleteTrade(selectTradeToDelete)}
          >
            Delete Trades
          </button>
        </div>
      )}
      {data?.trades.length > 0 && (
        <div className="absolute top-36 right-14 hidden md:inline-block">
          <DateRangePicker
            value={sortOrder.dateRange}
            placeholder="Select Date Range"
            placement="bottomEnd"
            onOk={(value: [Date, Date]) => handleDatePicker(value)}
            onClean={(e) =>
              setSortOrder({
                ...sortOrder,
                dateRange: null,
              })
            }
          />
        </div>
      )}
      {data?.trades && !isLoading ? (
        <TradeTable
          {...{
            trades: data.trades,
            isLoading,
            selectTradeToDelete,
            setSelectTradeToDelete,
            sortOrder,
            setSortOrder,
          }}
        />
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
      {data?.trades.length > 0 && (
        <Pagination
          total={data.count}
          prev={true}
          next={true}
          first={windowSize.width > TABLE_BREAK_POINT ? true : false}
          last={windowSize.width > TABLE_BREAK_POINT ? true : false}
          limit={limit}
          onChangeLimit={(limit: number) => {
            setLimit(limit);
            setActivePage(1);
          }}
          limitOptions={[25, 50, 100]}
          activePage={activePage}
          onChangePage={setActivePage}
          layout={
            windowSize.width > MOBILE_BREAK_POINT
              ? ["total", "-", "limit", "|", "pager", "skip"]
              : ["pager", "limit"]
          }
          maxButtons={5}
        />
      )}
      <DrawerView
        user={user}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
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
