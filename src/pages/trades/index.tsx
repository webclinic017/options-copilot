import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useTrades } from "../../hooks/useTrades";
import { supabase } from "../../utils/supabaseClient";
import TradeTable from "../../components/TradeTable";
import ButtonFileUpload from "../../components/ButtonFileUpload";
import DrawerView from "../../components/DrawerView";
import { ManualTrade } from "../../interfaces/trade";
import {
  EMPTY_SELECTOR_STATE,
  mobileBreakPoint,
  tableBreakPoint,
  defaultPageLimit,
} from "../../constants";
import useTradeFilters from "../../hooks/useTradeFilters";
import DateRangePicker from "rsuite/DateRangePicker";
import Pagination from "rsuite/Pagination";
import { useWindowSize } from "../../hooks/useWindowSize";

const trades = ({ user }) => {
  const [hasDataLoaded, setDataLoaded] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectTradeToDelete, setSelectTradeToDelete] = useState<
    number | number[]
  >(EMPTY_SELECTOR_STATE);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(defaultPageLimit);

  const { sortOrder, setSortOrder } = useTradeFilters();

  const { trades, setTrades, addTrade, deleteTrades, totalTrades } = useTrades({
    sortName: sortOrder.name,
    sortAsc: sortOrder.ascending,
    filterByDateRange: sortOrder.dateRange,
    pageNumber: activePage,
    maxPageSize: limit,
  });

  const handleSubmit = async (formData: ManualTrade | ManualTrade[]) => {
    setDataLoaded(false);
    try {
      const data = await addTrade(formData);

      if (data) {
        setTrades(data);
        setShowDrawer(false);
        setSortOrder({
          ...sortOrder,
          dateRange: null,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    setDataLoaded(true);
  };

  const deleteTrade = async (data: number | number[]) => {
    if (!data) return;

    deleteTrades(
      typeof data === "object" ? ["user_id", user.id] : ["id", data]
    );
    setSelectTradeToDelete(EMPTY_SELECTOR_STATE);
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
          <ButtonFileUpload user={user} handleUpload={handleSubmit} />
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

      {trades.length > 0 && (
        <div className="absolute top-36 right-14 hidden md:inline-block">
          <DateRangePicker
            value={sortOrder.dateRange}
            placeholder="Select Date Range"
            placement="bottomEnd"
            onOk={(value) =>
              setSortOrder({
                ...sortOrder,
                dateRange: value,
              })
            }
            onClean={(e) =>
              setSortOrder({
                ...sortOrder,
                dateRange: null,
              })
            }
          />
        </div>
      )}

      <TradeTable
        {...{
          trades,
          hasDataLoaded,
          selectTradeToDelete,
          setSelectTradeToDelete,
          sortOrder,
          setSortOrder,
        }}
      />
      {trades.length > 0 && (
        <Pagination
          total={totalTrades}
          prev={true}
          next={true}
          first={windowSize.width > tableBreakPoint ? true : false}
          last={windowSize.width > tableBreakPoint ? true : false}
          limit={limit}
          onChangeLimit={setLimit}
          limitOptions={[25, 50, 100]}
          activePage={activePage}
          onChangePage={setActivePage}
          layout={
            windowSize.width > mobileBreakPoint
              ? ["total", "-", "limit", "|", "pager", "skip"]
              : ["pager", "limit"]
          }
          maxButtons={5}
        />
      )}
      <DrawerView
        user={user}
        open={showDrawer}
        handleModalSubmit={(data: ManualTrade) => handleSubmit(data)}
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
