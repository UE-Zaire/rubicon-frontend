/* tslint:disable:no-console jsx-no-lambda */
import Axios from 'axios';
import * as React from 'react';
import './App.css';
// import HistoryGraph from './components/extensionGraphs/HistoryGraphView';
import Auth from './containers/Auth';
import Dash from './containers/Dash';
import { IAppRouterState } from "./globalTypes";

class App extends React.Component <{}, IAppRouterState> {
  public state = {
    auth: false,
    userInfo: null
  }

  public componentDidMount () {
    this.getAuthStatus();
  }


  public render() {
    return this.state.auth ? (
      <Dash logOut={this.toggleAuth} userInfo={this.state.userInfo}/>
      // <HistoryGraph />
    ) : (
      <Auth />
    )
  }

  private toggleAuth = () => {
    if (this.state.auth) {
      Axios.get('/logout')
        .then((res: any) => {
          this.setState({
            auth: false
          });
        })
        .catch((err) => console.error(err))
    } else {
      this.setState({
        auth: true
      });
    }
  }

  private getAuthStatus = () => {
    Axios.get('/api/logged')
      .then(( { data } ) => {
        console.log('in auth check', data)

        const userInfo = {
          name: data.name,
          profPic: data.image,
        };

        if (data.logged) {
          this.setState({
            userInfo 
          }, () => {
            this.toggleAuth();
          });
        } 
      })
      .catch((err) => console.error(err))
  }

}

export default App;
