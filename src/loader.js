export const loadData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("my returned data");
    }, 20);
  });
  // return Promise.resolve("my data");
};
