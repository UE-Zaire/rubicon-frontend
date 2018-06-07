/* tslint:disable:no-console jsx-no-lambda */
import { Button, Icon, Layout, List, Spin, Tooltip } from "antd";
import Axios from 'axios';
import { debounce } from 'lodash';
import * as React from 'react';
import Crumbs from "../components/Crumbs";

import HistoryGraph from '../components/extensionGraphs/HistoryGraphView';
import Force from '../components/Force';
import Head from "../components/Head";
import Nav from "../components/Nav";
// import StaticForce from "../components/StaticForce";
import StaticHistGraph from "../components/StaticHistGraph";
import { AutoCompData, IDashProps, IData, IGlobalState } from '../globalTypes';
import Preview from './Preview';

const { Content } = Layout;

export default class Dash extends React.Component <IDashProps, IGlobalState> {
  public divElement: HTMLDivElement | null = null;

  constructor(props: IDashProps) {
    super(props);
    this.state = {
      autoComp: [],
      collapsed: false,
      fallbackWidth: 0,
      forceData: null,
      height: 0,
      histories: [],
      preview: null,
      renderDynamic: null,
      search: 'Mammal',
      searchH1: 'Mammal',
      searchLoading: true,
      searchRes: [],
      userInfo: props.userInfo,
      view: 'wikipedia',
      width: 0,
    };
  }

  


  

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    const height = this.divElement !== null ? this.divElement.clientHeight : 0;
    const width = this.divElement !== null ? this.divElement.clientWidth : 0;
    const fallbackWidth = width

    console.log('mounted', {width}, {height}, this.divElement);
    this.setState({height, width, fallbackWidth}, () => this.postWiki());
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  public render() {

    const { collapsed, forceData, histories, height, width, autoComp, preview, renderDynamic, search, searchH1, searchLoading, searchRes, userInfo, view } = this.state;

    const wikiView = (forceData !== null ?
      (
        <Force
          width={width}
          height={height}
          data={forceData}
          view={view}
          loadPreview={this.loadPreview}
          removePreview={this.removePreview}
          handleEv={this.handleD3Ev} />
      ) :
      (<div style={{ height: '100%', width: '100%' }}>
        <Spin size="large" />
      </div>
      )
    );

    const googleView = this.state.view === 'googleExplore' && forceData !== null ? (
      <Force
        width={width}
        height={height}
        data={forceData}
        view={view}
        loadPreview={this.loadPreview}
        removePreview={this.removePreview}
        handleEv={this.handleD3Ev} />
    ) : (
      <div style={{ height: searchLoading ? '100vh' : '100%' }}>
        <List
          size="large"
          header={<h1><Icon type="google"/> Search Results for: {searchH1}</h1>}
          bordered={true}
          loading={searchLoading}
          dataSource={searchRes}
          renderItem={(item: any) => (
            <List.Item actions={[<Button onClick={() => this.exploreGoog(item)} key={item.title.split(' ')[0]} size={"small"}>Explore</Button>, <Button target="_blank" href={item.link} key={item.title.split(' ')[0]} size={"small"}>Open</Button>]}>
              <List.Item.Meta
                title={<a href={"#"} onClick={() => this.loadPreviewGoog(item.link)}>{item.title}</a>}
                description={item.description}
              />
            </List.Item>)}
        />
        </div>
      )

    const searchView = (
      <List
        itemLayout="vertical"
        size="large"
        header={
          <h1>
            <Icon type="book" /> 
            Research Histories
          </h1>
        }
        pagination={{
          onChange: (page: any) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={histories}
        renderItem={(item: any) => {
          console.log('the item in list is', item);
          return (
            <List.Item
              key={item.id}
            // actions={[<IconText type="star-o" text="156" key="1" />, <IconText type="like-o" text="156" key="2" />, <IconText type="message" text="2" key="3" />]}
            // extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
            >
              <List.Item.Meta
                title={
                <Tooltip title={renderDynamic === item.id ? `Lock "${item.name}" history` : `Unlock "${item.name}" history`}>
                  <a href={'#'} onClick={(e: any) => {e.preventDefault(); this.setState({ renderDynamic: renderDynamic === item.id ? null : item.id })}}>
                      {item.name.toUpperCase()}
                      {renderDynamic === item.id ?
                        <Icon type="unlock" style={{
                            cursor: 'pointer',
                            transition: 'color .3s'
                          }}
                        /> :
                        <Icon type="lock" style={{
                            cursor: 'pointer',
                            transition: 'color .3s'
                          }}
                        />
                      }
                    </a>
                  </Tooltip>
                }
                // description={JSON.stringify(item.nodes)}
              />
              {/* <div ref={divElement => { this.divElement = divElement }} style={{
                height: '100%', width: 'inherit'
              }}
                // onClick={(e: any) => {e.preventDefault(); this.setState({ renderDynamic: renderDynamic === item.id ? null : item.id })}}
              > */}
                {this.state.renderDynamic === item.id && forceData !== null ? (
                  <HistoryGraph history={item} height={height/3.5} width={width} user={this.props.userInfo}/>
                      ) : (
                    <StaticHistGraph history={item} height={height/3.5} width={width} loadPreview={this.loadPreview} />
                  )}
              {/* </div> */}
            </List.Item>
          )
        }}
      />
    );

    const viewSwitcher = () => (
      view === 'wikipedia' ? wikiView :
        view === 'google' || view === 'googleExplore'? googleView :
          view === 'searches' ? searchView :
            (<Spin size="large" />) 
    );

    console.log('rendering')

    return (
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }} hasSider={true}>
        <Nav collapsed={this.state.collapsed} select={this.chgView} view={view} />
        <Layout>
          <Head
            collapsed={collapsed}
            toggleSider={this.toggleNav}
            suggestions={autoComp}
            input={search}
            ctrlInput={this.controlledACInput}
            ctrlSelect={this.controlledAutoComp}
            view={view}
            menuClick={this.chgView}
            postGoog={this.postGoog}
            postWiki={this.postWiki}
            logOut={this.props.logOut}
            userInfo={userInfo}
          />
          <Crumbs preview={preview} search={search} view={view}/>
          <Layout hasSider={preview !== null ? true : false} id="wrapper">
            <Content
              style={{ margin: '1.6vw', padding: '1vw', background: '#fff', height: '100%' }}
            >
            <div 
              id="mount" 
              ref={divElement => { this.divElement = divElement }} 
              style={{ 
                height: this.state.view === 'wikipedia' || this.state.view === 'googleExplore' ? 'calc(100vh - (74px + 2.6vw * 2))' : 'inherit'
              }}>
              {viewSwitcher()}
            </div>
            </Content>
            {preview !== null && <Preview {...preview} removePreview={this.removePreview} />}
          </Layout>
        </Layout>
      </Layout>
    );
  }

  private getUserGraphs() {
    Axios.get('/api/histories')
    .then((result: any) => {
      console.log('fetched results from histories', result.data)
      this.setState({ histories: result.data });
    })
    .catch((err: any) => {
      console.log(err);
    })
  }

  private postGoog = () => {
    Axios.post('/api/googleSearch', { link: `https://en.wikipedia.org/wiki/${this.state.search}`, query: this.state.search })
      .then((recs) => {
        // fix on backend, remove first and last empty string results
        const searchRes = recs.data.filter((result: any) => {
          if (result.title !== '') {
            return result;
          }
        }); 

        console.log('results from google search route', searchRes);

        this.setState({
          searchH1: this.state.search,
          searchLoading: false,
          searchRes
        });
      })
      .catch((err) => console.error(err));
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

  private exploreGoog = (item: any) => {
    this.setState({
      searchLoading: true
    }, () => {
      Axios.post('api/webRecommendations', { link: item.link, query: item.title})
        .then((recs) => {
          const forceData: IData = recs.data;
  
          console.log('forcedata in googExplore', forceData);
  
          this.setState({
            forceData,
            view: 'googleExplore'
          })
        })
        .catch((err) => console.error(err))
    })
    
  }

  private handleResize = () => this.setState({
    fallbackWidth: this.divElement !== null ? this.divElement.clientWidth : 0,
    height: this.divElement !== null ? this.divElement.clientHeight : 0,
    width: this.divElement !== null ? this.divElement.clientWidth : 0,
  })


  private toggleNav = () => {
    const { collapsed } = this.state;
    
    const width = collapsed ? this.state.width - 120 : this.state.width + 120;

    this.setState({
      collapsed: !collapsed,
      width,
    })
  }

  private chgView = (e: { key: string; }) => {
    
    this.setState({
      view: e.key,
    }, () => {
      const { view } = this.state;
      
      return view === 'google' ? this.postGoog() : view === 'wikipedia' ? this.postWiki() : view === 'searches' ? this.getUserGraphs() : null;
    });
  }

  private controlledACInput = (e: React.FormEvent<EventTarget> | string): void => {
    if (typeof e !== 'string') {
      const target = e.target as HTMLInputElement
      const debouncedAC = debounce(() => this.getAutoComp(target.value), 300);
      this.setState({ search: target.value })
      debouncedAC();
    } else {
      this.setState({
        search: e
      });
    }
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
    const wrapper: any =  document.getElementById('wrapper')
    const newWidth: number = (wrapper.clientWidth - (wrapper.clientWidth * .396)) 

    if (this.state.view === 'wikipedia') {
      console.log('toggling preview', {e});
      this.setState({
        preview : {name: e.id, lookup: e.id, x: e.x, y: e.y, searchType: this.state.view},
        width: newWidth
      });
    } else if (this.state.view === 'googleExplore') {
      this.setState({
        preview : {name: e.id, lookup: e.link, x: e.x, y: e.y, searchType: this.state.view},
        width: newWidth
      }); 
    } else if (this.state.view === 'searches') {
      this.setState({
        preview : {name: '', lookup: e, x: 0, y: 0, searchType: this.state.view},
        width: newWidth
      }); 
    }
  }

  private loadPreviewGoog = (link: string) => {
    const wrapper: any =  document.getElementById('wrapper')
    const newWidth: number = (wrapper.clientWidth - (wrapper.clientWidth * .396)) 

    this.setState({
      preview: {name: '', lookup: link, x: 0, y: 0, searchType: this.state.view},
      width: newWidth
    })
  }

  private removePreview = () => {
    this.setState({
      preview: null,
      width: this.state.fallbackWidth
    });
  }

}
