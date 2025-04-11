const ratioOptions = [
  {
    id: "16:9",
    value: 16 / 9,
  },
  {
    id: "4:3",
    value: 4 / 3,
  },
  {
    id: "1:1",
    value: 1,
  },
  {
    id: "9:16",
    value: 9 / 16,
  },
  {
    id: "3:2",
    value: 3 / 2,
  },
];

export default ratioOptions;

export const getRatio = (id: string) => {
  const option = ratioOptions.find((option) => option.id === id);
  return option ? option.value : 1;
};
