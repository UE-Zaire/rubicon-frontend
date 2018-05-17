/* tslint:disable:no-console jsx-no-lambda */
import { Button, Col, Dropdown, Icon, Layout, Menu, Row } from "antd";
import * as React from "react";
import * as Autocomplete from "react-autocomplete";
import "../assets/antdInput.css";
// import * as Logo from "../assets/logo.png"
import { IAutoCompDatum, IHeadProps } from "../globalTypes";

const { Header } = Layout;

const headerStyle: object = {
  background: '#fff', 
  padding: 0,
  width: '100%'
}

const rowStyle: object = {
  paddingBottom: 4,
  paddingTop: 4
}

const autoCompStyle: object = {
  display: 'inline-block',
  paddingLeft: 8, 
  paddingRight: 8, 
}


const Head = (props: IHeadProps) => {
  const menu = (
    <Menu onClick={props.menuClick}>
      <Menu.Item key="saved searches"><Icon type="book" /> Saved Searches</Menu.Item>
      <Menu.Item key="settings"><Icon type="setting" /> User Settings</Menu.Item>
    </Menu>
  );
  
  return (
    <Layout>
      <Header style={headerStyle}>
        <Row align="middle" gutter={16} style={rowStyle} type={"flex"}>
          <Col span={21}>
            <Icon
              className="trigger"
              type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={props.toggleSider}
              style={{ width: '6rem' }}
            />
            <Autocomplete
              items={props.suggestions}
              shouldItemRender={(item: IAutoCompDatum, value: string) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
              getItemValue={(item: IAutoCompDatum) => item.label}
              renderItem={(item: IAutoCompDatum, isHighlighted: boolean) =>
                <div
                  key={item.id}
                  style={{ backgroundColor: isHighlighted ? '#eee' : 'transparent' }}
                >
                  {item.label}
                </div>
              }
              renderInput={(inputProps: any) => (<input id="value1" className="ant-input" placeholder="Select a Topic" {...inputProps} />)}
              value={props.input}
              onChange={props.ctrlInput}
              onSelect={props.ctrlSelect}
              wrapperStyle={autoCompStyle}
              selectOnBlur={true}
            />
            <Button
              onClick={props.postWiki}
              type={"primary"}
            >
              Submit type
          </Button>
          </Col>
          <Col span={3}>
            <Dropdown overlay={menu}>
                <Button shape={"circle"} icon={"profile"} style={{ marginLeft: '1vw', marginRight: '1vw', paddingTop: '2px' }} type={"primary"}/>
            </Dropdown>
            <Button onClick={props.logOut} icon="logout">
              LogOut
            </Button>
          </Col>
        </Row>
      </Header>
    </Layout>
  );
}

export default Head;
