import s from "./GameOver.module.scss";

const GameOver = ({ replay }) => {
  return (
    <div>
      <button onClick={replay} className={s.btn}>
        Replay
      </button>
    </div>
  );
};

export default GameOver;
