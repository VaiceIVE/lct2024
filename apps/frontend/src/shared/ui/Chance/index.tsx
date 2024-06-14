interface ChanceProps {
  value: number;
}

export const Chance = ({ value }: ChanceProps) => {
  if (value <= 20) return <p className="text medium placeholder">{value}%</p>;

  if (value < 80) return <p className="text medium blue">{value}%</p>;

  return <p className="text medium orange">{value}%</p>;
};
