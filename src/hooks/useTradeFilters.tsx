import { useState, useMemo } from "react";

type sortFilter = {
  name: string;
  ascending: boolean;
  dateRange?: null | [Date, Date];
};

const useTradeFilters = () => {
  const [sortOrder, setSortOrder] = useState<sortFilter>({
    name: "date_time",
    ascending: false,
    dateRange: null,
  });

  return useMemo(
    () => ({ sortOrder, setSortOrder }),
    [sortOrder, setSortOrder]
  );
};

export default useTradeFilters;
