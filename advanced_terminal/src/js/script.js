var port,
  textEncoder,
  writableStreamClosed,
  writer,
  historyIndex = -1;
const lineHistory = [];
var termPrompt = localStorage.prompt;
var version = "v0.1.0";

var neofetch_data = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(@@\/(@@@&#@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@#\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@(@@@@@@@@@(@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@\/@\/(@%\/@\/@@\/@@@@@\/@@\/@@\/@@@@@@@(@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@#@@\/#@@&@@@@\/@@#&%\/&\/@@@@\/@@@\/%(((@%@@@@@@@@@@@@@#@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@\/&\/\/&\/\/@@@@&@@@@@@\/@@(\/\/&\/@@@@\/@@@%@&(@@(@@@@#@@@@%\/@@@@@@@@@@@@@@@\r\n@@@#\/%@@@@@@@@@#@@%(@\/@@@@@@#@@@\/@\/@@@\/%@(\/&#@@@@@\/@@@\/%#@@@&\/\/\/\/\/@@\/\/@@@@@@@@@@\r\n@@@@@@@@#\/\/\/\/\/&\/@@\/@@@\/@@\/@@@\/@@@\/(@@@@\/@@@@@@\/#\/\/\/\/@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@\r\n@@@@@@@@@@\/\/\/@@(\/\/\/\/\/\/\/\/\/\/\/(\/#\/\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@\r\n@@@@@@@@@@@@\/\/%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/%@@@@@@@@@@@@\r\n@@@@@@@@@@@@@#\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/\/@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@(\/\/&@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/(%@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@%@@&%@#%#&%@&%@@#@@@@(((@%@&&####@#@(#@@%@@#@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`;
var contributors = [
  `                      _                     _ \r\n                     (_)                   | |\r\n  _ __ ___  _ __ ___  _ ___  ___ ___   ___ | |\r\n | \'_ \` _ \\| \'_ \` _ \\| \/ __|\/ __\/ _ \\ \/ _ \\| |\r\n | | | | | | | | | | | \\__ \\ (_| (_) | (_) | |\r\n |_| |_| |_|_| |_| |_|_|___\/\\___\\___\/ \\___\/|_|\r\n                                             `,
  `  ______                  _______ _    _ ______ _                \r\n |___  \/                 |__   __| |  | |  ____| |               \r\n    \/ \/ __ _ _ __  _____   _| |  | |__| | |__  | |__   __ _ _ __ \r\n   \/ \/ \/ _\` | \'_ \\|_  \/ | | | |  |  __  |  __| | \'_ \\ \/ _\` | \'__|\r\n  \/ \/_| (_| | | | |\/ \/| |_| | |  | |  | | |____| |_) | (_| | |   \r\n \/_____\\__,_|_| |_\/___|\\__, |_|  |_|  |_|______|_.__\/ \\__,_|_|   \r\n                        __\/ |                                    \r\n                       |___\/                                    `
];

var entries = [];
var currPos = 0;
var pos = 0;
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
  if (localStorage.prompt > 0) {
    terminal.write(`\r\n\x1B[1;3;32m${termPrompt}\x1B[0m`);
  } else {
    terminal.write("\r\n\x1B[0;3;34m$ \x1B[0m ");
  }
};
terminal.writeln("Welcome to the Advanced Browser-based Cereal Terminal.");
terminal.prompt();
terminal.onKey((e) => {
  //console.log(e.key);
  const code = e.key.charCodeAt(0);
  const printable =
    !e.key.altKey && !e.key.altGraphKey && !e.key.ctrlKey && !e.key.metaKey;
  printToConsole(e.key, "36", false);
  if (code == 127) {
    //Backspace
    terminal.write("\b \b");
  }
  // enter
  if (code == 13) {
    if (curr_line.length > 0) {
      lineHistory.push(curr_line);
      historyIndex = lineHistory.length;
      terminalCommands(curr_line);
      terminal.prompt();
      console.log(curr_line);
    } else {
      terminal.clear();
      terminal.prompt();
    }
    curr_line = "";
  } else if (code == 8) {
    // Do not delete the prompt
    if (terminal.prompt() > 2) {
      curr_line = curr_line.slice(0, -1);
      terminal.write("\b \b");
    }
  } else if (printable) {
    curr_line += e.key;
  }
  /* !(e.keyCode === 37 && terminal.buffer.cursorX < 6);

  if (e.keyCode === 13) {
    // Enter key
    if (curr_line.replace(/^\s+|\s+$/g, "").length != 0) {
      // Check if string is all whitespace
      entries.push(curr_line);
      currPos = entries.length - 1;
      terminalCommands(curr_line);
      terminal.prompt();
    } else {
      terminal.write("\n\33[2K\r\u001b[32mscm> \u001b[37m");
    }
    curr_line = "";
  } else if (e.keyCode === 127) {
    // Backspace
    if (terminal.buffer.cursorX > 5) {
      curr_line =
        curr_line.slice(0, terminal.buffer.cursorX - 6) +
        curr_line.slice(terminal.buffer.cursorX - 5);
      pos = curr_line.length - terminal.buffer.cursorX + 6;
      terminal.write("\33[2K\r\u001b[32mscm> \u001b[37m" + curr_line);
      terminal.write("\033[".concat(pos.toString()).concat("D")); //term.write('\033[<N>D');
      if (
        terminal.buffer.cursorX == 5 ||
        terminal.buffer.cursorX == curr_line.length + 6
      ) {
        terminal.write("\033[1C");
      }
    }
  } else if (e.keyCode === 38) {
    // Up arrow
    if (entries.length > 0) {
      if (currPos > 0) {
        currPos -= 1;
      }
      curr_line = entries[currPos];
      terminal.write("\33[2K\r\u001b[32mscm> \u001b[37m" + curr_line);
    }
  } else if (e.keyCode === 40) {
    // Down arrow
    currPos += 1;
    if (currPos === entries.length || entries.length === 0) {
      currPos -= 1;
      curr_line = "";
      terminal.write("\33[2K\r\u001b[32mscm> \u001b[37m");
    } else {
      curr_line = entries[currPos];
      terminal.write("\33[2K\r\u001b[32mscm> \u001b[37m" + curr_line);
    }
  } else if (
    printable &&
    !(e.keyCode === 39 && terminal.buffer.cursorX > curr_line.length + 4)
  ) {
    if (e.keyCode != 37 && e.keyCode != 39) {
      var input = e.key;
      if (e.keyCode == 9) {
        // Tab
        input = "\t";
      }
      pos = curr_line.length - terminal.buffer.cursorX + 4;
      curr_line = [
        curr_line.slice(0, terminal.buffer.cursorX - 5),
        input,
        curr_line.slice(terminal.buffer.cursorX - 5)
      ].join("");
      terminal.write("\33[2K\r\u001b[32mscm> \u001b[37m" + curr_line);
      terminal.write("\033[".concat(pos.toString()).concat("D")); //term.write('\033[<N>D');
    } else {
      terminal.write(key);
    }
  }*/
});
// For debugging purposes
/* terminal.onKey((e) => {
  console.log(e.key);
}); */
async function connectSerial() {
  try {
    if ("serial" in navigator) {
      // The Web Serial API is supported.
      // Prompt user to select any serial port.
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: document.getElementById("baud").value });
      let settings = {};

      if (localStorage.dtrOn == "true") settings.dataTerminalReady = true;
      if (localStorage.rtsOn == "true") settings.requestToSend = true;
      if (Object.keys(settings).length > 0) await port.setSignals(settings);

      await listenToPort();
      textEncoder = new TextEncoderStream();
      writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable;

      const signals = await port.getSignals();
      console.log(`Clear To Send:       ${signals.clearToSend}`);
      console.log(`Data Carrier Detect: ${signals.dataCarrierDetect}`);
      console.log(`Data Set Ready:      ${signals.dataSetReady}`);
      console.log(`Ring Indicator:      ${signals.ringIndicator}`);
      await listenToPort();
      textEncoder = new TextEncoderStream();
      writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      writer = textEncoder.writable.getWriter();
    } else {
      // The Web Serial API is not supported.
      alert("The Web Serial API is not supported by your browser.");
    }
  } catch (e) {
    alert("Serial Connection Failed" + e);
  }
}
async function terminalCommands(curr_line) {
  try {
    if (curr_line.trim().startsWith("clear")) {
      terminal.clear();
    }
    if (
      curr_line.trim().startsWith("help") ||
      curr_line.trim().startsWith("?")
    ) {
      await showHelp();
    }
    if (curr_line.trim().startsWith("contributors")) {
      terminal.writeln("");
      terminal.writeln("");
      printToConsoleln(contributors, "33", true);
    }
    if (curr_line.trim().startsWith("version")) {
      terminal.writeln("");
      terminal.writeln("");
      await showVersion();
    }
    if (curr_line.trim().startsWith("refresh")) {
      terminal.writeln("Exiting...");
      terminal.prompt();
      terminal.writeln("Exited.");
      terminal.prompt();
      terminal.writeln("");
      terminal.clear();
      if (port) {
        await port.close();
      }
      window.location.reload();
    }
    if (curr_line.trim().startsWith("connect")) {
      await connectSerial();
    }
    if (curr_line.trim().startsWith("send")) {
      let data = curr_line.split(" ");
      if (data.length > 1) {
        let str = data[1];
        //remove the send command
        str = str.substring(0);
        for (let i = 2; i < data.length; i++) {
          str += " " + data[i];
        }
        console.log(str);
        if (port) {
          writer.write(str);
        }
      }
    }
    if (curr_line.trim().startsWith("sendline")) {
      let data = curr_line.split(" ");
      if (data.length > 1) {
        let str = data[1];
        str = str.substring(0);
        for (let i = 2; i < data.length; i++) {
          str += " " + data[i];
        }
        console.log(str);
        if (port) {
          writer.write(str + "\n");
        }
      }
    }
    if (curr_line.trim().startsWith("sendfile")) {
      let data = curr_line.split(" ");
      if (data.length > 1) {
        let str = data[1];
        for (let i = 2; i < data.length; i++) {
          str += " " + data[i];
        }
        let file = new File([str], str, { type: "text/plain" });
        let reader = new FileReader();
        reader.onload = function () {
          if (port) {
            writer.write(reader.result);
          }
        };
        reader.readAsText(file);
      }
    }
    if (curr_line.trim().startsWith("neofetch")) {
      terminal.writeln("");
      terminal.writeln("");
      printToConsoleln(neofetch_data, 32, false);
    }
    if (curr_line.trim().startsWith("prompt")) {
      let data = curr_line.split(" ");
      if (data.length > 1) {
        let str = data[1];
        str = str.substring(0);
        for (let i = 2; i < data.length; i++) {
          str += " " + data[i];
        }
        console.log(str);
        localStorage.setItem("prompt", str);
        window.location.reload();
      }
    }
  } catch (err) {
    console.log(err);
  }
}
function showVersion() {
  printToConsoleln(version, "32", false);
}
function showHelp() {
  terminal.writeln("");
  terminal.writeln("");
  printToConsole("help - ", "32", false);
  printToConsoleln("Show this help, you can also use `?`", "36", false);
  printToConsole("clear - ", "32", false);
  printToConsoleln("Clear the terminal", "36", false);
  printToConsole("contributors - ", "32", false);
  printToConsoleln("Show the contributors", "36", false);
  printToConsole("version - ", "32", false);
  printToConsoleln("Show the version", "36", false);
  printToConsole("refresh - ", "32", false);
  printToConsoleln("Refresh the page", "36", false);
  printToConsole("connect - ", "32", false);
  printToConsoleln("Connect to a serial port", "36", false);
  printToConsole("send - ", "32", false);
  printToConsoleln("Send data to the serial port", "36", false);
  printToConsole("sendline - ", "32", false);
  printToConsoleln(
    "Send data to the serial port and add a new line",
    "36",
    false
  );
  printToConsole("sendfile - ", "32", false);
  printToConsoleln("Send a file to the serial port", "36", false);
  printToConsole("neofetch - ", "32", false);
  printToConsoleln("Show the neofetch data", "36", false);
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
  if (dataToSend.trim().startsWith("clear")) terminal.clear();
  if (dataToSend.trim().startsWith("neofetch"))
    printToConsoleln(neofetch_data, 32, false);
  if (dataToSend.trim().startsWith("contributors"))
    printToConsoleln(contributors, "33", true);
  await writer.write(dataToSend);
  if (dataToSend.trim().startsWith("\x03")) echo(false);
  document.getElementById("lineToSend").value = "";
  await writer.releaseLock();
}
function printToConsoleln(data, color, array) {
  if (array == true) {
    for (var i = 0; i < data.length; i++) {
      terminal.writeln(`\x1B[0;3;${color}m${data[i]}\x1B[0m`);
    }
  } else {
    terminal.writeln(`\x1B[0;3;${color}m${data}\x1B[0m`);
  }
}
function printToConsole(data, color, array) {
  if (array == true) {
    for (var i = 0; i < data.length; i++) {
      terminal.write(`\x1B[0;3;${color}m${data[i]}\x1B[0m`);
    }
  } else {
    terminal.write(`\x1B[0;3;${color}m${data}\x1B[0m`);
  }
}
async function listenToPort() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  while (port.readable) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          //log.textContent += value + "\n";
        }
        if (done) {
          // Allow the serial port to be closed later.
          readableStreamClosed.then(() => port.readable.close());
          console.log("[readLoop] DONE", done);
          reader.releaseLock();
          break;
        }
        // value is a string.
        appendToAdvancedTerminal(value);
      }

      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

      reader.cancel();
      await readableStreamClosed.catch(() => {
        /* Ignore the error */
      });

      writer.close();
      await writableStreamClosed;

      await port.close();
    } catch (error) {
      //! TODO: Handle non-fatal read error.
      console.log("[readLoop] ERROR", error);
    }
  }
}
async function appendToAdvancedTerminal(newStuff) {
  terminal.write(newStuff);
}
async function advancedTerminalClear() {
  terminal.clear();
  terminal.prompt();
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
navigator.serial.addEventListener("connect", (event) => {
  // TODO: Automatically open event.target or warn user a port is available.
  port = event.target;
  port.open();
  port.readable.addEventListener("abort", () => {
    console.log("[port.readable] ABORT");
  });
  port.readable.addEventListener("error", () => {
    console.log("[port.readable] ERROR");
  });
  port.readable.addEventListener("open", () => {
    console.log("[port.readable] OPEN");
  });
  port.readable.addEventListener("close", () => {
    console.log("[port.readable] CLOSE");
  });
  port.readable.addEventListener("readable", () => {
    console.log("[port.readable] READABLE");
  });
  port.readable.addEventListener("data", () => {
    console.log("[port.readable] DATA");
  });
  port.readable.addEventListener("end", () => {
    console.log("[port.readable] END");
  });
});

navigator.serial.addEventListener("disconnect", (event) => {
  // TODO: Remove |event.target| from the UI.
  port = event.target;
  port.close();
  port.readable.removeEventListener("abort", () => {
    console.log("[port.readable] ABORT");
  });
  port.readable.removeEventListener("error", () => {
    console.log("[port.readable] ERROR");
  });
  port.readable.removeEventListener("open", () => {
    console.log("[port.readable] OPEN");
  });
  port.readable.removeEventListener("close", () => {
    console.log("[port.readable] CLOSE");
  });
  port.readable.removeEventListener("readable", () => {
    console.log("[port.readable] READABLE");
  });
  port.readable.removeEventListener("data", () => {
    console.log("[port.readable] DATA");
  });
  port.readable.removeEventListener("end", () => {
    console.log("[port.readable] END");
  });
});
async function forgetPort() {
  if (port) {
    if ("serial" in navigator && "forget" in SerialPort.prototype) {
      // forget() is supported.
      if (localStorage.forgetDevice == "true") {
        await port.forget();
        console.log("Forgot device");
        alert("Device forgotten");
        localStorage.forgetDevice = "false";
        alert("Forget Deactivated");
      }
    } else {
      // forget() is not supported.
      alert(
        "Your browser does not support the SerialPort API. Please upgrade to a newer browser."
      );
    }
  } else {
    if (localStorage.forgetDevice == "true") {
      alert("No device connected, cannot forget\nForget Deactivated");
      localStorage.forgetDevice = "false";
    }
  }
}
document.getElementById("baud").value =
  localStorage.baud == undefined ? 9600 : localStorage.baud;
document.getElementById("addLine").checked =
  localStorage.addLine == "false" ? false : true;
document.getElementById("carriageReturn").checked =
  localStorage.carriageReturn == "false" ? false : true;
document.getElementById("echoOn").checked =
  localStorage.echoOn == "false" ? false : true;
window.onload = async function () {
  await forgetPort();
};
