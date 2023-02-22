import React, { useContext, useEffect, useState } from "react";
import TabView from "./TabView";

function TabMgmt(props) {
  const { isOpen, closeTerminal, ws } = props;
  const [tabArr, setTabArr] = useState([]);
  const [tabNum, setTabNum] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [uuid, setUuid] = useState("");

  const createUuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleAddBtn = (num) => {
    let tempTab = tabArr;
    const uuid = createUuid();
    let tempTabNum = tabNum;
    setTabNum(tempTabNum + 1);

    tempTab.push({
      title: num ? `Tab${num + 1}` : `Tab${tempTabNum + 1}`,
      id: uuid,
    });
    setUuid(uuid);
    setActiveIdx(tempTab.length - 1);

    setTabArr(tempTab);
  };

  const handleDelete = (tab, ind) => {
    let tempTab = tabArr.filter((t) => t !== tab);
    setActiveIdx(ind === 0 ? ind : ind - 1);
    if (tabArr.length === 1) {
      closeTerminal();
    }
    setTabArr(tempTab);
  };

  useEffect(() => {
    if (isOpen) {
      handleAddBtn(0);
      setActiveIdx(0);
    } else {
      setTabArr([]);
      setTabNum(0);
    }
  }, [isOpen]);

  return (
    <div style={{ marginTop: "85px" }}>
      {isOpen ? (
        <TabView
          tab={tabArr}
          active={activeIdx}
          handleAddBtn={handleAddBtn}
          handleDelete={handleDelete}
          ws={ws}
        />
      ) : null}
    </div>
  );
}

export default TabMgmt;
