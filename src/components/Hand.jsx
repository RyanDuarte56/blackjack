import Card from "./Card";

export default function Hand({ hand }) {
  return (
    <div className="flex items-center justify-center mb-5 gap-1">
      {hand.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  );
}
