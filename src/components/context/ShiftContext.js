import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const ShiftContext = createContext();

export const ShiftProvider = (props) => {
  let [shifts, setShifts] = useState([]);
  let [confirmLoading, setConfirmLoading] = useState(false);
  let [visible, setVisible] = useState(false);
  let [newShiftDetails, setNewShiftDetails] = useState({
    name: "",
    startTime: "",
    endTime: "",
    shiftColor: "",
  });

  function showModal() {
    setVisible(true);
  }

  useEffect((shifts) => {
    axios.get("http://localhost:8080/shifts").then((response) => {
      setShifts(response.data);
    });
  }, []);

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        setShifts,
        confirmLoading,
        setConfirmLoading,
        visible,
        setVisible,
        showModal,
        newShiftDetails,
        setNewShiftDetails,
      }}
    >
      {props.children}
    </ShiftContext.Provider>
  );
};
