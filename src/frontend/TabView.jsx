import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Terminal from "./Terminal";
import "./tab.css";

function TabView(props) {
  const { tab = [], handleAddBtn, handleDelete, active, ws } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabArr, setTabArr] = useState([]);

  const AddBtn = styled.button`
    width: 28px;
    justify-content: center;
    align-items: center;
    background: #d7d8d8;
    color: #475155d9;
    border: 3.5px solid #d7d8d8;
    border: none;
    cursor: pointer;
    &:hover {
      background: #bd9391;
      font-weight: 900;
      color: white;
    }
  `;

  const DelBtn = styled.span`
    margin-left: 18px;
    &:hover {
      font-weight: 900;
      transform: scale(1.5) !important;
    }
  `;

  const Tabs = styled.div`
    display: flex;
  `;

  const handleClick = (ind) => setActiveIndex(ind);
  const checkActive = (ind, className) =>
    activeIndex === ind ? className : "";

  useEffect(() => {
    setTabArr(tab);
  }, [tab]);

  useEffect(() => {
    setActiveIndex(active);
  }, [active]);

  return (
    <>
      <Tabs>
        {tabArr.map((tab, ind) => (
          <button
            className={`tab ${checkActive(ind, "active")}`}
            onClick={() => handleClick(ind)}
            key={"tabTitle_" + tab.id}
          >
            {tab.title}
            <DelBtn
              onClick={() => {
                handleDelete(tab, ind);
              }}
            >
              {" "}
              X
            </DelBtn>
          </button>
        ))}

        <AddBtn onClick={() => handleAddBtn()}>+</AddBtn>
      </Tabs>
      <div className="panels">
        {tabArr.map((tab, ind) => {
          return (
            <div
              className={`panel ${checkActive(ind, "active")}`}
              key={"tabContent_" + tab.id}
              hidden={ind !== activeIndex}
            >
              <Terminal key={tab.id} id={tab.id} ws={ws} />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default TabView;
