import useStore from "../../utils/store";
import s from "./Snake.module.scss";


const Snake = ({ data, direction }) => {
  const getStyle = (dot, i) => {
    const spriteSize = 30;

    const isHead = i === data.length - 1;

    let posX = 0, posY = 0;

    if (isHead) {
      switch (direction) {
        case "UP":
          posX = 0;
          posY = 0;
          break;
        case "DOWN":
          posX = spriteSize;
          posY = 0;
          break;
        case "LEFT":
          posX = 2 * spriteSize;
          posY = 0;
          break;
        case "RIGHT":
          posX = 3 * spriteSize;
          posY = 0;
          break;
        default:
          posX = 0;
          posY = 0;
      }
    } else {
      const currentDot = dot;
      const nextDot = data[i + 1]; 

      if (nextDot) {
        const dx = currentDot[0] - nextDot[0];
        const dy = currentDot[1] - nextDot[1];

        if (dx === spriteSize && dy === 0) {
          posX = 2 * spriteSize;
          posY = spriteSize;
        } else if (dx === -spriteSize && dy === 0) {
          posX = 3 * spriteSize;
          posY = spriteSize;
        } else if (dx === 0 && dy === spriteSize) {
          posX = 0;
          posY = spriteSize;
        } else if (dx === 0 && dy === -spriteSize) {
          posX = spriteSize;
          posY = spriteSize;
        }
      }
    }

    const style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      backgroundPosition: `-${posX}px -${posY}px`,
    };

    return style;
  };

  return (
    <>
      {data.map((dot, i) => (
        <div key={i} className={s.snakeDot} style={getStyle(dot, i)}></div>
      ))}
    </>
  );
};


export default Snake;





