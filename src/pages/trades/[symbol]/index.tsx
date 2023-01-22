import React from "react";

import dynamic from "next/dynamic";

import { BackButton } from "@/components/Buttons/BackButton";
import Layout from "@/components/Layout";
import {
  useGetTradesById,
  useGetStockCandles,
  useGetTradeTags,
} from "@/features/tradeDetails/api";
import {
  TradeDetails,
  TradeTagContainer,
} from "@/features/tradeDetails/components";

const CandleStick = dynamic(() => import("@/components/Chart/CandleStick"), {
  ssr: false,
});

const TradeDetailsPage = ({ symbol, contract_id, date_time }) => {
  const { isSuccess: isTradeSuccess } = useGetTradesById(
    contract_id,
    date_time
  );
  const { isSuccess: isCandlesSuccess } = useGetStockCandles(symbol, date_time);
  const { isSuccess: isTagsFetched } = useGetTradeTags(contract_id, date_time);

  return (
    <Layout>
      <BackButton />
      <div className="flex flex-col lg:flex-row h-[46rem] space-y-5">
        {isCandlesSuccess && isTradeSuccess && isTagsFetched && (
          <>
            <TradeDetails symbol={symbol}>
              <TradeTagContainer
                contractId={contract_id}
                dateTime={date_time}
              />
            </TradeDetails>

            <div className="order-first lg:order-last">
              <CandleStick />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  const { symbol, contract_id, date_time } = query;

  return { props: { symbol, contract_id, date_time } };
}
export default TradeDetailsPage;
