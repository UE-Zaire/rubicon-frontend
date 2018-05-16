import { debounce } from "lodash";
import * as React from "react";
import Iframe from "react-iframe";
import { IPreviewProps } from "../globalTypes";

export default class StaticWiki extends React.Component<IPreviewProps, {}>{
  public render() {
    const {lookup, removePreview, x, y} = this.props;

    return (
      <div onMouseLeave={debounce(removePreview, 300)}>
        <Iframe url={`https://en.wikipedia.org/wiki/${lookup}`}
        width="40vw"
        height="30vh"
        display="initial"
        position="fixed"
        styles={{
          left: x,
          top: y
        }}
        allowFullScreen={true}/>
      </div>
    );
  }

  
}