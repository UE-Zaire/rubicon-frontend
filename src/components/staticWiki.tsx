import * as React from "react";
import Iframe from "react-iframe";

interface IWikiProps {
  q: string;
}

export default class StaticWiki extends React.Component<IWikiProps, {}>{
  public render() {
    return (
      <Iframe url={`https://en.wikipedia.org/wiki/${this.props.q}`}
      width="80vw"
      height="60vh"
      display="initial"
      position="relative"
      allowFullScreen={true}/>
    );
  }
}