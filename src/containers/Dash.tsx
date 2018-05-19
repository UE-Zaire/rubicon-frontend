/* tslint:disable:no-console jsx-no-lambda */
import { Avatar, Icon, Layout, List, Spin } from "antd";
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
    preview: null,
    renderChild: false,
    search: 'Mammal',
    searchH1: 'Mammal',
    searchRes: [],
    view: 'wikipedia',
    width: 0,
  };

  public divElement: HTMLDivElement | null = null;

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    const height = window.innerHeight > 1100 ? window.innerHeight * .88 : window.innerHeight * .82;
    const width = window.innerWidth > 2500 ? window.innerWidth * .888 : window.innerWidth * .80;

    console.log('mounted');
    this.setState({height, width}, () => this.postWiki());
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  public render() {
    console.log('rendering ', this.state.forceData);

    const { collapsed, forceData, height, width, autoComp, preview, search, searchH1, searchRes, view } = this.state;

    const wikiView = (forceData !== null ?
      (
        <div ref={divElement => { this.divElement = divElement }} style={{
          height: '100vh', width: 'inherit'
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
    );

    const googleView = (
        <List 
        size="large"
        header={<div><Icon type="google" style={{fontSize: '20px'}}/> Search Results for: {searchH1}</div>}
        bordered={true}
        dataSource={searchRes}
        renderItem={(item: any) => (<a href={item.link}><List.Item>{item.title}</List.Item></a>)}
        />
    );



    const listData = [];
    for (let i = 0; i < 23; i++) {
      listData.push({
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        href: 'http://ant.design',
        title: `ant design part ${i}`,
      });
    }

    const IconText = (dataT: any) => {

      const { type, text } = dataT;


      return (
        <span>
          <Icon type={type} style={{ marginRight: 8 }} />
          {text}
        </span>
      );
    }

    const searchView = (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page: any) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={listData}
        // footer={<div><b>ant design</b> footer part</div>}
        renderItem={(item: any) => (
          <List.Item
            key={item.title}
            actions={[<IconText type="star-o" text="156" key="1" />, <IconText type="like-o" text="156" key="2" />, <IconText type="message" text="2" key="3" />]}
            extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    );

    const viewSwitcher = () => (
      view === 'wikipedia' ? wikiView :
        view === 'google' ? googleView :
          view === 'searches' ? searchView :
            (<Spin size="large" />) 
    );

    return (
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }} hasSider={true}>
        <Nav collapsed={this.state.collapsed} select={this.chgView} view={view} />
        <Layout style={{ height: '100%' }}>
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
          />
          <Layout hasSider={preview !== null ? true : false}>
            <Content
              style={{ margin: '1.6vw', padding: '1vw', background: '#fff', height: '100%' }}
              id="mount"
            >
              {viewSwitcher()}
            </Content>
            {preview !== null ? <Preview {...preview} removePreview={this.removePreview} /> : null}
          </Layout>
        </Layout>
      </Layout>
    );
  }

  private postGoog = () => {
    Axios.post('/api/googleSearch', { link: `https://en.wikipedia.org/wiki/${this.state.search}`, query: this.state.search })
      .then((recs) => {
        const searchRes = recs.data; 

        console.log(searchRes);

        this.setState({
          searchH1: this.state.search,
          searchRes,
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

  private chgView = (e: { key: string; }) => {
    
    this.setState({
      view: e.key,
    }, () => (
      this.state.view === 'google' ? this.postGoog() : null
    ));
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
