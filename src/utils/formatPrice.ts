export const formatPrice = (amount: string) => {
  const amountNumber = parseInt(amount);
  if (isNaN(amountNumber) || amountNumber < 0) return "";

  const amountInToman = Math.floor(amountNumber);

  const formatUnits = [
    {
      unit: "تریلیون تومان",
      value: Math.floor(amountInToman / 1_000_000_000_000),
    },
    {
      unit: "میلیارد تومان",
      value: Math.floor((amountInToman % 1_000_000_000_000) / 1_000_000_000),
    },
    {
      unit: "میلیون تومان",
      value: Math.floor((amountInToman % 1_000_000_000) / 1_000_000),
    },
    {
      unit: "هزار تومان",
      value: Math.floor((amountInToman % 1_000_000) / 1_000),
    },
    { unit: "تومان", value: amountInToman % 1_000 },
  ];

  return formatUnits
    .filter((item) => item.value > 0)
    .map((item) => `${item.value.toLocaleString("fa-IR")} ${item.unit}`)
    .join(" و ");
};
