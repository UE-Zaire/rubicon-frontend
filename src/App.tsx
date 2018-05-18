/* tslint:disable:no-console jsx-no-lambda */
import Axios from 'axios';
import * as React from 'react';
import './App.css';
import Auth from './containers/Auth';
import Dash from './containers/Dash';

class App extends React.Component {
  public state: any = {
    auth: false
  }

  public componentDidMount () {
    this.getAuthStatus();
  }


  public render() {
    return this.state.auth ? (
      <Dash logOut={this.toggleAuth}/>
    ) : (
      <Auth />
    )
  }

  private toggleAuth = () => {
    this.setState({
      auth: !this.state.auth
    });
  }

  private getAuthStatus = () => {
    Axios.get('/api/logged')
      .then(( { data } ) => {
        console.log('in auth check', data)
        if (data) {
          this.toggleAuth();
        } 
      })
      .catch((err) => console.error(err))
  }

}

export default App;
