var port,
  textEncoder,
  writableStreamClosed,
  writer,
  historyIndex = -1;
const lineHistory = [];

var neofetch_data = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(@@\/(@@@&#@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@#\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@(@@@@@@@@@(@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@\/@\/(@%\/@\/@@\/@@@@@\/@@\/@@\/@@@@@@@(@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@#@@\/#@@&@@@@\/@@#&%\/&\/@@@@\/@@@\/%(((@%@@@@@@@@@@@@@#@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@\/&\/\/&\/\/@@@@&@@@@@@\/@@(\/\/&\/@@@@\/@@@%@&(@@(@@@@#@@@@%\/@@@@@@@@@@@@@@@\r\n@@@#\/%@@@@@@@@@#@@%(@\/@@@@@@#@@@\/@\/@@@\/%@(\/&#@@@@@\/@@@\/%#@@@&\/\/\/\/\/@@\/\/@@@@@@@@@@\r\n@@@@@@@@#\/\/\/\/\/&\/@@\/@@@\/@@\/@@@\/@@@\/(@@@@\/@@@@@@\/#\/\/\/\/@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@\r\n@@@@@@@@@@\/\/\/@@(\/\/\/\/\/\/\/\/\/\/\/(\/#\/\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@\r\n@@@@@@@@@@@@\/\/%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/%@@@@@@@@@@@@\r\n@@@@@@@@@@@@@#\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/\/@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@(\/\/&@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/(%@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@%@@&%@#%#&%@&%@@#@@@@(((@%@&&####@#@(#@@%@@#@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`;

var contributors = [
  `                      _                     _ \r\n                     (_)                   | |\r\n  _ __ ___  _ __ ___  _ ___  ___ ___   ___ | |\r\n | \'_ \` _ \\| \'_ \` _ \\| \/ __|\/ __\/ _ \\ \/ _ \\| |\r\n | | | | | | | | | | | \\__ \\ (_| (_) | (_) | |\r\n |_| |_| |_|_| |_| |_|_|___\/\\___\\___\/ \\___\/|_|\r\n                                             `,
  `  ______                  _______ _    _ ______ _                \r\n |___  \/                 |__   __| |  | |  ____| |               \r\n    \/ \/ __ _ _ __  _____   _| |  | |__| | |__  | |__   __ _ _ __ \r\n   \/ \/ \/ _\` | \'_ \\|_  \/ | | | |  |  __  |  __| | \'_ \\ \/ _\` | \'__|\r\n  \/ \/_| (_| | | | |\/ \/| |_| | |  | |  | | |____| |_) | (_| | |   \r\n \/_____\\__,_|_| |_\/___|\\__, |_|  |_|  |_|______|_.__\/ \\__,_|_|   \r\n                        __\/ |                                    \r\n                       |___\/                                    `,
];

const terminal = new Terminal({
  theme: {
    background: "#202225",
    cursor: "#ffffff",
    selection: "#ffffff",
  },
  cursorBlink: true,
  cursorStyle: "underline",
  disableStdin: false,
  fontFamily: "monospace",
  fontSize: 14,
  fontWeight: "normal",
  fontWeightBold: "bold",
  renderType: "canvas",
});

terminal.open(document.getElementById("terminal"));

async function connectSerial() {
  try {
    // Prompt user to select any serial port.
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: document.getElementById("baud").value });
    await port.setSignals({
      dataTerminalReady: document.getElementById("rtsOn").value,
      requestToSend: document.getElementById("dtrOn").value,
    });
    listenToPort();

    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

    writer = textEncoder.writable.getWriter();
  } catch {
    alert("Serial Connection Failed");
  }
}

async function sendCharacterNumber() {
  document.getElementById("lineToSend").value = String.fromCharCode(
    document.getElementById("lineToSend").value
  );
}

async function sendSerialLine() {
  dataToSend = document.getElementById("lineToSend").value;
  lineHistory.unshift(dataToSend);
  historyIndex = -1; // No history entry selected
  if (document.getElementById("carriageReturn").checked == true)
    dataToSend = dataToSend + "\r";
  if (document.getElementById("addLine").checked == true)
    dataToSend = dataToSend + "\n";
  if (document.getElementById("echoOn").checked == true)
    if (
      dataToSend === "clear" ||
      dataToSend === "clear\r\n" ||
      dataToSend === "clear\r" ||
      dataToSend === "clear\n"
    )
      advancedTerminalClear();
    else appendToAdvancedTerminal(dataToSend);
  if (
    dataToSend === "clear" ||
    dataToSend === "clear\r\n" ||
    dataToSend === "clear\r" ||
    dataToSend === "clear\n"
  )
    advancedTerminalClear();
  if (
    dataToSend === "neofetch" ||
    dataToSend === "neofetch\r\n" ||
    dataToSend === "neofetch\r" ||
    dataToSend === "neofetch\n"
  )
    printToConsole(neofetch_data, 32, false);
  if (
    dataToSend === "contributors" ||
    dataToSend === "contributors\r\n" ||
    dataToSend === "contributors\r" ||
    dataToSend === "contributors\n"
  )
    printToConsole(contributors, "33", true);
  //await writer.write(dataToSend);
  document.getElementById("lineToSend").value = "";
  //await writer.releaseLock();
}

function printToConsole(data, color, array) {
  if (array == true) {
    for (var i = 0; i < data.length; i++) {
      terminal.writeln(`\x1B[1;3;${color}m${data[i]}\x1B[0m`);
    }
  } else {
    terminal.writeln(`\x1B[1;3;${color}m${data}\x1B[0m`);
  }
}

async function listenToPort() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  // Listen to data coming from the serial device.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      //reader.releaseLock();
      break;
    }
    // value is a string.
    //appendToTerminal(value);
    appendToAdvancedTerminal(value);
  }
}

const serialResultsDiv = document.getElementById("serialResults");

async function appendToAdvancedTerminal(newStuff) {
  terminal.write("\x1B[1;3;34m:~$\x1B[0m " + newStuff);
}

async function advancedTerminalClear() {
  terminal.clear();
}

async function appendToTerminal(newStuff) {
  serialResultsDiv.innerHTML += newStuff;
  if (serialResultsDiv.innerHTML.length > 3000)
    serialResultsDiv.innerHTML = serialResultsDiv.innerHTML.slice(
      serialResultsDiv.innerHTML.length - 3000
    );

  //scroll down to bottom of div
  serialResultsDiv.scrollTop = serialResultsDiv.scrollHeight;
}

function scrollHistory(direction) {
  // Clamp the value between -1 and history length
  historyIndex = Math.max(
    Math.min(historyIndex + direction, lineHistory.length - 1),
    -1
  );
  if (historyIndex >= 0) {
    document.getElementById("lineToSend").value = lineHistory[historyIndex];
  } else {
    document.getElementById("lineToSend").value = "";
  }
}

document
  .getElementById("lineToSend")
  .addEventListener("keyup", async function (event) {
    if (event.keyCode === 13) {
      sendSerialLine();
    } else if (event.keyCode === 38) {
      // Key up
      scrollHistory(1);
    } else if (event.keyCode === 40) {
      // Key down
      scrollHistory(-1);
    }
  });

document.getElementById("baud").value =
  localStorage.baud == undefined ? 9600 : localStorage.baud;
document.getElementById("addLine").checked =
  localStorage.addLine == "false" ? false : true;
document.getElementById("carriageReturn").checked =
  localStorage.carriageReturn == "false" ? false : true;
document.getElementById("echoOn").checked =
  localStorage.echoOn == "false" ? false : true;
document.getElementById("rtsOn").checked =
  localStorage.rtsOn == "false" ? false : true;
document.getElementById("dtrOn").checked =
  localStorage.dtrOn == "false" ? false : true;
