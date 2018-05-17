import * as React from 'react';
import './App.css';
import Auth from './containers/Auth';
import Dash from './containers/Dash';

class App extends React.Component {
  public state: any = {
    auth: true
  }


  public render() {
    return this.state.auth ? (
      <Dash logOut={this.toggleAuth}/>
    ) : (
      <Auth logIn={this.toggleAuth}/>
    )
  }

  private toggleAuth = () => {
    this.setState({
      auth: !this.state.auth
    });
  }


}

export default App;
