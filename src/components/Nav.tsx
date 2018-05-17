import { Col, Icon, Layout, Menu, Row } from "antd";
import * as React from "react";
import { Icon as FA } from "react-fa";
import * as Logo from "../assets/logo.png"
import { INavProps } from "../globalTypes";

const { Sider } = Layout;



export default (props: INavProps) => (
  <Sider
    trigger={null}
    collapsible={true}
    collapsed={props.collapsed}
  >
    <div style={{ paddingTop: 8 }}>
      {
        props.collapsed ?
          <img src={Logo} style={{ width: '60%', marginLeft: '20%', marginRight: '20%', marginBottom: '4px' }} /> :
          <Row align={"middle"}>
            <Col span={18} push={6} >
              <h1 style={{ color: '#E6F7FF', marginTop: '4%', paddingLeft: '6%', fontSize: 28, letterSpacing: '.02em', fontWeight: 400, fontFamily: 'Avenir', verticalAlign: 'center' }}>
                RUBICON
            </h1>
            </Col>
            <Col span={6} pull={18}>
              <img src={Logo} style={{ width: '80%', marginLeft: '30%', marginRight: '30%', marginTop: '4px', marginBottom: '4px' }} />
            </Col>
          </Row>
      }
    </div>
    <Menu
      theme="dark"
      defaultSelectedKeys={["wikipedia"]}
      defaultOpenKeys={["wikipedia"]}
      mode="inline"
      onSelect={props.select}
      selectedKeys={[props.view]}
    >
      <Menu.Item key="wikipedia">
          <i className="anticon">
            <FA  name="wikipedia-w"style={{ marginLeft: -2, fontSize: 20 }}/>
          </i>
          <span >Wikipedia</span>
      </Menu.Item>

      <Menu.Item key="google">
        <Icon type="google" style={{ fontSize: 20 }} />
        <span>Google</span>
      </Menu.Item>
    </Menu>
  </Sider>
)

