import React, { useContext, useState } from "react";
import DisplayCalendar from "../DisplayCalendar";
import { WorkerContext } from "../context/WorkerContext";
import { ShiftContext } from "../context/ShiftContext";
import { Menu, Dropdown, Button, Divider, DatePicker } from "antd";
import {
  DownOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "../../css/Shifts.css";

export default function Shifts() {
  const { RangePicker } = DatePicker;
  let { workers } = useContext(WorkerContext);
  let { shifts } = useContext(ShiftContext);
  let [displayWorker, setDisplayWorker] = useState("Choose a person");
  let [displayShift, setDisplayShift] = useState("Shift");
  

  const chooseWorker = (worker) => {
    setDisplayWorker(worker.firstName + " " + worker.lastName);
  };

  const switchToChosenShift = (shift) => {
    setDisplayShift(shift.name);
  };

  const dateChange = (value, dateStrings) => {
    console.log(dateStrings[0]);
    console.log(dateStrings[1]);
  };

  let workersList = (
    <Menu>
      {workers.map((worker) => (
        <Menu.Item
          key={"worker" + worker.id}
          icon={<UserOutlined />}
          onClick={() => chooseWorker(worker)}
        >
          {worker.firstName + " " + worker.lastName}
        </Menu.Item>
      ))}
    </Menu>
  );

  let shiftTypes = (
    <Menu>
      {shifts.map((shift) => (
        <Menu.Item
          key={"shift" + shift.id}
          icon={<ClockCircleOutlined />}
          onClick={() => switchToChosenShift(shift)}
        >
          {shift.name}: {shift.startTime}-{shift.endTime}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={workersList} className="person-dropdown">
        <Button>
          {displayWorker} <DownOutlined />
        </Button>
      </Dropdown>
      <RangePicker className="work-time" onChange={dateChange} />
      <Dropdown overlay={shiftTypes} className="shift-dropdown">
        <Button>
          {displayShift} <DownOutlined />
        </Button>
      </Dropdown>
      <Button
        type="primary"
        shape="circle"
        icon={<CheckOutlined />}
        className="check-button"
      />
      <Divider />
      <DisplayCalendar />
    </div>
  );
}
