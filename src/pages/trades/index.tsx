import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import { useTrades } from "../../hooks/useTrades";
import { supabase } from "../../utils/supabaseClient";
import TradeTable from "../../components/TradeTable";
import ButtonFileUpload from "../../components/ButtonFileUpload";
import { getPagination } from "../../utils/helper";
import DrawerView from "../../components/DrawerView";
import { ManualTrade } from "../../interfaces/trade";
import { EMPTY_SELECTOR_STATE, INITIAL_PAGE, MAX_PAGE } from "../../constants";

const trades = ({ user }) => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const [page, setPage] = useState(INITIAL_PAGE);
  const [pageSize, setPageSize] = useState(MAX_PAGE);
  const [selectTradeToDelete, setSelectTradeToDelete] = useState<
    number | number[]
  >(EMPTY_SELECTOR_STATE);
  const { tableStart, tableEnd } = getPagination(page, pageSize);
  const { trades, setTrades, addTrade, totalTrades, deleteTrades } = useTrades(
    user,
    tableStart,
    tableEnd
  );

  const disablePrevButton = useMemo(() => page <= INITIAL_PAGE, [page]);
  const disableNextButton = useMemo(
    () => page >= Math.ceil(totalTrades / pageSize),
    [page, totalTrades]
  );

  const handleSubmit = async (formData: ManualTrade) => {
    try {
      const data = await addTrade(formData);

      if (data) {
        setTrades(data);
        setShowDrawer(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteTrade = async (data: number | number[]) => {
    if (!data) return;

    deleteTrades(
      typeof data === "object" ? ["user_id", user.id] : ["id", data]
    );
    setSelectTradeToDelete(EMPTY_SELECTOR_STATE);
  };

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
          <ButtonFileUpload
            user={user}
            addTrade={addTrade}
            setTrades={setTrades}
            setDataLoaded={setDataLoaded}
          />
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

      <TradeTable
        trades={trades}
        hasDataLoaded={dataLoaded}
        selectTradeToDelete={selectTradeToDelete}
        setSelectTradeToDelete={setSelectTradeToDelete}
      />
      {trades.length > 0 && (
        <div className="flex flex-col items-center mt-8 space-y-5">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {tableStart + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {tableEnd > totalTrades ? totalTrades : tableEnd + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalTrades}
            </span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPage(() => page - 1)}
              disabled={disablePrevButton}
              className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover: dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(() => page + 1)}
              disabled={disableNextButton}
              className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
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
