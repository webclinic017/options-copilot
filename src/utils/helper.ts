export const getPagination = (page: number, size: number) => {
  const pageStart = page ? (page - 1) * size : 0;

  const pageEnd = page ? page * size - 1 : size;

  return { pageStart, pageEnd };
};
