import { useQuery } from "@tanstack/react-query";

export const useGetSymbol = (symbol: string | string[]) => {
  const fetchSymbolInfo = async (symbol: string | string[]) => {
    const data = await (
      await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
      )
    ).json();

    if (!data) {
      throw new Error("Symbol Not Found");
    }
    return data;
  };

  return useQuery(["symbol", symbol], () => fetchSymbolInfo(symbol), {
    refetchOnMount: true,
    keepPreviousData: true,
  });
};
