/* tslint:disable:no-console jsx-no-lambda */
import { Col, Layout, Row, Spin } from "antd";
import Axios from 'axios';
import * as React from 'react';
import Force from '../components/Force';
import Head from "../components/Head";
import Nav from "../components/Nav";
import { AutoCompData, IData, IGlobalState } from '../globalTypes';


const { Content } = Layout;

export default class Dash extends React.Component <{}, IGlobalState> {

  public state = {
    autoComp: [],
    collapsed: false,
    forceData: null,
    height: 0,
    platform: 'wikipedia',
    renderChild: false,
    search: 'Mammal',
    width: 0
  };

  public divElement: HTMLDivElement | null = null;
  
  
  public componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    
    const height = window.innerHeight > 1300 ? window.innerHeight * .90 : window.innerHeight * .82;
    const width = window.innerWidth > 2500 ? window.innerWidth * .90 : window.innerWidth * .816;

    this.setState({height, width}, () => this.postWiki());
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  public render() {
    const { collapsed, forceData, height, width, autoComp, platform, search } = this.state;

    return (
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Nav collapsed={this.state.collapsed} select={this.chgPlatform} view={platform} />
        <Layout>
          <Head
            collapsed={collapsed}
            toggleSider={this.toggleNav}
            suggestions={autoComp}
            input={search}
            ctrlInput={this.controlledInput}
            ctrlSelect={this.controlledAutoComp}
            view={platform}
            postWiki={this.postWiki}
          />
          <Row type="flex" justify="start" align="top" gutter={16}>
            <Col>
            {forceData !== null ?
              (
                <Content
                  style={{ margin: '2rem', padding: '2rem', background: '#fff'}}
                >
                  <div ref={divElement => { this.divElement = divElement }} style={{ height, width: `${!collapsed ? width : width * .9}` }}>
                    <Force width={width} height={height} data={forceData} handleEv={this.handleD3Ev} />
                  </div>
                </Content>) :
              (<Content>
                <div ref={divElement => { this.divElement = divElement }} style={{ height: '100vh', width: '90vw' }}>
                  <Spin size="large" />
                </div>
              </Content>)
            }
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }

  private handleD3Ev = () => {
    console.log('D3 click fired');
  }
  
  private postWiki = () => {

    Axios.post('http://localhost:3005/api/wikiRecommendations', { link: `https://en.wikipedia.org/wiki/${this.state.search}`, query: this.state.search })
      .then((recs) => {
        const forceData: IData = recs.data;

        Axios.post('http://localhost:3005/api/wikiSearch', { query: this.state.search })
          .then((ac) => {
            const autoComp: AutoCompData = ac.data;

            this.setState({
              autoComp,
              forceData,
            });

          })
          .catch((err) => console.error(err))

      })
      .catch((err) => console.error(err));
  }
  
  private handleResize = () => this.setState({
    height : window.innerHeight > 1100 ? window.innerHeight * .88 : window.innerHeight * .82,
    width : window.innerWidth > 2500 ? window.innerWidth * .888 : window.innerWidth * .80
  })

  private toggleNav = () => {
    const { collapsed } = this.state;
    
    const width = collapsed === true ? ( window.innerWidth > 2500 ? window.innerWidth * .90 : window.innerWidth * .83 ) : window.innerWidth * .93;

    this.setState({
      collapsed: !collapsed,
      width,
    })
  }

  private chgPlatform = (e: { key: string; }) => {
    this.setState({
      platform: e.key,
    });
  }

  private controlledInput = (e: React.FormEvent<EventTarget>): void => {
    const target = e.target as HTMLInputElement
    this.setState({ search: target.value })
  }

  private controlledAutoComp = ( search: string): void => {
    this.setState({
      search
    });
  }

}