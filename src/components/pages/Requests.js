import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { RequestContext } from "../context/RequestContext";
import { ShiftContext } from "../context/ShiftContext";
import { LoginContext } from "../context/LoginContext";
import { Table, Space, Button, Menu, Dropdown, DatePicker } from "antd";
import {
  DownOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "../../css/Shifts.css";

export default function Requests() {
  const { RangePicker } = DatePicker;
  let [dataSource, setDatasource] = useState([]);
  let {
    requests,
    shiftRequestDetails,
    postShiftRequests,
    deleteShiftRequest,
    postShiftAssignment,
  } = useContext(RequestContext);
  let { shifts } = useContext(ShiftContext);
  let { userData } = useContext(LoginContext);
  let [displayShift, setDisplayShift] = useState("Shift");
  let [datePicked, setDatePicked] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(true);
  let [dateRange, changeDateRange] = useState(null);

  const switchToChosenShift = (shift) => {
    setDisplayShift(shift.name);
    shiftRequestDetails.shiftId = shift.id;
    shiftRequestDetails.startTime = shift.startTime;
    shiftRequestDetails.endTime = shift.endTime;
  };

  const dateChange = (value, dateStrings) => {
    shiftRequestDetails.startDate = dateStrings[0];
    shiftRequestDetails.endDate = dateStrings[1];
    setDatePicked(true);
    changeDateRange([
      moment(dateStrings[0], "YYYY-MM-DD"),
      moment(dateStrings[1], "YYYY-MM-DD"),
    ]);
  };

  useEffect(() => {
    let data = requests.map((request) => {
      return {
        key: request.id,
        name:
          request.shifterUser.firstName + " " + request.shifterUser.lastName,
        shiftName: request.name,
        shiftTime: request.startTime + " - " + request.endTime,
        shiftDate: request.startDate + " - " + request.endDate,
        details: request,
      };
    });
    setDatasource(data);

    const disableSubmitButton = () => {
      if (displayShift !== "Shift" && datePicked) {
        setButtonDisabled(false);
      }
    };
    disableSubmitButton();
  }, [requests, displayShift, datePicked]);

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

  const disabledDate = (current) => {
    let today = new Date().toISOString().slice(0, 10);
    return current && current < moment(today, "YYYY-MM-DD");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Shift name",
      dataIndex: "shiftName",
      key: "shiftName",
    },
    {
      title: "Time",
      dataIndex: "shiftTime",
      key: "shiftTime",
    },
    {
      title: "Date",
      dataIndex: "shiftDate",
      key: "shiftDate",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              postShiftAssignment(text.details, text.key);
            }}
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              deleteShiftRequest(text.key);
            }}
            danger
          >
            Deny
          </Button>
        </Space>
      ),
    },
  ];

  return userData.roles.includes("SUPERVISOR") ? (
    <div>
      <Dropdown overlay={shiftTypes} className="shift-dropdown">
        <Button>
          {displayShift} <DownOutlined />
        </Button>
      </Dropdown>
      <RangePicker
        className="work-time"
        onChange={dateChange}
        disabledDate={disabledDate}
        value={dateRange}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<CheckOutlined />}
        className="check-button"
        onClick={() => {
          postShiftRequests();
          setButtonDisabled(true);
          setDisplayShift("Shift");
          setDatePicked(false);
          changeDateRange(null);
        }}
        disabled={buttonDisabled}
      />
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  ) : (
    <div>
      <Dropdown overlay={shiftTypes} className="shift-dropdown">
        <Button>
          {displayShift} <DownOutlined />
        </Button>
      </Dropdown>
      <RangePicker
        className="work-time"
        onChange={dateChange}
        disabledDate={disabledDate}
        value={dateRange}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<CheckOutlined />}
        className="check-button"
        onClick={() => {
          postShiftRequests();
          setButtonDisabled(true);
          setDisplayShift("Shift");
          setDatePicked(false);
          changeDateRange(null);
        }}
        disabled={buttonDisabled}
      />
      <Table
        //dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
