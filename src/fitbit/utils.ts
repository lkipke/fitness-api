export const pad0 = (num: number) => {
  let numStr = `${num}`;
  if (numStr.length < 2) {
    return '0' + numStr;
  }

  return numStr;
};

export const formatDate = (date: Date) => {
  return `${pad0(date.getFullYear())}-${pad0(date.getMonth() + 1)}-${pad0(
    date.getDate()
  )}`;
};

export const formatTime = (d: Date) => {
  return `${pad0(d.getHours())}:${pad0(d.getMinutes())}`;
};
