const convertTimestampToDate = (timestamp: any) => {
  const date = new Date(parseInt(timestamp, 10));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default convertTimestampToDate;
