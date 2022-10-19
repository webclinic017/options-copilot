export const getPagination = (page: number, size: number) => {
  const pageStart = page ? (page - 1) * size : 0;

  const pageEnd = page ? page * size - 1 : size;

  return { pageStart, pageEnd };
};

export const getTradeRangeTime = (dateRange: Date[]) => {
  const marketHourOpen = 9;
  const marketHourClose = 16; // Militaray 24Hr Format
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  startDate.setHours(marketHourOpen);
  endDate.setHours(marketHourClose);

  return { startDate, endDate };
};
