import React, { Component } from '../../node_modules/react';

import { Button, Form, TextArea } from 'semantic-ui-react'


class SearchInput extends Component {
    state = {
        keywords: ''
    }

    getUpperRemoveBlack = (str) => {
        return str.toUpperCase().replace(/\s/gi,"")
    }

    handleChange = (e) => {
        this.setState({
            keywords: e.target.value
        })
    }

    handleSubmit = (e) => {
        // 페이지 리로딩 방지
        e.preventDefault();
        // 키워드 소문자 > 대문자, 빈칸제거
        const trimmedKeyword = this.getUpperRemoveBlack(this.state.keywords)
        // 개별 키워드별로 묶어주기
        const keywordsArray = trimmedKeyword.split(",")
        console.log(keywordsArray.length)
        if (keywordsArray.length > 100) {
            alert('키워드 개수는 100개를 초과할 수 없습니다.')
        } else {
            // 상태값을 onCreate를 통하여 부모에게 전달
            this.props.onCreate(keywordsArray)
            // 상태 초기화
            this.setState({
                keywords: trimmedKeyword
            })
        }
    }
    
    render() {
        return (
            <div className="input-wrapper">
                <Form onSubmit={this.handleSubmit} className="input-form">
                    <TextArea
                        placeholder="키워드를 입력하세요"
                        value={this.state.keywords}
                        onChange={this.handleChange}
                        style={{minHeight:150, minWidth:600, fontSize:15}}
                    />                    
                    <Button type="submit">검색</Button>
                </Form>
            </div>
        );
    }
}

export default SearchInput;