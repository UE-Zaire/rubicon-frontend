import { Layout } from "antd";
import { debounce } from "lodash";
import * as React from "react";
import Iframe from "react-iframe";
import { IPreviewProps } from "../globalTypes";

const { Content, Sider } = Layout;

export default class StaticWiki extends React.Component<IPreviewProps, {}>{
  public render() {
    const { lookup, removePreview} = this.props;

    return (
      <Sider style={{ backgroundColor: "#f0f2f5", marginTop: '1.6vw' }} onMouseLeave={debounce(removePreview, 300)} width={'30vw'} >
        <Content
          style={{background: '#fff', width: '28.4vw', height: `calc(100% - 3.6vh)` }}
        >
          <Iframe url={`https://en.m.wikipedia.org/wiki/${lookup}`}
            width="inherit"
            height="inherit"
            display="block"
            position="block"
            allowFullScreen={true}
          />
        </Content>
      </Sider>
    );
  }

}
