import { Button, Col, Icon, Layout, Row, Tooltip } from "antd";
// import { debounce } from "lodash";
import * as React from "react";
import Iframe from "react-iframe";
import { IPreviewProps } from "../globalTypes";

const { Content, Sider } = Layout;

export default class StaticWiki extends React.Component<IPreviewProps, {}>{
  public render() {
    const { lookup, removePreview, searchType } = this.props;

    const domain = window.location.protocol + '//' + window.location.host

    const previewName = this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1);

    return (
      <Sider style={{ backgroundColor: "#f0f2f5", marginTop: '1.6vw' }}  width={'30vw'} >
        <Content
          style={{background: '#fff', width: '28.4vw', height: `calc(100% - (4vh + 4px))` }}
        >
        <Row style={{marginLeft: 8, marginRight: 8, paddingBottom: -12, marginBottom: -12}}>
          <Col span={12}>
            <h2><Icon type="laptop" style={{paddingRight: 8}}/>Preview</h2>
          </Col>
          <Col push={9} span={12}>
            {/* <h2 style={{textAlign: 'left'}}> */}
            <Tooltip title={`Launch "${previewName}"`}>
              <Button 
                shape="circle" 
                icon="arrows-alt"
                href={searchType === 'wikipedia' ? `https://en.wikipedia.org/wiki/${lookup}`: lookup}
                target="_blank"
                style={{
                  marginRight: 4,
                  marginTop: 4,
                }} 
              />
            </Tooltip>
            <Tooltip title="Close preview" >
              <Button 
                onClick={removePreview} 
                type="danger" 
                shape="circle" 
                icon="close" 
                style={{
                  marginLeft: 4,
                  marginTop: 4,
                }} 
              />
            </Tooltip>
              {/* <Icon type="close-circle-o" 
                style={{
                  cursor: 'pointer',
                  marginLeft: 8,
                  paddingLeft: 8,
                  transition: 'color .3s'
                }}
              /> */}
            {/* </h2> */}
          </Col>
        </Row>
          <Iframe url={searchType === 'wikipedia' ? `https://en.m.wikipedia.org/wiki/${lookup}?domain=${domain}`: `${lookup}?domain=${domain}`}
            width="inherit"
            height="inherit"
            display="block"
            position="block"
            allowFullScreen={true}
            style={{marginTop: -12, paddingTop: -12}}
          />
        </Content>
      </Sider>
    );
  }

}
// onMouseLeave={debounce(removePreview, 300)}