const Letter = ({
  ch,
  active,
  callback,
}: {
  ch: String;
  active: boolean;
  callback(s: String): void;
}) => {
  const clickAudio = new Audio('assets/sfx/keyboardClick.mp3');
  clickAudio.volume = 0.5;

  const handleClick = (ch: String) => {
    clickAudio.play();
    callback(ch);
  };

  return active ? (
    <span className="Letter" onClick={() => handleClick(ch)}>
      {ch}
    </span>
  ) : (
    <span className="Letter disabled">
      {ch}
    </span>
  );
};

export const LettersRow = ({
  chars,
  guesses,
  callback,
}: {
  chars: String;
  guesses: String[];
  callback(s: String): void;
}) => {
  return (
    <div className="LettersRow" >
      {chars.split("").map((val, idx, ra) => (
        <Letter ch={val} active={!guesses.includes(val)} callback={callback} />
      ))}
    </div>
  );
};

export const GameKeyboard = ({
  guesses,
  callback,
}: {
  guesses: String[];
  callback(s: String): void;
}) => {
  const qwertyRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  return (
    <div className="GameKeyboard">
      {qwertyRows.map((chars) => (
        <LettersRow chars={chars} guesses={guesses} callback={callback} />
      ))}
    </div>
  );
};
