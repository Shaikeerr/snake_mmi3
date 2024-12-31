import uniqid from "uniqid";
import gsap from "gsap";
import useStore from "./store";

const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");

let flashTween = null;

// window.location.href = "https://google.com";
export const netherPortal = () => {
  const video = document.getElementById("nether-video");
  video.style.display = "block";

  setTimeout(() => {
    video.style.display = "none";
  }, 3000);
};

export const flashUser = () => {
  if (flashTween) flashTween.kill();

  flashbangAudio.currentTime = 0;
  flashbangAudio.play();
  document.querySelector(".flashbang").style.opacity = "1";

  flashTween = gsap.to(".flashbang", {
    opacity: 0,
    duration: 2,
    delay: 0.25,
  });
};

export const triggerMode = () => {
  const modes = ["impossible", "corner", "reversed"];
  const selectedMode = modes[Math.floor(Math.random() * modes.length)];

  // déclenche le mode sélectionné aléatoirement
  useStore.getState().addMode(selectedMode);

  setTimeout(() => {
    useStore.getState().removeMode(selectedMode);
  }, 1000);
};

export const wizz = () => {
  gsap.to("#board", {
    duration: 0.05,
    x: "+=30%",
    yoyo: true,
    repeat: 9,
  });
};

export const reversedControls = (e, direction) => {
  switch (e.keyCode) {
    //touche du haut
    case 38:
      // console.log("going up");
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const defaultControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
      // console.log("going up");
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const generateRandomCoordinates = (mode) => {
  // console.log("generate random");
  const id = uniqid();
  let min = 0;
  let max = 30;
  let x, y;

  if (mode.includes("corner")) {
    // logique pour générer des coordonnées uniquement sur les côtés
    const side = Math.random();
    console.log(side);

    if (side <= 0.25) {
      console.log("generate left");
      //générer à gauche
      x = min;
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      y *= 30;
    } else if (side > 0.25 && side <= 0.5) {
      console.log("generate right");
      //générer à droite
      x = max * 30;
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      y *= 30;
    } else if (side > 0.5 && side <= 0.75) {
      console.log("generate bottom");
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      x *= 30;

      y = max * 30;
      //générer en bas
    } else if (side > 0.75) {
      console.log("generate top");
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      x *= 30;

      y = min;
      //générer en haut
    }

    // console.log(side);
  } else {
    // logique classique
    x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

    x *= 30;

    y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

    y *= 30;
  }

  // console.log(x, y);

  return { x, y, id };
};
