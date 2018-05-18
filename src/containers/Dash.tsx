/* tslint:disable:no-console jsx-no-lambda */
import { Layout, Spin } from "antd";
import Axios from 'axios';
import { debounce } from 'lodash';
import * as React from 'react';
import Force from '../components/Force';
import Head from "../components/Head";
import Nav from "../components/Nav";
import { AutoCompData, IDashProps, IData, IGlobalState } from '../globalTypes';
import Preview from './Preview';

const { Content } = Layout;

export default class Dash extends React.Component <IDashProps, IGlobalState> {

  public state = {
    autoComp: [],
    collapsed: false,
    forceData: null,
    height: 0,
    platform: 'wikipedia',
    preview: null,
    renderChild: false,
    search: 'Mammal',
    view: 'explore',
    width: 0,
  };

  public divElement: HTMLDivElement | null = null;

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    const height = window.innerHeight > 1100 ? window.innerHeight * .88 : window.innerHeight * .82;
    const width = window.innerWidth > 2500 ? window.innerWidth * .888 : window.innerWidth * .80;

    this.setState({height, width}, () => this.postWiki());
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  public render() {
    const { collapsed, forceData, height, width, autoComp, platform, preview, search } = this.state;

    return (
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Nav collapsed={this.state.collapsed} select={this.chgPlatform} view={platform} />
        <Layout>
          <Head
            collapsed={collapsed}
            toggleSider={this.toggleNav}
            suggestions={autoComp}
            input={search}
            ctrlInput={this.controlledACInput}
            ctrlSelect={this.controlledAutoComp}
            view={platform}
            menuClick={this.chgView}
            postWiki={this.postWiki}
            logOut={this.props.logOut}
          />
          <Layout >
            <Content
              style={{ margin: '1.6vw', padding: '1vw', background: '#fff', height: '100%' }}
              id="mount"
            >
              {forceData !== null ?
                (
                  <div ref={divElement => { this.divElement = divElement }} style={{ 
                    height, width: 'inherit' 
                    }}>
                    <Force
                      width={width}
                      height={height}
                      data={forceData}
                      loadPreview={this.loadPreview}
                      removePreview={this.removePreview}
                      handleEv={this.handleD3Ev} />
                  </div>
                ) :
                (<div ref={divElement => { this.divElement = divElement }} style={{ 
                  height: '100vh', width: 'inherit' 
                }}>
                  <Spin size="large" />
                </div>)
              }
            </Content>
            {preview !== null ? <Preview {...preview} removePreview={this.removePreview} /> : null}
          </Layout>
        </Layout>
      </Layout>
    );
  }
  
  private postWiki = () => {

    Axios.post('/api/wikiRecommendations', { link: `https://en.wikipedia.org/wiki/${this.state.search}`, query: this.state.search })
      .then((recs) => {
        const forceData: IData = recs.data;

        Axios.post('/api/wikiSearch', { query: this.state.search })
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

  private chgView = (e: any) => {
    this.setState({
      view: e.key
    });
  }

  private chgPlatform = (e: { key: string; }) => {
    this.setState({
      platform: e.key,
    });
  }

  private controlledACInput = (e: React.FormEvent<EventTarget>): void => {
    console.log('controlled ac input')
    const target = e.target as HTMLInputElement
    const debouncedAC = debounce(() => this.getAutoComp(target.value), 300);
    this.setState({ search: target.value })
    debouncedAC();
    
  }

  private controlledAutoComp = ( search: string): void => {
    this.setState({
      search
    });
  }

  private getAutoComp = (search: string): void => {
    Axios.post('/api/wikiSearch', { query: search })
    .then((ac) => {
      const autoComp: AutoCompData = ac.data;

      this.setState({
        autoComp
      })
    })
    .catch((err) => console.error(err));
  }

  private handleD3Ev = () => {
    console.log('D3 click fired');
  }

  private loadPreview = (e: any) => {
    console.log('D3 mousevent fired', e);
    this.setState({
      preview : {lookup: e.id, x: e.x, y: e.y},
      width: this.state.width * .66
    });
  }

  private removePreview = () => {
    this.setState({
      preview: null,
      width: window.innerWidth > 2500 ? window.innerWidth * .888 : window.innerWidth * .80
    });
  }
}
