import { TradeData } from "@/interfaces/trade";

export const mergeDuplicateTrade = (tradeArray: TradeData[]) =>
  tradeArray
    .sort(
      (a, b) =>
        new Date(a?.date_time).getTime() - new Date(b?.date_time).getTime()
    )
    .reduce((accumulator, currentValue, currentIndex) => {
      if (currentIndex == 0) accumulator.push(currentValue);
      else {
        if (
          currentValue.date_time ===
            accumulator[accumulator.length - 1].date_time &&
          currentValue.contract_id ===
            accumulator[accumulator.length - 1].contract_id
        ) {
          let updatedQuantity =
            currentValue.quantity +
            accumulator[accumulator.length - 1].quantity;
          accumulator[accumulator.length - 1] = {
            ...accumulator[accumulator.length - 1],
            quantity: updatedQuantity,
          };
        } else {
          accumulator.push(currentValue);
        }
      }
      return accumulator;
    }, []);
