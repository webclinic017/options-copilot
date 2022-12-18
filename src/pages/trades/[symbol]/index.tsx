import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { supabase } from "@/utils/supabaseClient";
import {
  useTradeDetails,
  fetchTradesById,
  fetchTradeTags,
  fetchTradeTagsByContract,
} from "@/hooks/TradeDetails/useTradeDetails";
import dynamic from "next/dynamic";
import TradeDetails from "@/components/UI/TradeDetails";
import { TradeTag, ContractTag } from "@/interfaces/trade";

const CandleStick = dynamic(() => import("@/components/Chart/CandleStick"), {
  ssr: false,
});

const TradeDetailsPage = ({
  initialTradeData,
  allTags,
  tradeTags,
}: {
  initialTradeData: any;
  allTags: TradeTag;
  tradeTags: ContractTag;
}) => {
  const router = useRouter();
  const { symbol, contract_id, date_time } = router.query;

  const results = useTradeDetails(
    symbol,
    contract_id,
    date_time,
    initialTradeData,
    allTags,
    tradeTags
  );

  const [stockInfo, tradeInfo, candleInfo, allTagInfo, contractTagInfo] =
    results;

  return (
    <Layout>
      <button type="button" onClick={() => router.back()}>
        Click here to go back
      </button>
      <div className="flex flex-col lg:flex-row h-[46rem] space-y-5">
        <TradeDetails
          tradeData={tradeInfo.data}
          stockData={stockInfo.data}
          allTags={allTagInfo.data}
          contractTags={contractTagInfo.data}
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

  let [initialTradeData, allTags, tradeTags] = await Promise.all([
    fetchTradesById(contract_id, date_time, user.id),
    fetchTradeTags(user.id),
    fetchTradeTagsByContract(contract_id, user.id, date_time),
  ]);

  return { props: { initialTradeData, allTags, tradeTags } };
}

export default TradeDetailsPage;
