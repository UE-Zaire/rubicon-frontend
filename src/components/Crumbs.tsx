import { Breadcrumb, Layout } from "antd";
import * as React from "react";
import { ICrumbProps } from "../globalTypes";
const { Content } = Layout;

const contentStyle: any = {
  height: '2vh',
  marginBottom: '0px',
  paddingBottom: '-12px', 
  paddingLeft: '2vw',
  paddingTop: '.6vh',
  position: "absolute",
  top: 68,
  width: '100vw',
  zIndex: 5
}

const Crumbs = (props: ICrumbProps) => {
  let { search, view } = props;

  const previewName = props.preview !== null ? props.preview.name.charAt(0).toUpperCase() + props.preview.name.slice(1) : null;
  search = search.charAt(0).toUpperCase() + search.slice(1);  
  view = view.charAt(0).toUpperCase() + view.slice(1);

  return (
    <Content style={contentStyle} >
      <Breadcrumb>
        {props.view !== "searches" && <Breadcrumb.Item><a href="">{view}</a></Breadcrumb.Item>}
        {props.view !== "searches" && <Breadcrumb.Item><a href="">{search}</a></Breadcrumb.Item>}
        {previewName !== null ? <Breadcrumb.Item><a href="">Previewing: "{previewName}"</a></Breadcrumb.Item> : null}
      </Breadcrumb>
    </Content>
  )
}
export default Crumbs;