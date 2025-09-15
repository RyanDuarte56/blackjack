export default function Button({ action, name, isPlayerTurnFinished }) {
  return (
    <button
      className="bg-white text-gray-900 border px-4 py-2 rounded-md cursor-pointer hover:opacity-80 active:opacity-60 disabled:opacity-30 disabled:cursor-default"
      onClick={action}
      disabled={isPlayerTurnFinished}
    >
      {name}
    </button>
  );
}
