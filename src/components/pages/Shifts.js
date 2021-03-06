import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import DisplayCalendar from "../DisplayCalendar";
import AddNewShift from "../AddNewShift";
import { WorkerContext } from "../context/WorkerContext";
import { ShiftContext } from "../context/ShiftContext";
import { LoginContext } from "../context/LoginContext";
import { AssignShiftContext } from "../context/AssignShiftContext";
import { ShiftDetailsProvider } from "../context/ShiftDetailsContext";
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
  let { userData } = useContext(LoginContext);
  let { shifts, showModal } = useContext(ShiftContext);
  let { shiftAssignmentDetails, postShiftAssignment } = useContext(
    AssignShiftContext
  );

  let [displayWorker, setDisplayWorker] = useState("Choose a person");
  let [displayShift, setDisplayShift] = useState("Shift");
  let [datePicked, setDatePicked] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(true);
  let [dateRange, changeDateRange] = useState(null);

  const chooseWorker = (worker) => {
    setDisplayWorker(worker.firstName + " " + worker.lastName);
    shiftAssignmentDetails.workerId = worker.id;
  };

  const switchToChosenShift = (shift) => {
    setDisplayShift(shift.name);
    shiftAssignmentDetails.shiftId = shift.id;
    shiftAssignmentDetails.startTime = shift.startTime;
    shiftAssignmentDetails.endTime = shift.endTime;
  };

  const dateChange = (value, dateStrings) => {
    shiftAssignmentDetails.startDate = dateStrings[0];
    shiftAssignmentDetails.endDate = dateStrings[1];
    setDatePicked(true);
    changeDateRange([
      moment(dateStrings[0], "YYYY-MM-DD"),
      moment(dateStrings[1], "YYYY-MM-DD"),
    ]);
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
      <Menu.Divider />
      <Menu.Item className="menu-style">
        <Button onClick={showModal}>Add new shift</Button>
      </Menu.Item>
    </Menu>
  );

  const disabledDate = (current) => {
    let today = new Date().toISOString().slice(0, 10);
    return current && current < moment(today, "YYYY-MM-DD");
  };

  useEffect(() => {
    const disableSubmitButton = () => {
      if (
        displayWorker !== "Choose a person" &&
        displayShift !== "Shift" &&
        datePicked
      ) {
        setButtonDisabled(false);
      }
    };
    disableSubmitButton();
  }, [displayShift, displayWorker, datePicked]);

  return userData.roles.includes("SUPERVISOR") ? (
    <div>
      <Dropdown overlay={workersList} className="person-dropdown">
        <Button>
          {displayWorker} <DownOutlined />
        </Button>
      </Dropdown>
      <RangePicker
        className="work-time"
        onChange={dateChange}
        disabledDate={disabledDate}
        value={dateRange}
      />
      <Dropdown overlay={shiftTypes} className="shift-dropdown">
        <Button>
          {displayShift} <DownOutlined />
        </Button>
      </Dropdown>
      <AddNewShift />
      <Button
        type="primary"
        shape="circle"
        icon={<CheckOutlined />}
        className="check-button"
        onClick={() => {
          postShiftAssignment();
          setButtonDisabled(true);
          setDisplayWorker("Choose a person");
          setDisplayShift("Shift");
          setDatePicked(false);
          changeDateRange(null);
        }}
        disabled={buttonDisabled}
      />
      <Divider />
      <ShiftDetailsProvider>
        <DisplayCalendar />
      </ShiftDetailsProvider>
    </div>
  ) : (
    <div>
      <ShiftDetailsProvider>
        <DisplayCalendar />
      </ShiftDetailsProvider>
    </div>
  );
}
