import { useAtom } from "jotai";
import { sortType } from "src/atoms";

type Props = {
  value: "symbol" | "date" | "quantity" | "trade_price" | "pnl_realized";
  label: string;
};

const TradeHeader = ({ value, label }: Props) => {
  const [sort, setSortType] = useAtom(sortType);
  const handleTableSort = () =>
    setSortType({ name: value, ascending: !sort.ascending });
  return (
    <div
      className="inline-flex w-full  items-center justify-between cursor-pointer select-none"
      onClick={() => handleTableSort()}
    >
      {label}
      {sort.name === value && (
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className={`w-3 h-3 ${sort.ascending ? "" : "rotate-180"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default TradeHeader;
