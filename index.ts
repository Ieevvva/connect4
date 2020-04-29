(() => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  // Rūtiņas izmērs (pikseļos)
  const cellWidth = 70;
  const cellHeight = 70;
  const cellCountY = 6;
  const cellCountX = 7;

  // Rūtiņu krāsas
  const background = "lightgray";
  const rindas: Array<Array<string>> = [];
  const playersPlaceholders = ["lightgreen", "lightyellow"];
  const players = ["green", "yellow"];
  let currentPlayer = 0;

  const placeholder = {
    x: -1,
    y: -1,
    color: "rgba(0,255,0,0.5)"
  };

  function getTargetCoordinates(mouseX: number, mouseY: number) {
    // rindas[????][mouseX] === "transparent";

    let result = { targetX: mouseX, targetY: 5 };

    for (let i = 5; i >= 0; i--) {
      if (rindas[i][mouseX] != "transparent") {
        result.targetY = i - 1;
      }
    }

    // if (rindas[5][mouseX] == "green") {
    //   result.targetY = 4 ;
    // }
    // if (rindas[4][mouseX] == "green") {
    //   result.targetY = 3;
    // }
    // if (rindas[3][mouseX] == "green") {
    //   result.targetY = 2;
    // }
    // if (rindas[2][mouseX] == "green") {
    //   result.targetY = 1;
    // }
    // if (rindas[1][mouseX] == "green") {
    //   result.targetY = 0;
    // }
    //  if (rindas[0][mouseX] == "green") {
    //     result.targetY = -1;
    //   }

    return result;
  }

  function clickHandler(x: number, y: number) {
    const target = getTargetCoordinates(x, y);
    if (target && target.targetY > -1) {
      rindas[target.targetY][target.targetX] = players[currentPlayer];


      // check for win


      currentPlayer = (currentPlayer + 1) % players.length;

      moveHandler(x, y);
    }
  }

  function moveHandler(x: number, y: number) {
    const target = getTargetCoordinates(x, y);

    placeholder.x = target.targetX;
    placeholder.y = target.targetY;
    placeholder.color = playersPlaceholders[currentPlayer];
  }

  // Sākotnējā masīva izveide un aizpilde
  for (let y = 0; y < cellCountY; y++) {
    rindas.push([]);
    for (let x = 0; x < cellCountX; x++) {
      rindas[y].push("transparent");
    }
  }
  // sākotnējā zīmēšana
  drawAll();

  canvas.onclick = function(event) {
    // pārvērš peles koordinātas uz rūtiņas X/Y
    clickHandler(
      Math.floor(event.offsetX / cellWidth),
      Math.floor(event.offsetY / cellHeight)
    );
    drawAll();
  };
  canvas.onmousemove = function(event) {
    // pārvērš peles koordinātas uz rūtiņas X/Y
    moveHandler(
      Math.floor(event.offsetX / cellWidth),
      Math.floor(event.offsetY / cellHeight)
    );
    drawAll();
  };

  function drawAll() {
    canvas.width = cellCountX * cellWidth + 1;
    canvas.height = cellCountY * cellHeight + 1;

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    // visas rūtiņas uzzīmē
    for (let y = 0; y < cellCountY; y++) {
      for (let x = 0; x < cellCountX; x++) {
        draw(x, y, rindas[y][x]);
      }
    }

    if (placeholder.x >= 0 && placeholder.y >= 0) {
      draw(placeholder.x, placeholder.y, placeholder.color);
    }
  }

  function draw(x: number, y: number, color: string) {
    const context = canvas.getContext("2d");

    context.fillStyle = background;
    context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(
      x * cellWidth + 0.5,
      y * cellHeight + 0.5,
      cellWidth,
      cellHeight
    );

    // uzzīmē apli
    if (color !== "transparent") {
      context.beginPath();
      context.fillStyle = color;
      context.strokeStyle = "#444";
      context.lineWidth = 2;
      context.arc(
        x * cellWidth + cellWidth / 2 + 0.5,
        y * cellHeight + cellHeight / 2 + 0.5,
        Math.min(cellWidth, cellHeight) / 2.3,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
    }
  }
})();
