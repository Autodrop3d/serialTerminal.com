var port, textEncoder, writableStreamClosed, writer;

const budSelection = document.getElementById("baud");
const clearButton  = document.getElementById("clearButton");
const sendButton   = document.getElementById("sendButton");
const echoChekbox  = document.getElementById("echoOn");
const addLineChekbox   = document.getElementById("addLine");
const serialResultsDiv = document.getElementById("serialResults");
const connectionButton = document.getElementById('connectButton');
const lineToSendInput  = document.getElementById("lineToSend");
/******************* helper functions *****************/
async function connectSerial() {
    try {
        // Prompt user to select any serial port.
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: budSelection.value });
    } catch {
        alert("Serial Connection Failed");
        return;
    }
    listenToPort();
    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
}

async function sendSerialLine() {
    dataToSend = lineToSendInput.value;
    console.log(dataToSend);
    if (addLineChekbox.checked == true) dataToSend += "\r\n";
    if (echoChekbox.checked == true) appendToTerminal(`> ${dataToSend}`);
    console.log(dataToSend);
    await writer.write(dataToSend);
    lineToSendInput.value = "";
    //await writer.releaseLock();
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
        appendToTerminal(value);
    }
}


async function appendToTerminal(newStuff) {
    serialResultsDiv.innerHTML +=  newStuff;
    //scroll down to bottom of div
    serialResultsDiv.scrollTop = serialResultsDiv.scrollHeight;
}

/*********************event listeners***************/
lineToSendInput.addEventListener("keyup", async function (event) {
    if (event.keyCode === 13) {
        sendSerialLine();
    }
});

connectionButton.addEventListener('click', () => {
    if (!navigator.serial) {
      alert('Serial communication is not supported By your Browser.');
      return;
    }
    connectSerial();
});

budSelection.addEventListener("change",()=>{
  localStorage.setItem("baud",budSelection.value);
  if(port!=undefined){
      // TO DO : change the baudrate will port is open
      // or reOpean the port with the new budrate
  }
})

clearButton.addEventListener('click',()=>{
    serialResultsDiv.innerHTML='';
});

sendButton.addEventListener('click',()=>{
    sendSerialLine();
});

echoChekbox.addEventListener("change",()=>{
     localStorage.setItem("echoOn",echoChekbox.checked);
});

addLineChekbox.addEventListener("change",()=>{
    localStorage.setItem("addLine",addLineChekbox.checked); 
});

/******************************initalization of fields *****************/
budSelection.value = localStorage.getItem("baud")||9600;
addLineChekbox.checked = localStorage.getItem("addLine")=='true';
echoChekbox.checked =localStorage.getItem('echoOn')=='true';
