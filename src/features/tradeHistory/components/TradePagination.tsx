import React from "react";

import { useAtom } from "jotai";
import { tradePageAtom } from "src/atoms";

import { PAGE_LIMIT } from "@/constants/index";

interface Props {
  totalTrades: number;
}

export const TradePagination = ({ totalTrades }: Props) => {
  const [currentPage, setCurrentPage] = useAtom(tradePageAtom);

  const pageLimit = Math.ceil(totalTrades / PAGE_LIMIT);

  const tradePages = Array.from(Array(pageLimit), (element, index) => {
    return (
      <li key={index} onClick={() => setCurrentPage(index + 1)}>
        <a>Page {index + 1}</a>
      </li>
    );
  });

  return (
    <div className="btn-group flex justify-center w-full">
      <button
        className={`btn ${currentPage === 1 ? "btn-disabled" : ""}`}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        «
      </button>
      <div className="dropdown dropdown-top">
        <label tabIndex={0} className="btn m-1">
          Page {currentPage}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-44"
        >
          {tradePages}
        </ul>
      </div>
      <button
        className={`btn ${currentPage === pageLimit ? "btn-disabled" : ""}`}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
};
