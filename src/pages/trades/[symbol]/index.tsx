import React from "react";

import ArowBackIcon from "@rsuite/icons/ArowBack";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import { TradeDetails } from "@/components/UI/TradeDetails";
import {
  useTradeDetails,
  fetchTradesById,
  fetchTradeTags,
  fetchTradeTagsByContract,
} from "@/hooks/TradeDetails/useTradeDetails";
import { TradeTag, ContractTag } from "@/interfaces/trade";
import { supabase } from "@/utils/supabaseClient";

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
      <button
        onClick={() => router.back()}
        className="hover:bg-gray-700 text-white font-bold w-10 h-10 rounded inline-flex items-center duration-300"
      >
        <div className="ml-3">
          <ArowBackIcon />
        </div>
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
