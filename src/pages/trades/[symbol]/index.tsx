import React from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import {
  fetchTradesById,
  fetchTradeTags,
  fetchTradeTagsByContract,
} from "@/hooks/TradeDetails/useTradeDetails";
import { supabase } from "@/utils/supabaseClient";
import { useTradeDetails } from "@/hooks/TradeDetails/useTradeDetails";
import dynamic from "next/dynamic";
import TradeDetails from "@/components/UI/TradeDetails";

const CandleStick = dynamic(() => import("@/components/Chart/CandleStick"), {
  ssr: false,
});

const TradeDetailsPage = ({
  initialTradeData,
  tradeTags,
  contractTradeTags,
}) => {
  const router = useRouter();
  const { symbol, contract_id, date_time } = router.query;

  const results = useTradeDetails(
    symbol,
    contract_id,
    date_time,
    initialTradeData,
    tradeTags,
    contractTradeTags
  );

  const [stockInfo, tradeInfo, candleInfo, tradeTagInfo, contractTagInfo] =
    results;
  const { data: stockData } = stockInfo;
  const { data: tradeData } = tradeInfo;
  const { data: tradeTagData } = tradeTagInfo;
  const { data: contractTagData } = contractTagInfo;

  return (
    <Layout>
      <button type="button" onClick={() => router.back()}>
        Click here to go back
      </button>
      <div className="flex flex-col lg:flex-row h-[46rem] space-y-5">
        <TradeDetails
          tradeData={tradeData}
          stockData={stockData}
          tradeTags={tradeTagData}
          contractTags={contractTagData}
        />
        {candleInfo.data && (
          <div className="order-first lg:order-last">
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

  const tradeTags = await fetchTradeTags(user.id);

  const contractTradeTags = await fetchTradeTagsByContract(
    contract_id,
    user.id,
    date_time
  );

  return { props: { initialTradeData, tradeTags, contractTradeTags } };
}

export default TradeDetailsPage;
