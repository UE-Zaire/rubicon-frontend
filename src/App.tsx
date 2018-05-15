import { Layout } from "antd";
import * as React from 'react';
import './App.css';
import StaticWiki from './components/staticWiki';
import Force from './dataViz/Force';
import { IData } from './globalTypes';
import logo from './logo.png';


const { Content } = Layout;

interface IAppState {
  data: IData;
  input: string;
  search: string;
}

export default class App extends React.Component<{}, IAppState> {

  public state = {
    data: {
      "links": [
        { "source": "Napoleon", "target": "Myriel", "value": 1 },
        { "source": "Mlle.Baptistine", "target": "Myriel", "value": 8 },
      ],
      "nodes": [
        { "id": "Myriel", "group": 1 },
        { "id": "Napoleon", "group": 1 },
        {"id": "Mlle.Baptistine", "group": 1}
      ],

    },
    input: 'Julius_Caesar',
    search: 'Julis_Caesar',
  }

  public divElement: any = {};

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
        <input placeholder={"input a search!"} value={this.state.input} onChange={this.handleInput}/>
        <button onClick={this.searchDaWikis}>Submit!</button>
        </div>
        <StaticWiki q={this.state.search}/>
        <Content
          style={{ margin: '2rem', padding: '2rem', background: '#fff' }}
        >
          <div ref={divElement => { this.divElement = divElement }} >
            <Force width={window.innerWidth * .9} height={window.innerHeight / 2} data={this.state.data} condRender={this.condRender} />
          </div>
        </Content>
        </div>
    );
  }

  private condRender = () => {

    return true;
  }

  private handleInput = (e: any) => {
    this.setState({
      input: e.target.value
    });
  }

  private searchDaWikis = () => {
    this.setState({
      search: this.state.input
    });
  }
}