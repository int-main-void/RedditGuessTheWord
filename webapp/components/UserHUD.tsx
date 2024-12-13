export default function UserHUD({
  points,
  gamePoints,
}: {
  points: number;
  gamePoints: number;
}): JSX.Element {
  var displayPoints = Number(points) + Number(gamePoints);
  return (
    <div className="UserHUD">
      <img className="pointsIcon" src="/assets/images/goldcoin.png" />
      {displayPoints}
    </div>
  );
}
