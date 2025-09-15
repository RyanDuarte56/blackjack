export default function GameOverScreen({ isHandOver, determineResultMessage }) {
  return (
    <div className="flex items-center justify-center font-bold text-2xl">
      {isHandOver && determineResultMessage()}
    </div>
  );
}
