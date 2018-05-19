/* tslint:disable:no-console jsx-no-lambda */
import { Avatar, Button, Col, Dropdown, Icon, Input, Layout, Menu, Row } from "antd";
import * as React from "react";
import * as Autocomplete from "react-autocomplete";
import "../assets/antdInput.css";
// import * as Logo from "../assets/logo.png"
import { IAutoCompDatum, IHeadProps } from "../globalTypes";

const { Header } = Layout;

// const { Search } = Input;

const headerStyle: object = {
  background: '#fff', 
  // padding: 0,
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


export default class Head extends React.Component <IHeadProps>{
  public searchInput: any = null;
  
  public render() {

    const props = this.props;

    const menu = (
      <Menu onClick={props.menuClick}>
        <Menu.Item key="searches"><Icon type="book" /> Saved Searches</Menu.Item>
        <Menu.Item key="settings"><Icon type="setting" /> User Settings</Menu.Item>
      </Menu>
    );
  

    const suffix = props.input !== '' ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    
    return (
      <Layout>
        <Header className="header" style={headerStyle}>
          <Row gutter={16} style={rowStyle} type={"flex"}>
            <Col >
              <Icon
                className="trigger"
                type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={props.toggleSider}
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  lineHeight: '64px',
                  padding: '0 -20px',
                  transition: 'color .3s'}}
              />
            </Col>
            <Col span={8}>
              {props.view === 'wikipedia' ? (
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
              ) : (props.view === 'google' ? (
                  <Input
                    placeholder="Search Google"
                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={suffix}
                    value={props.input}
                    onChange={props.ctrlInput}
                    ref={node => this.searchInput = node}
                    style={{width: '40%', paddingRight: '8px'}}
                  />
              ) : (null))}
              {
                props.view === 'google' || props.view === 'wikipedia' ? (
                  <Button
                    onClick={props.view === 'wikipedia' ? props.postWiki : props.postGoog }
                    type={"primary"}
                  >
                    Submit
                  </Button>
                ) : null
              }
            </Col>
            <Col offset={12} >
              <Dropdown overlay={menu}>
                  {/* <Button shape={"circle"} icon={"profile"} style={{ marginLeft: '1vw', marginRight: '1vw', paddingTop: '2px' }} type={"primary"}/> */}
                  <Avatar icon="user" style={{ marginLeft: '1vw', marginRight: '1vw', backgroundColor: '#1890ff'}}/>
              </Dropdown>
  
              <Button onClick={props.logOut} icon="logout" type="danger">
                LogOut
              </Button>
            </Col>
          </Row>
        </Header>
      </Layout>
    );
  }

  private emitEmpty = () => {
    this.searchInput.focus();
    this.props.ctrlInput('')
  }
}

