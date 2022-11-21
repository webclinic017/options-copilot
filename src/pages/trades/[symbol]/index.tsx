import React from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { fetchTradesById } from "../../../hooks/TradeHooks/useTradeDetails";
import { supabase } from "../../../utils/supabaseClient";
import { useTradeDetails } from "../../../hooks/TradeHooks/useTradeDetails";
import dynamic from "next/dynamic";

const CandleStick = dynamic(
  () => import("../../../components/TradingView/CandleStick"),
  { ssr: false }
);

const TradeDetails = ({ initialTradeData }) => {
  const router = useRouter();
  const { contract_id, date_time, symbol } = router.query;

  const results = useTradeDetails(
    symbol,
    contract_id,
    date_time,
    initialTradeData
  );

  const [stockInfo, tradeInfo, candleInfo] = results;
  const { data: stockData } = stockInfo;
  const { data: tradeData } = tradeInfo;

  const selectedDate = new Date(tradeData.trades[0].date_time);

  const profitOrLoss =
    tradeData.trades.reduce((acc, obj) => {
      return acc + obj.pnl_realized;
    }, 0) ?? 0;

  const totalOptionsTraded =
    tradeData.trades.reduce((acc, obj) => {
      return acc + Math.abs(obj.quantity);
    }, 0) ?? 0;

  return (
    <Layout>
      <button type="button" onClick={() => router.back()}>
        Click here to go back
      </button>
      <div className="flex flex-col lg:flex-row h-[38rem]">
        <div className="bg-gray-800/80 flex-auto min-w-[22rem] px-5">
          <div className="text-xs flex justify-between mt-5">
            Symbol
            <span>Last</span>
          </div>
          <div className="text-base flex justify-between">
            {tradeData.trades[0].symbol}
            {stockData && <span>{stockData.c}</span>}
          </div>

          <div className="text-base mt-5 flex justify-between">
            <span>Date</span>
            {selectedDate.toDateString()}
          </div>

          <div className="text-base mt-5 flex justify-between">
            <div>Contract Desc</div>
            <span>{tradeData.trades[0].description}</span>
          </div>

          <div className="mt-2 text-base flex justify-between">
            NET P&L
            <span
              className={`${
                profitOrLoss > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${profitOrLoss.toFixed(2)}{" "}
            </span>
          </div>
          <div className="mt-2 text-base flex justify-between">
            Options Traded
            <span> {totalOptionsTraded} </span>
          </div>

          <div className="mt-2 text-base flex justify-between">
            Proft Target
          </div>

          <div className="mt-2 text-base flex justify-between">Stop Loss</div>

          <div className="mt-2 text-base flex justify-between">Trade Risk</div>
          <div className="mt-2 text-base flex justify-between">
            Planned R:R Multiple
          </div>
          <div className="mt-2 text-base flex justify-between">
            Realized R:R Multiple
          </div>
          <div className="mt-2 text-base flex justify-between">Setups</div>
          <div className="mt-2 text-base flex justify-between">Mistakes</div>
          <div className="mt-2 text-base flex justify-between">Custom</div>
        </div>
        {candleInfo.data && (
          <div className="order-first md:order-last">
            <CandleStick
              tradeData={tradeInfo.data.trades}
              candleData={candleInfo.data}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  const { contract_id, date_time } = query;
  const { user } = await supabase.auth.api.getUserByCookie(req);

  const initialTradeData = await fetchTradesById(
    contract_id,
    date_time,
    user.id
  );
  return { props: { initialTradeData } };
}

export default TradeDetails;
