/* tslint:disable:no-console jsx-no-lambda */
import { Button, Checkbox, Col, Form, Icon, Input, Layout, Row } from "antd";
import { FormComponentProps } from "antd/lib/form";
// import Axios from 'axios';
// import { debounce } from 'lodash';
import * as React from 'react';
// import Head from "../components/Head";
// import Nav from "../components/Nav";
import "../assets/auth.css";
import * as Logo from "../assets/logo.png"

const { Content } = Layout;
const FormItem = Form.Item;

class Auth extends React.Component <FormComponentProps, {}> {

  public state = {

  };

  public componentDidMount() {
    console.log('hi')
  }
  
  public render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Content style={{backgroundColor: '#001529'}}>
          <Col span={8} offset={8} >
            <Row style={{paddingTop: '10vh'}}>
                <Content style={{background: '#fff', height: '50vh'}}>
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
                          <Button type="primary" htmlType="submit" href="http://localhost:3005/login" className="login-form-button" style={{  width: '100%'}}>
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
      </Layout>
    );
  }

  private handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    })
  }
}

const HCAuth: any = Form.create()(Auth);

export default HCAuth;

