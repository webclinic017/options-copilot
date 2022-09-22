import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../components/Layout";
import { useTrades } from "../../hooks/useTrades";
import { supabase } from "../../utils/supabaseClient";
import TradeTable from "../../components/TradeTable";
import ButtonFileUpload from "../../components/ButtonFileUpload";
import { getPagination } from "../../utils/helper";

const trades = ({ user }) => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { tableStart, tableEnd } = getPagination(page, pageSize);
  const { trades, setTrades, addTrade, totalTrades } = useTrades(
    user,
    tableStart,
    tableEnd
  );

  const disablePrevButton = useMemo(() => page <= 1, [page]);
  const disableNextButton = useMemo(
    () => page >= Math.ceil(totalTrades / pageSize),
    [page, totalTrades]
  );

  return (
    <Layout>
      <div className="md:flex justify-between space-y-5 md:space-y-0  ">
        <div className="text-3xl font-bold">Trade History</div>
        <ButtonFileUpload
          user={user}
          addTrade={addTrade}
          setTrades={setTrades}
          setDataLoaded={setDataLoaded}
        />
      </div>

      <TradeTable trades={trades} dataLoaded={dataLoaded} />
      <div className="flex flex-col items-center mt-12 space-y-5">
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
