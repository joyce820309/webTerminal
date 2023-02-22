import React, { useContext, useState } from "react";
import styled from "styled-components";
import TabMgmt from "./TabMgmt";
import io from "socket.io-client";

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  box-shadow: 0 10px 20px 0 rgb(34 36 38 / 18%);
  min-height: 85px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 99;
  background: #95b2bdc9;
`;

const SwitchTerminalDiv = styled.div`
  display: flex;
  margin-top: 13px;
`;

const ProjNameDiv = styled.div`
  font-size: 22px;
  color: #4f6d7a;
  font-weight: 600;
  text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white;
`;
const Btn = styled.div`
  display: flex;
  align-items: center;
  color: #4f6d7a;
  font-weight: 400;
  box-shadow: none;
  margin-left: 25px;
  cursor: pointer;

  &:hover {
    font-weight: 700;
  }

  &:active {
    color: #4f6d7a6b;
    font-weight: 700;
    cursor: not-allowed;
  }
`;

const TerminalDiv = styled.div`
  margin-top: 50px;
`;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [ws, setWs] = useState(null);

  const openTerminal = () => {
    if (!ws) {
      setWs(io.connect("http://localhost:5000"));
    }

    setIsOpen(true);
  };

  const closeTerminal = () => {
    if (ws) {
      ws.disconnect();
      setWs("");
    }
    setIsOpen(false);
  };

  return (
    <div>
      <HeaderDiv>
        <ProjNameDiv>My Terminal Project</ProjNameDiv>
        <SwitchTerminalDiv>
          <Btn onClick={openTerminal}>Open</Btn>
          <Btn onClick={closeTerminal}>Close</Btn>
        </SwitchTerminalDiv>
      </HeaderDiv>
      <TerminalDiv>
        <TabMgmt isOpen={isOpen} closeTerminal={closeTerminal} ws={ws} />
      </TerminalDiv>
    </div>
  );
}

export default Header;
