/* tslint:disable:no-console jsx-no-lambda */
import { Button, Col, Form, Icon, Layout, Row } from "antd";
import { FormComponentProps } from "antd/lib/form";
// import Axios from 'axios';
// import { debounce } from 'lodash';
import * as React from 'react';
// import Head from "../components/Head";
// import Nav from "../components/Nav";
import "../assets/auth.css";
import * as Logo from "../assets/logo.png"

const { Content, Header, Footer } = Layout;
// const FormItem = Form.Item;


const fontFam = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
SimSun, sans-serif`;


class Auth extends React.Component <FormComponentProps, {}> {

  public state = {

  };

  public componentDidMount() {
    console.log('hi')
  }
  
  public render() {
    return (
      <Layout 
      style={{ 
        background: '#001529', 
        minHeight: '100vh', 
        minWidth: '100vw',
      }}
    >
      <Col
        xs={{
          offset: 0,
        }} 
        sm={{
          offset: 4,
          span: 16,
        }}
        md={{
          offset: 6,
          span: 12,
        }}
        lg={{
          offset: 7,
          span: 10,
        }}
        xl={{
          offset: 8,
          span: 7,
        }}
        xxl={{
          offset: 9,
          span: 6,
        }}
      >
        <Layout
          style={{
            background: '#fff', 
            height: '50%',
            marginBottom: '45%',
            marginTop: '45%',
            minHeight: '600px',
          }}
        >
          <Header
            style={{
              background: '#fff',
              height: '100%',
              marginTop: '10vh',
              width: '100%',
            }}
          >
            <Row
              type="flex"
              align="middle"
              justify="center"
            >
              <Col><img src={Logo} height="80px" style={{ paddingRight: '16px' }}/></Col> 
              <Col>
                <h1 
                  style={{ 
                    color: '#06a9f4', 
                    fontFamily: 'Gill Sans, Avenir', 
                    fontSize: '40px', 
                    marginBottom: 'auto', 
                    marginTop: 'auto', 
                  }}
                >
                  RUBICON
                </h1>
              </Col>
            </Row>
          </Header>
          <Content >
            <Row
              type="flex"
              justify="center"
              align="middle" 
              style={{paddingTop: '6vh'}}
            >
              <Button type="primary" htmlType="submit" href="/api/login" className="login-form-button" style={{  width: '60%', minHeight: '40px'}} >
                  <Row style={{ fontSize: 18, paddingTop: 4 }}><Icon type="google"/>  Login with Google</Row>
              </Button>
            </Row>
          </Content>
        </Layout>
      </Col>
      <Footer
        style={{
          backgroundColor: 'rgb(0, 21, 40)',
          color: 'white',
          fontFamily: fontFam,
          height: '6vh',
          textAlign: 'center',
          width: '100%'
        }}
      >
          Rubicon Explorer Ver.1.0.2 &copy; UE-HRNYC14 2018
      </Footer>
    </Layout>
    );
  }

  // private handleSubmit = (e: any) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   })
  // }
}

const HCAuth: any = Form.create()(Auth);

export default HCAuth;

{/* <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
<Content style={{backgroundColor: '#001529'}}>
  <Col span={8} offset={8} >
    <Row style={{paddingTop: '10vh'}}>
        <Content style={{background: '#fff', height: '60vh'}}>
          <Col span={10} offset={7}>
            <Row style={{paddingTop: '6vh'}}>
              <Col style={{paddingBottom: '4vh'}}>
                <Row type={"flex"} align={"middle"}>
                  <img src={Logo} width={'30%'} height={'30%'}/> 
                  <h1 style={{ color: '#096dd9', marginTop: '6%', paddingLeft: '6%', fontSize: window.innerWidth /54, letterSpacing: '.02em', fontWeight: 400, fontFamily: 'Avenir', verticalAlign: 'center' }}>
                    RUBICON
                  </h1>
                </Row>
              </Col>
              <Button type="primary" htmlType="submit" href="/api/login" className="login-form-button" style={{  width: '100%', minHeight: '40px'}} >
                  <Row style={{ fontSize: 18, paddingTop: 4 }}><Icon type="google"/>  Login with Google</Row>
              </Button>
              <br/>
              <br />
              <br />
              <p style={{textAlign: "center"}}>OR</p>
              <br />
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
              <FormItem id={"components-form-demo-normal-login"}>
                <Row>
                  {getFieldDecorator('remember', {
                    initialValue: true,
                    valuePropName: 'checked',
                  })(
                    <Col span={14}>
                      <Checkbox>Remember me</Checkbox>
                    </Col>
                  )}
                  <Col span={10}>
                    <a className="login-form-forgot" href="" >Forgot password</a>
                  </Col>
                </Row>
                  <Button type="primary" htmlType="submit" href="/api/login" className="login-form-button" style={{  width: '100%'}}>
                    Log in
                  </Button>
                <br />
                <p style={{textAlign: "center"}}>Or <a href="">register now!</a></p>
              </FormItem>
              </Form>
            </Row>
          </Col>
        </Content>
    </Row>
  </Col>
</Content>
</Layout> */}