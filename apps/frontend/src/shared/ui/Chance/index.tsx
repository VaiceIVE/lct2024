interface ChanceProps {
  value: number;
}

export const Chance = ({ value }: ChanceProps) => {
  const returnValue = value * 100;

  if (returnValue <= 20)
    return <p className="text medium placeholder">{returnValue.toFixed(0)}%</p>;

  if (returnValue < 80)
    return <p className="text medium blue">{returnValue.toFixed(0)}%</p>;

  return <p className="text medium orange">{returnValue.toFixed(0)}%</p>;
};
