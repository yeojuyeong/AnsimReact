// import '../../css/MainPage.css';
import InfoPage from '../InfoPage/InfoPage';
import {TbMapSearch} from "react-icons/tb";
import {Link} from "react-router-dom";
import React from "react";

const MainPage = () => {

    const mainDiv={
        margin : '15% 30%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', // 이 부분이 상속될 수 있음
    }

    const logo={
        width: '30%',
    }
    const logoMain={
        width: '100%',
        fontSize:'40px'
    }
    const iconStyle = {
        verticalAlign: '-2.8px', // 아이콘과 텍스트를 수직으로 정렬
        marginRight: '1px', // 아이콘과 텍스트 사이의 간격 조절
    };

    return (
        <>
            <div style={mainDiv}>
                <div style={logoMain}>
                    안심동행
                </div><br/>
                <div style={logoMain}>
                    <img style={logo} src="/images/steak2.png"/>
                </div><br />
                <div>
                    안전한 귀갓길 동행으로 편안하게<br/><br/>
                    <Link to="/guide" style={{textDecoration: "none"}}>
                        <TbMapSearch style={iconStyle}/>시작하기
                    </Link>
                </div>
            </div>

        </>
    )
}
export default MainPage;
