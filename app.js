
const createField = (rows) => (cols) => {
  const field = document.getElementById("field");
  field.style.setProperty("--grid-rows", rows);
  field.style.setProperty("--grid-cols", cols);

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");

    cell.style.color = "#5607b7";

    field.appendChild(cell).setAttribute("cell", "");
  }
};

createField(12)(32);
const createPlayerElement = (players, playerColor) => {
  const player = document.createElement("span");
  player.innerHTML = players;
  player.classList.add("player", playerColor);

  return player;
};

const createPlayers = () => {

  const angel = createPlayerElement("😇", "angel");
  const devil = createPlayerElement("😈", "devil");

  return [angel, devil];
};

const checkHelper = (ele) => (attrValue) =>
  ele.getAttribute("cell") !== attrValue;

const playersLogic = (playersFunc) => {
  const divs = Array.from(document.querySelectorAll("[cell]"));
  const field = document.querySelector("#field");
  const players = playersFunc();
  const angel = players[0];
  const devil = players[1];
  const usedIndices = new Set();
  let timeOut;
  const callback1 = () => {
    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      field.style.cursor = "pointer";
    }, 200);
  };

  const callback2 = () => {
    clearTimeout(timeOut);
    field.style.userSelect = "none";
    field.style.cursor = "zoom-in";
  };

  const events = [
    ["mousemove", callback1],
    ["mouseout", callback2],
  ];
  events.forEach(([eventType, callback]) =>
    field.addEventListener(eventType, callback)
  );
  divs.forEach((ele) => {
    ele.addEventListener("mouseover", (e) => {
      if (!checkHelper(ele)("devil")) {
        ele.style.cursor = "not-allowed";
      }
    });
  });

  field.addEventListener("click", (e) => {
    const clickedElement = e.target.closest("[cell]");

    if (
      !checkHelper(clickedElement)("angel") ||
      !checkHelper(clickedElement)("devil")
    ) {
      console.log("Event stopped: illegal move.");

      return;
    }
    divs.forEach((element) => {
      if (element.getAttribute("cell") === "angel") {
        element.setAttribute("cell", "");
      }
    });

    const index = divs.indexOf(clickedElement);
    console.log(`Clicked index: ${index}`);
    // Exit the loop if no cells are available
    if (usedIndices.size === divs.length) {
      console.log("No available cells left for the devil.");
      return;
    }

    let devilIndex;
    do {
      devilIndex = Math.floor(Math.random() * divs.length);
    } while (usedIndices.has(devilIndex));

    usedIndices.add(devilIndex);

    console.log(`Random devilIndex value: ${devilIndex}`);

    clickedElement.append(angel);
    angel.closest("div").setAttribute("cell", "angel");

    const targetDiv = divs[devilIndex];
    if (checkHelper(targetDiv)("angel")) {
      divs[devilIndex].append(devil);
      devil.closest("div").setAttribute("cell", "devil");
    }
  });
};
playersLogic(createPlayers);
