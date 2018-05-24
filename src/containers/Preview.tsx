import { Col, Icon, Layout, Row } from "antd";
// import { debounce } from "lodash";
import * as React from "react";
import Iframe from "react-iframe";
import { IPreviewProps } from "../globalTypes";

const { Content, Sider } = Layout;

export default class StaticWiki extends React.Component<IPreviewProps, {}>{
  public render() {
    const { lookup, removePreview, searchType } = this.props;

    const domain = window.location.protocol + '//' + window.location.host

    return (
      <Sider style={{ backgroundColor: "#f0f2f5", marginTop: '1.6vw' }}  width={'30vw'} >
        <Content
          style={{background: '#fff', width: '28.4vw', height: `calc(100% - 2vw)` }}
        >
        <Row style={{marginLeft: 8, marginRight: 8, paddingBottom: -12, marginBottom: -12}}>
          <Col span={12}>
            <h1><Icon type="laptop" />Preview</h1>
          </Col>
          <Col push={10} span={12}>
            <h1 style={{textAlign: 'left'}}>
              <Icon type="close-circle-o" 
                onClick={removePreview}
                style={{
                  cursor: 'pointer',
                  marginLeft: 8,
                  paddingLeft: 8,
                  transition: 'color .3s'
                }}
              />
            </h1>
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