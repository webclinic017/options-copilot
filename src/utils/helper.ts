export const getPagination = (page: number, size: number) => {
  const pageStart = page ? (page - 1) * size : 0;

  const pageEnd = page ? page * size - 1 : size;

  return { pageStart, pageEnd };
};

/**
 * Returns Object containing two date values one being the time market opens which is 9:30 est
 * and the other being market close 4:00 est -> 16:00 MilitaryTime
 *
 * @param {Date[]} dateRange Array containg date fields
 * @return {startDate, endDate}
 */
export const getTradeRangeTime = (dateRange: Array<string>) => {
  const marketHourOpen = 9;
  const marketMinuteOpen = 30;
  const marketHourClose = 16; // Militaray 24Hr Format
  const marketMinuteClose = 0;
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  startDate.setHours(marketHourOpen);
  startDate.setMinutes(marketMinuteOpen);
  endDate.setHours(marketHourClose);
  endDate.setMinutes(marketMinuteClose);

  return { startDate, endDate };
};

/**
 * Returns unix time stamp in utc default  GMT+0000 format for lightweight charts to display data.
 * Lightweight charts does not have a way of working with different timezones so this was one of the solutions discuseed
 * https://tradingview.github.io/lightweight-charts/docs/time-zones
 *
 * @param {Number} originalUnixTimeStamp timestamp containing local time
 * @return {utcDate: unixTimeStamp}
 */
export const timeToLocal = (originalTime: number) => {
  const utcDate = new Date(originalTime * 1000);
  return (
    Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      utcDate.getHours(),
      utcDate.getMinutes(),
      utcDate.getSeconds(),
      utcDate.getMilliseconds()
    ) / 1000
  );
};
