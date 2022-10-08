import React from "react";
import SortIcon from "@rsuite/icons/Sort";
import ArrowUpLineIcon from "@rsuite/icons/ArrowUpLine";
import ArrowDownLineIcon from "@rsuite/icons/ArrowDownLine";

interface Props {
  sortOrder: any;
  setSortOrder: (data: {}) => void;
  fieldName: string;
}

const SortIconButton = ({ sortOrder, setSortOrder, fieldName }: Props) => {
  return sortOrder.name === fieldName && sortOrder.ascending ? (
    <ArrowUpLineIcon
      className="text-[1rem] right-0 absolute"
      fill="#0783ff"
      onClick={() =>
        setSortOrder({
          ...sortOrder,
          name: fieldName,
          ascending: false,
        })
      }
    />
  ) : sortOrder.name === fieldName && !sortOrder.ascending ? (
    <ArrowDownLineIcon
      className="text-[1rem] right-0 absolute"
      fill="#0783ff"
      onClick={() =>
        setSortOrder({
          ...sortOrder,
          name: "date_time",
          ascending: true,
        })
      }
    />
  ) : (
    <SortIcon
      className="text-[1rem] right-0 absolute"
      onClick={() =>
        setSortOrder({
          ...sortOrder,
          name: fieldName,
          ascending: true,
        })
      }
    />
  );
};

export default SortIconButton;
