import React, { Component } from 'react';

import { Button, Form } from 'semantic-ui-react'

class LoginForm extends Component {
    state = {
        id: '',
        password:'',
        customerId:''
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        // 페이지 리로딩 방지
        // e.preventDefault();
        const id = this.state.id;
        const password = this.state.password;
        const customerId = this.state.customerId
        this.props.onAccessTokenOpen(id, password, customerId)
        this.setState({
            id:'',
            password:'',
            customerId:''
        })
    }

    render() {
        return (
            <div id="login-container">
                <Form className="login-form">
                    <Form.Field>
                    <label>네이버광고 ID</label>
                    <input type="text" name="id" placeholder='ID' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                    <label>네이버광고 Password</label>
                    <input  type="password" name="password" placeholder='Password'  onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                    <label>Customer-ID</label>
                    <input type="text" name="customerId" placeholder='Customer-ID' onChange={this.handleChange}/>
                    </Form.Field>
                </Form>
                <Button type='submit' id="login-button" onClick={this.handleSubmit}>네어버 광고 로그인</Button>
            </div>
        );
    }
}

export default LoginForm;