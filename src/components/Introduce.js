import background from "../images/introduce.png";
const Introduce = () => {
    const divStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover', // 배경 이미지를 커버로 설정
        backgroundRepeat: 'no-repeat', // 배경 이미지 반복 없음
        width: '100vw', // 가로 너비를 뷰포트 전체로 설정
        height: '100vh', // 세로 높이를 뷰포트 전체로 설정
    };

    return (
        <div style={divStyle}>
        </div>
    );
}
export default Introduce;