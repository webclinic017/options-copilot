import { TradeData } from "@/interfaces/trade";

export const mergeDuplicateTrade = (tradeArray: TradeData[]) =>
  sortByDate(tradeArray).reduce((accumulator, currentValue, currentIndex) => {
    if (currentIndex == 0) accumulator.push(currentValue);
    else {
      if (
        currentValue.date_time ===
          accumulator[accumulator.length - 1].date_time &&
        currentValue.contract_id ===
          accumulator[accumulator.length - 1].contract_id
      ) {
        let updatedQuantity =
          currentValue.quantity + accumulator[accumulator.length - 1].quantity;

        let updatedPnlRealized =
          currentValue.pnl_realized +
          accumulator[accumulator.length - 1].pnl_realized;
        accumulator[accumulator.length - 1] = {
          ...accumulator[accumulator.length - 1],
          quantity: updatedQuantity,
          pnl_realized: updatedPnlRealized,
        };
      } else {
        accumulator.push(currentValue);
      }
    }
    return accumulator;
  }, []);

export const combineDailyTrades = (tradeArray: TradeData[]) =>
  sortByDate(tradeArray).reduce((accumulator, currentValue, currentIndex) => {
    if (currentIndex == 0) accumulator.push(currentValue);
    else {
      if (
        new Date(currentValue.date_time).getDate() ===
          new Date(accumulator[accumulator.length - 1].date_time).getDate() &&
        currentValue.contract_id ===
          accumulator[accumulator.length - 1].contract_id
      ) {
        let updatedQuantity =
          Math.abs(currentValue.quantity) +
          Math.abs(accumulator[accumulator.length - 1].quantity);

        let updatedPnlRealized =
          currentValue.pnl_realized +
          accumulator[accumulator.length - 1].pnl_realized;
        accumulator[accumulator.length - 1] = {
          ...accumulator[accumulator.length - 1],
          quantity: updatedQuantity,
          pnl_realized: updatedPnlRealized,
        };
      } else {
        accumulator.push(currentValue);
      }
    }
    return accumulator;
  }, []);

export const sortByDate = (tradeArray: TradeData[]) =>
  tradeArray.sort(
    (a, b) =>
      new Date(a?.date_time).getTime() - new Date(b?.date_time).getTime()
  );
