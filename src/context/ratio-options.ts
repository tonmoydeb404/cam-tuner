const ratioOptions = [
  {
    value: 16 / 9,
    label: "16:9",
  },
  {
    value: 4 / 3,
    label: "4:3",
  },
  {
    value: 1,
    label: "1:1",
  },
  {
    value: 9 / 16,
    label: "9:16",
  },
  {
    value: 3 / 2,
    label: "3:2",
  },
];

export default ratioOptions;

export const getRatio = (value: number) => {
  const option = ratioOptions.find((option) => option.value === value);
  return option;
};
