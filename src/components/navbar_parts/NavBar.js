import React, { useState } from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Drawer, Button, Divider } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "../../css/Navbar.css";

export default function NavBar() {
  let [visible, setVisible] = useState(false);

  function showDrawer() {
    setVisible(true);
  }

  function onClose() {
    setVisible(false);
  }

  return (
    <nav className="menu">
      <div className="menu__logo"></div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu modeProp={"horizontal"} />
        </div>
        <div className="menu_rigth">
          <RightMenu modeProp={"horizontal"} />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
          icon={<MenuOutlined />}
        ></Button>
        <Drawer
          title="Menu"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu modeProp={"inline"} onClose={onClose} />
          <Divider />
          <RightMenu modeProp={"inline"} onClose={onClose} />
        </Drawer>
      </div>
    </nav>
  );
}
