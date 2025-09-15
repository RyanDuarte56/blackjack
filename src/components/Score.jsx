export default function Score({ name, score }) {
  return (
    <div className="flex items-center justify-center mb-10 font-bold text-lg">
      <p>
        {name}: {score}
      </p>
    </div>
  );
}
