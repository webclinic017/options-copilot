import React from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { BackButton } from "@/components/Buttons/BackButton";
import Layout from "@/components/Layout";
import {
  useTradeDetails,
  fetchTradeTags,
  fetchTradeTagsByContract,
  useGetTradesById,
} from "@/features/tradeDetails/api";
import {
  TradeDetails,
  TradeTagContainer,
} from "@/features/tradeDetails/components";
import { TradeTag, ContractTag, TradeData } from "@/interfaces/trade";
import { supabase } from "@/utils/supabaseClient";

const CandleStick = dynamic(() => import("@/components/Chart/CandleStick"), {
  ssr: false,
});

type Props = {
  initialTradeData?: {
    trades: TradeData[];
    count: number;
  };
  allTags: TradeTag;
  tradeTags: ContractTag;
};

const TradeDetailsPage = ({ allTags, tradeTags }: Props) => {
  const router = useRouter();
  const { symbol, contract_id, date_time } = router.query;

  const results = useTradeDetails(
    symbol,
    contract_id,
    date_time,
    allTags, // move to atom
    tradeTags // move to atom
  );

  const { data: tradeInfo, isSuccess } = useGetTradesById(
    contract_id,
    date_time
  );

  const [candleInfo, allTagInfo, contractTagInfo] = results;
  const { data: allTagData } = allTagInfo;
  const { data: contractTagData } = contractTagInfo;

  return (
    <Layout>
      <BackButton />
      <div className="flex flex-col lg:flex-row h-[46rem] space-y-5">
        {candleInfo.isSuccess && isSuccess && (
          <>
            <TradeDetails symbol={symbol} tradeData={tradeInfo.trades}>
              <TradeTagContainer
                allTags={allTagData}
                contractTags={contractTagData}
                contractId={contract_id}
                dateTime={date_time}
              />
            </TradeDetails>

            <div className="order-first lg:order-last">
              <CandleStick
                tradeData={tradeInfo.trades}
                candleData={candleInfo.data}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  const { contract_id, date_time } = query;
  const { user } = await supabase.auth.api.getUserByCookie(req);

  let [allTags, tradeTags] = await Promise.all([
    fetchTradeTags(user.id),
    fetchTradeTagsByContract(contract_id, user.id, date_time),
  ]);

  return { props: { allTags, tradeTags } };
}

export default TradeDetailsPage;
