import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  defaultControls,
  flashUser,
  generateRandomCoordinates,
  triggerMode,
  reversedControls,
  wizz,
  netherPortal,
} from "../../utils/utils";
import GameOver from "../GameOver/GameOver";
import useStore from "../../utils/store";
import Submit from "../Submit/Submit";
import Scoreboard from "../Scoreboard/Scoreboard";

const Board = () => {
  const { mode, removeMode } = useStore();
  const [paused, setPaused] = useState(false);
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [30, 0],
  ]);

  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);

  const [hasEnteredResults, setHasEnteredResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [score, setScore] = useState(0);
  const [death, setDeath] = useState(0);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const trapTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);

  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);

    setDeath(death + 1);

    const video = document.getElementById("die-video");
    video.style.display = "block";
    video.style.filter = "brightness(0.5)";

    video.currentTime = 0;
    video.play();

    setGameOver(true);
  };

  const isOutOfBorder = (head) => {
    if (head[0] >= 1000 || head[1] >= 1000 || head[0] < 0 || head[1] < 0) {
      return true;
    } else {
      return false;
    }
  };

  const hasEatenItem = ({ getter, setter }) => {
    const head = snakeData[snakeData.length - 1];


    const item = getter.find(
      (_item) => _item.x === head[0] && _item.y === head[1]
    );

    if (item) {



      const newItemArray = getter.filter((_item) => _item !== item);

      setter(newItemArray);

      return true;
    } else {
      return false;
    }
  };

  const moveSnake = () => {
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 30, head[1]];

        break;
      case "LEFT":
        head = [head[0] - 30, head[1]];

        break;
      case "DOWN":
        head = [head[0], head[1] + 30];

        break;
      case "UP":
        head = [head[0], head[1] - 30];

      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    const snakeCollapsed = hasCollapsed(head);
    const outOfBorder = isOutOfBorder(head);
    const snakeAteFood = hasEatenItem({
      getter: foodArray,
      setter: setFoodArray,
    });
    const snakeAteTrap = hasEatenItem({
      getter: trapArray,
      setter: setTrapArray,
    });


    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteTrap === true) {
        const effects = [flashUser, triggerMode, wizz, netherPortal];

        const selectedEffect =
          effects[Math.floor(Math.random() * effects.length)];

        selectedEffect();
      }
      if (snakeAteFood === true) {
        newSnakeData.unshift([]);

        setScore(score + 10);

        if (speed > 0.05) {
          setSpeed(speed - 0.02);
        }
      }
      setSnakeData(newSnakeData);
    }
  };

  const hasCollapsed = (head) => {
    let snake = [...snakeData];

    snake.pop();

    for (let i = 0; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        return true;
      }
    }

    return false;
  };

  const onKeyDown = (e) => {
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction);
  };

  const addItem = ({ getter, setter }) => {
    const coordinates = generateRandomCoordinates(mode);

    const array = [...foodArray, ...trapArray];

    const itemAlreadyExistsHere = array.some(
      (item) => item.x === coordinates.x && coordinates.y === item.y
    );

    if (itemAlreadyExistsHere) {
      addItem({ getter, setter });
      return;
    }

    setter((oldArray) => [...oldArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;
    trapTimer.current += deltaTime * 0.001;

    if (foodTimer.current > 2 && foodArray.length < 20) {
      foodTimer.current = 0;
      addItem({
        getter: foodArray,
        setter: setFoodArray,
      });
    }

    if (trapTimer.current > 3 && trapArray.length < 10) {
      trapTimer.current = 0;
      addItem({
        getter: trapArray,
        setter: setTrapArray,
      });
    }

    if (timer.current > (mode.includes("impossible") ? 0.02 : speed)) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
  };

  const replay = () => {

    removeMode("corner");
    removeMode("impossible");
    removeMode("reversed");

    const video = document.getElementById("die-video");
    video.style.display = "none";
    video.pause();

    setGameOver(false);
    setHasEnteredResults(false);
    setSpeed(0.2);
    setScore(0);

    setSnakeData([
      [0, 0],
      [30, 0],
    ]);
    setFoodArray([]);
    setTrapArray([]);

    direction.current = "RIGHT";

    timer.current = 0;

    foodTimer.current = 0;
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    gsap.ticker.add(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(gameLoop);
    };
  }, [snakeData]);

  return (
    <>
      {gameOver && <GameOver replay={replay} />}
      {gameOver && !hasEnteredResults && (
        <Submit
          score={score}
          death={death}
          setHasEnteredResults={setHasEnteredResults}
        />
      )}
      {gameOver && <Scoreboard />}

      <div id="board" className={s.board}>
        <Snake data={snakeData} direction={direction.current} />

        <span className={s.score}>Score: {score}</span>

        <span className={s.death}>Death: {death}</span>

        {foodArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="food" />
        ))}

        {trapArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="trap" />
        ))}
      </div>
    </>
  );
};

export default Board;
