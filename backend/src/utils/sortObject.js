export const sortObject = (obj) => {
    const sorted = {};
    Object.keys(obj).sort().forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  };