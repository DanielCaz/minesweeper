import { TileValue } from "../TileValue";

const Tile = ({
  cell,
  onTileClick,
}: {
  cell: number;
  onTileClick: () => void;
}) => {
  return (
    <td
      style={{
        minWidth: "30px",
        minHeight: "30px",
      }}
      onClick={onTileClick}
      className={`text-center bg-${
        cell === TileValue.Mine
          ? "danger"
          : cell === TileValue.Unopened
          ? "secondary"
          : cell === TileValue.Flagged
          ? "warning"
          : "light"
      }`}
    >
      {cell}
    </td>
  );
};

export default Tile;
