import React, { Component } from 'react';
import './App.css';

import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import SearchInput from './components/SearchInput';
import LoginForm from './components/LoginForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        access_token: '',
        naver_id: '',
        naver_password: '',
        customer_id:'',
        columnDefs: [
            {
                headerName: "검색어",
                children:[
                    {headerName: '키워드', field: 'keyword', width: 100},
                    {headerName: '연관키워드', field: 'KeywordCount.relKeyword', width:150, resizable:true, suppressMenu: true},
                ]
            },
            {
                headerName: "월간 검색량",
                children:[
                    {headerName: 'PC', field: 'KeywordCount.pcMonthlyCount', width: 80},
                    {headerName: '모바일', field: 'KeywordCount.mobileMonthlyCount', width: 80},
                ]
            },
            {
                headerName: "성별검색비율",
                children:[
                    {headerName: 'PC(남)', field: 'KeywordDetail.2.monthlyPcMaleRatio', width: 80},
                    {headerName: 'PC(여)', field: 'KeywordDetail.2.monthlyPcFemaleRatio', width: 80},
                    {headerName: '모바일(남)', field: 'KeywordDetail.3.monthlyMobileMaleRatio', width: 80},
                    {headerName: '모바일(여)', field: 'KeywordDetail.3.monthlyMobileFemaleRatio', width: 80},
                ]
            },
            {           
                headerName: "월간컨텐츠 발행량",    
                children:[
                    {headerName: '블로그', field: 'BlogCount', width: 80},
                    {headerName: '카페', field: 'CafeCount', width: 80},
                    {headerName: '웹사이트', field: 'WebCount', width: 80},
                ]
            },
            {           
                headerName: "키워드 포화지수",    
                children:[
                    {headerName: '블로그', field: 'SaturationRate.blogSaturationRate', width: 80},
                    {headerName: '카페', field: 'SaturationRate.cafeSaturationRate', width: 80},
                    {headerName: '웹사이트', field: 'SaturationRate.webSaturationRate', width: 80},
                ]
            },
            {           
                headerName: "연령별 검색비율",    
                children:[
                    {headerName: '10대미만', field: 'KeywordDetail.1.0', width: 80},
                    {headerName: '10대', field: 'KeywordDetail.1.1', width: 60},
                    {headerName: '20대', field: 'KeywordDetail.1.2', width: 60},
                    {headerName: '30대', field: 'KeywordDetail.1.3', width: 60},
                    {headerName: '40대', field: 'KeywordDetail.1.4', width: 60},
                    {headerName: '50대', field: 'KeywordDetail.1.5', width: 80},
                    {headerName: '50대이상', field: 'KeywordDetail.1.6', width: 80},
                ]
            },
            {           
                headerName: "월간 검색동향",
                children:[
                    {headerName: 'M-12', field: 'KeywordDetail.0.1', width: 70},
                    {headerName: 'M-11', field: 'KeywordDetail.0.2', width: 70},
                    {headerName: 'M-10', field: 'KeywordDetail.0.3', width: 70},
                    {headerName: 'M-9', field: 'KeywordDetail.0.4', width: 70},
                    {headerName: 'M-8', field: 'KeywordDetail.0.5', width: 70},
                    {headerName: 'M-7', field: 'KeywordDetail.0.6', width: 70},
                    {headerName: 'M-6', field: 'KeywordDetail.0.7', width: 70},
                    {headerName: 'M-5', field: 'KeywordDetail.0.8', width: 70},
                    {headerName: 'M-4', field: 'KeywordDetail.0.9', width: 70},
                    {headerName: 'M-3', field: 'KeywordDetail.0.10', width: 70},
                    {headerName: 'M-2', field: 'KeywordDetail.0.11', width: 70},
                    {headerName: 'M-1', field: 'KeywordDetail.0.12', width: 70},
                ]
            },
            {           
                headerName: "섹션배치순서(PC)",    
                children:[
                    {headerName: '1순위', field: 'SectionOrderPc.first', width: 80},
                    {headerName: '2순위', field: 'SectionOrderPc.second', width: 80},
                    {headerName: '3순위', field: 'SectionOrderPc.third', width: 80},
                    {headerName: '4순위', field: 'SectionOrderPc.fourth', width: 80},
                    {headerName: '5순위', field: 'SectionOrderPc.fifth', width: 80}
                ]
            },
            {           
                headerName: "섹션배치순서(모바일)",    
                children:[
                    {headerName: '1순위', field: 'SectionOrderMobile.first', width: 80},
                    {headerName: '2순위', field: 'SectionOrderMobile.second', width: 80},
                    {headerName: '3순위', field: 'SectionOrderMobile.third', width: 80},
                    {headerName: '4순위', field: 'SectionOrderMobile.fourth', width: 80},
                    {headerName: '5순위', field: 'SectionOrderMobile.fifth', width: 80}
                ]
            },        
        ],
            rowData: [],
            gridApi: {},
            gridOptions: {
                defaultColDef: {
                    resizable: true
                }
            }
        }
  }
    
    callApi = async (keyword) => {
        const access_token = this.state.access_token
        const response = await fetch(`http://localhost:5000/keywordlist?keyword=${keyword}&access_token=${access_token}` );
        const body = await response.json()
        console.log(body)

        // 받은 데이터를 기존 rowData와 합쳐준다(concat을 이용, push는 사용 불가)
        this.setState({
            rowData: this.state.rowData.concat(body)
        })
    }

    // array 형태로 keywords를 받아서 하나씩 키워드를 보낸다
    handleCreate = async (keywordsArray) => {
        // 딜레이를 위한 wait 선언
        let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        for(let i=0; i<keywordsArray.length; i++) {
            // keywordsTool이 초당 2~5회 정도의 호출만 허용하기 때문에 
            // 키워드 호출때마다 1초의 딜레이를 부여
            await wait(1200)
            const response = await fetch(`http://localhost:5000/manage/keyword?keyword=${keywordsArray[i]}`);
            const body = await response.json()
            console.log(body)
            const manageResult = body[0].manageResult.managedKeyword
            
            // 적은검색량, 판매금지 키워드 표현값 정의
            const rowDataForLow = [
                {
                    keyword: keywordsArray[i],
                    KeywordCount: {
                        relKeyword: '적은 검색량'
                    }
                
                }
            ]
            const rowDataForProhibit = [
                {
                    keyword: keywordsArray[i],
                    KeywordCount: {
                        relKeyword: '판매금지 키워드'
                    }
                }   
            ]
            // 적은 검색량, 판매금지 키워드/성인 키워드는 추후 과정을 진행하지 않는다
            // 일부노출 키워드는 서버에서 키워드 판별해서 결과값을 보내줌
            if(manageResult.isAdult && manageResult.isSellProhibit) {
                this.setState({
                    rowData: this.state.rowData.concat(rowDataForProhibit)
                })
            } else if ( manageResult.isLowSearchVolume) {
                this.setState({
                    rowData: this.state.rowData.concat(rowDataForLow)
                })
            } else {
                // 올바른 키워드에 대해서만 추후 작업 진행
                this.callApi(keywordsArray[i])
            }
        }
    }
    
    onAccessTokenOpen = async (id, password, customerId) => {
        const response = await fetch(`http://localhost:5000/get/access_token?id=${id}&password=${password}&customerId=${customerId}`);
        const body = await response.json()
        const access_token = body[0]
        this.setState({
            access_token: access_token
        })
    }

    // grid가 준비되면 api를 받아 세팅한다(엑셀 exporting시 사용)
    onGridReady = async (params) => {
        this.gridApi = params.api;
    }

    onBtnExport = () => {
        const params = {
          columnGroups: true,
          allColumns: true,
          fileName: '키워드 검색 결과',
        };
        // 엑셀 exporting 하는 grid API
        this.gridApi.exportDataAsCsv(params);
    }

    onRefreshButton = () => {
        this.setState({
            rowData: ''
        })   
    }

  render() {
    return (

      <div className="App">
        <section className="upper-section">
        <LoginForm onAccessTokenOpen={this.onAccessTokenOpen}></LoginForm>
        <SearchInput 
          onCreate={this.handleCreate}
        />
        </section>
        <div className="ag-theme-balham" style={{height: '400px', width: '1210px', justifyContent: 'center'}}>
            <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                gridOptions={this.state.gridOptions}
                onGridReady={this.onGridReady}>
            </AgGridReact>
        </div>
        <div id="button-container">
            <button onClick={this.onRefreshButton} id="refresh-button">새로고침</button>
            <button onClick={this.onBtnExport} id="excel-button">엑셀 다운로드</button>
        </div>
      </div>
    );
  }
}

export default App;