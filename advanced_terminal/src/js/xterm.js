import { Terminal } from "xterm";

const terminal = new Terminal();

terminal.open(document.getElementById("terminal"));
terminal.write(
  "\x1B[1;3;32mcerealterminal@browser\x1B[0m\x1B[1;3;34m:~$\x1B[0m "
);


