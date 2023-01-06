import { useAtom } from "jotai";
import Image from "next/image";
import { sortedTrades } from "src/atoms";

export const TradeTable = () => {
  const [trades] = useAtom(sortedTrades);

  return (
    <div className="overflow-x-auto w-full h-[46rem] mt-10">
      {trades.length ? (
        <table data-theme="" className="table table-zebra w-full">
          <thead className="">
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Symbol</th>
              <th>Date/Time</th>
              <th>
                Volume <br />
                Traded
              </th>
              <th>Price</th>
              <th>PnL</th>
              <th>{trades.length}</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="hover cursor-pointer"
                onClick={() => alert(JSON.stringify(trade))}
              >
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  {trade.symbol}
                  <br />
                  <span className="badge badge-sm badge-ghost">
                    {trade.contract_id}
                  </span>
                </td>
                <td> {trade.date_time.replace("T", " ")}</td>
                <td className="">{trade.quantity}</td>
                <td>{trade.trade_price}</td>
                <td className="text-green-500">{trade.pnl_realized}</td>
                <th>
                  <button className="btn btn-ghost btn-xs">View</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center -space-y-10">
          <Image
            src="https://rsuite-admin-template.vercel.app/d6adac113dc4b6b20658fd12c480f4e4.svg"
            alt="No Data"
            layout="fixed"
            width={400}
            height={500}
          />
          <div className="animate-pulse text-white">No Trades Found</div>
        </div>
      )}
    </div>
  );
};
