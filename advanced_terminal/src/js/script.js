var port,
  textEncoder,
  writableStreamClosed,
  writer,
  historyIndex = -1;
const lineHistory = [];
var neofetch_data = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(@@\/(@@@&#@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@#\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@(@@@@@@@@@(@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@\/@\/(@%\/@\/@@\/@@@@@\/@@\/@@\/@@@@@@@(@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@#@@\/#@@&@@@@\/@@#&%\/&\/@@@@\/@@@\/%(((@%@@@@@@@@@@@@@#@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@\/&\/\/&\/\/@@@@&@@@@@@\/@@(\/\/&\/@@@@\/@@@%@&(@@(@@@@#@@@@%\/@@@@@@@@@@@@@@@\r\n@@@#\/%@@@@@@@@@#@@%(@\/@@@@@@#@@@\/@\/@@@\/%@(\/&#@@@@@\/@@@\/%#@@@&\/\/\/\/\/@@\/\/@@@@@@@@@@\r\n@@@@@@@@#\/\/\/\/\/&\/@@\/@@@\/@@\/@@@\/@@@\/(@@@@\/@@@@@@\/#\/\/\/\/@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@\r\n@@@@@@@@@@\/\/\/@@(\/\/\/\/\/\/\/\/\/\/\/(\/#\/\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@\r\n@@@@@@@@@@@@\/\/%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/%@@@@@@@@@@@@\r\n@@@@@@@@@@@@@#\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/\/@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@(\/\/&@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/(%@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@%@@&%@#%#&%@&%@@#@@@@(((@%@&&####@#@(#@@%@@#@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`;
var contributors = [
  `                      _                     _ \r\n                     (_)                   | |\r\n  _ __ ___  _ __ ___  _ ___  ___ ___   ___ | |\r\n | \'_ \` _ \\| \'_ \` _ \\| \/ __|\/ __\/ _ \\ \/ _ \\| |\r\n | | | | | | | | | | | \\__ \\ (_| (_) | (_) | |\r\n |_| |_| |_|_| |_| |_|_|___\/\\___\\___\/ \\___\/|_|\r\n                                             `,
  `  ______                  _______ _    _ ______ _                \r\n |___  \/                 |__   __| |  | |  ____| |               \r\n    \/ \/ __ _ _ __  _____   _| |  | |__| | |__  | |__   __ _ _ __ \r\n   \/ \/ \/ _\` | \'_ \\|_  \/ | | | |  |  __  |  __| | \'_ \\ \/ _\` | \'__|\r\n  \/ \/_| (_| | | | |\/ \/| |_| | |  | |  | | |____| |_) | (_| | |   \r\n \/_____\\__,_|_| |_\/___|\\__, |_|  |_|  |_|______|_.__\/ \\__,_|_|   \r\n                        __\/ |                                    \r\n                       |___\/                                    `
];
var curr_line = "";
const terminal = new Terminal({
  theme: {
    background: "#202225",
    cursor: "#ffffff",
    selection: "#ffffff"
  },
  cursorBlink: true,
  cursorStyle: "underline",
  disableStdin: false,
  fontFamily: "monospace",
  fontSize: 14,
  fontWeight: "normal",
  fontWeightBold: "bold",
  renderType: "canvas"
});
terminal.open(document.getElementById("terminal"));
terminal.prompt = () => {
  terminal.write(
    "\r\n\x1B[1;3;32mdev@cerealterminal\x1B[0m\x1B[1;3;34m:~$\x1B[0m "
  );
};
terminal.writeln("Welcome to the Advanced Browser-based Cereal Terminal.");
terminal.prompt();
terminal.onKey((e) => {
  //console.log(e.key);
  const code = e.key.charCodeAt(0);
  const printable =
    !e.key.altKey && !e.key.altGraphKey && !e.key.ctrlKey && !e.key.metaKey;
  terminal.write(e.key);
  if (code == 127) {
    //Backspace
    terminal.write("\b \b");
  }
  if (code == 9) {
    //Tab
    terminal.write("\t");
  }
  if (e.key == "\x1b[D") {
    //Left
    terminal.write("\x1b[D");
  }
  // enter
  if (code == 13) {
    terminal.write("\n");
    terminal.prompt();
    console.log(curr_line);
    if (curr_line.length > 0) {
      lineHistory.push(curr_line);
      historyIndex = lineHistory.length;
      await terminalCommands(curr_line);
    }
    curr_line = "";
  } else if (code == 8) {
    // Do not delete the prompt
    if (terminal.x > 2) {
      curr_line = curr_line.slice(0, -1);
      terminal.write("\b \b");
    }
  } else if (printable) {
    curr_line += e.key;
  }
});
// For debugging purposes
/* terminal.onKey((e) => {
  console.log(e.key);
}); */
async function connectSerial() {
  try {
    // Prompt user to select any serial port.
    port = await navigator.serial.requestPort();
    if (settings !== {}) await port.open({ baudRate: document.getElementById("baud").value });
    let settings = {};
    if (document.getElementById("rtsOn").value == true) settings.dataTerminalReady = true;
    if (document.getElementById("dtrOn").value == true) settings.requestToSend = true;
    await port.setSignals(settings);
    listenToPort();
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
  } catch {
    alert("Serial Connection Failed");
  }
}
async function terminalCommands(curr_line){
  switch (curr_line) {
    case "clear":
      terminal.clear();
      terminal.prompt();
      break;
    case "help":
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
    if (dataToSend.trim().startsWith("clear")) terminal.clear();
    else appendToAdvancedTerminal(dataToSend);
  if (dataToSend.trim().startsWith("clear"));
  terminal.clear();
  if (dataToSend.trim().startsWith("neofetch"))
    printToConsole(neofetch_data, 32, false);
  if (dataToSend.trim().startsWith("contributors"))
    printToConsole(contributors, "33", true);
  await writer.write(dataToSend);
  document.getElementById("lineToSend").value = "";
  await writer.releaseLock();
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
      reader.releaseLock();
      break;
    }
    // value is a string.
    appendToAdvancedTerminal(value);
  }
}
async function appendToAdvancedTerminal(newStuff) {
  terminal.write(newStuff);
}
function scrollHistory(direction) {
  historyIndex = Math.max(
    Math.min(historyIndex + direction, lineHistory.length - 1),
    -1
  );
  if (historyIndex >= 0) {
    document.getElementById("lineToSend").value = lineHistory[historyIndex];
    appendToAdvancedTerminal(lineHistory[historyIndex]);
  } else {
    document.getElementById("lineToSend").value = "";
    terminal.clear();
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
