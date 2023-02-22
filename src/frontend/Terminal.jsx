import React, { useEffect, useRef } from "react";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { WebLinksAddon } from "xterm-addon-web-links";
import { FitAddon } from "xterm-addon-fit";

const Xterminal = (props) => {
  const { id, ws } = props;
  const xtermRef = useRef();
  const dataFetchedRef = useRef(false);

  const unescapeSlashes = (str) => {
    // add another escaped slash if the string ends with an odd
    // number of escaped slashes which will crash JSON.parse
    let parsedStr = str.replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");

    // escape unescaped double quotes to prevent error with
    // added double quotes in json string
    parsedStr = parsedStr.replace(/(^|[^\\])((\\\\)*")/g, "$1\\$2");

    try {
      parsedStr = JSON.parse(`"${parsedStr}"`);
    } catch (e) {
      return str;
    }
    return parsedStr;
  };
  const initTerminal = () => {
    const term = new Terminal({
      id: "terminal",
      rendererType: "canvas",
      convertEol: true,
      cursorStyle: "block",
      disableStdin: false,
      onScroll: true,
      scrollback: 20,
      selection: true,
      fontSize: 16,
      backarrowKey: true,
      cols: 120,
      theme: {
        cursor: "help",
        lineHeight: 3,
        foreground: "#e5ecf0ed",
        background: "#242729",
      },
    });
    const webLinksAddon = new WebLinksAddon();
    const fitAddon = new FitAddon();
    let input = "";
    let currentCursor = 0;
    let historyCmd = [];
    let historyCount = 0;
    let historyIndex;

    term.loadAddon(webLinksAddon);
    term.loadAddon(fitAddon);

    term.open(xtermRef.current);
    fitAddon.fit();
    term.prompt = () => {
      term.write("\r\n$ ");
    };
    term.write(`TAB ID: ${id}`);
    term.prompt();

    term.onKey(({ key, domEvent }) => {
      const code = domEvent.keyCode;

      switch (code) {
        case 13:
          if (input.length > 0) {
            sendMessage(input);
            term.write("\r\n");
            historyCmd.push(input);
            input = "";
            currentCursor = 0;
          }
          break;
        case 8:
        case 127:
          if (term._core.buffer.x <= 2) return;
          if (currentCursor < input.length) {
            const beforeCursorTxt = input.slice(0, currentCursor - 1);
            const afterCursorTxt = input.slice(currentCursor);
            term.write("\b \b");
            term.write(`${afterCursorTxt} `);
            for (let i = 0; i < afterCursorTxt.length + 1; i += 1) {
              term.write("\x1b[D");
            }
            input = beforeCursorTxt + afterCursorTxt;
          } else {
            term.write("\b \b");
            const tempInput = input.slice(0, -1);
            input = tempInput;
          }
          currentCursor -= 1;

          break;
        case 37: // left
          if (currentCursor > 0) {
            if (term._core.buffer.x === 0) {
              term.write("\x1b[A");
              term.write("\x1b[" + term._core.cols + "G");
            } else {
              term.write(key);
            }
            currentCursor -= 1;
          }
          break;
        case 39: // right
          if (currentCursor < input.length) {
            // 2 = prompt.length
            let totalLength = currentCursor + 1 + 2;
            if (totalLength % term._core.cols === 0) {
              term.write("\r\n");
            } else {
              term.write(key);
            }
            currentCursor += 1;
          }
          break;
        case 38: // up
          if (historyCount === historyCmd.length) return;
          if (historyCount !== 0) {
            term.write("\x1b[2K\r");
            term.write("$ ");
          }
          historyCount++;

          historyIndex = historyCmd.length - historyCount;
          term.write(historyCmd[historyIndex]);
          input = historyCmd[historyIndex];
          currentCursor = input.length;

          break;

        case 40: // down
          if (historyCount > 0) {
            term.write("\x1b[2K\r");
            term.write("$ ");
          }
          if (historyCount === 0) return;
          if (historyCount === 1) {
            term.write(historyCmd[historyIndex]);
            term.write("\x1b[2K\r");
            term.write("$ ");
            historyCount--;
            return;
          }
          if (historyCount < 1) return;
          historyCount--;
          historyIndex = historyCmd.length - historyCount;
          term.write(historyCmd[historyIndex]);

          break;
        default: // white space = 32
          let originX = term._core.buffer.x;
          let originY = term._core.buffer.y;

          const beforeCursorTxt = input.slice(0, currentCursor);
          const afterCursorTxt = input.slice(currentCursor);

          term.write(key + afterCursorTxt);
          if (originX === term._core.cols - 1) {
            for (let i = 0; i < term._core.buffer.y - originY; i++) {
              term.write("\x1b[A");
            }
            term.write("\n\r");
          } else {
            for (let i = 0; i < term._core.buffer.y - originY; i++) {
              term.write("\x1b[A");
            }
            term.write("\x1b[" + (originX + 2) + "G");
          }
          input = beforeCursorTxt + key + afterCursorTxt;

          currentCursor += 1;
      }
    });
    term.onData((data) => {
      if (
        data === "\x1b[A" ||
        data === "\x1b[B" ||
        data === "\x1b[C" ||
        data === "\x1b[D"
      )
        return;
      // for copy & paste
      if (data.length > 1) {
        term.write(data);
        input += data;
      }
    });
    ws.on("receiveMsg", (message) => {
      console.log("message", message);

      let msgId = /(?:id":")((\w*-){4}\w*)/.exec(message);

      if (msgId && msgId[1] === id) {
        let msg = /(?:msg":")(.*)(?=")/.exec(message);
        const tempMsg = unescapeSlashes(msg[1]);
        console.log("tempMsg", tempMsg);
        console.log("msg", msg);

        term.write(`You typed: ${tempMsg}`);
        term.prompt(term.prompt);
      }
    });
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    initTerminal();
  }, []);

  const sendMessage = (input) => {
    const obj = {
      id,
      msg: input,
    };
    ws.emit("sendMsg", JSON.stringify(obj));
  };
  return <div ref={xtermRef} />;
};
export default Xterminal;
