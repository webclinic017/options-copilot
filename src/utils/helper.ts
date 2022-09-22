export const getPagination = (page: number, size: number) => {
  const tableStart = page ? (page - 1) * size : 0;

  const tableEnd = page ? page * size - 1 : size;

  return { tableStart, tableEnd };
};
