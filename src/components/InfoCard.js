const InfoCard = ({ data, index, handleCCTVClick, selectedOption }) => {
    return (
        <div className="card_layout" onClick={(e) => {handleCCTVClick(index, e)}}>
            <div className="card_nm">
                {data.addr_nm ? data.addr_nm : selectedOption === 'cctv' ? 'CCTV' : '안심 비상벨'}
            </div>
            <div className="card_addr">
                <span
                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>
                    지번</span>
                <span
                    style={{ fontSize: '12px', marginLeft: '10px' }}>
                    {data.addr}</span>
            </div>
            <div className="card_cnt">
                <span
                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>
                    갯수</span>
                <span
                    style={{ fontSize: '12px', marginLeft: '10px' }}>
                    {data.quantity}</span>
            </div>
            {data.telno && (
                <div className="card_telno">
                <span
                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>
                    전화번호</span>
                    <span
                        style={{ fontSize: '12px', marginLeft: '10px' }}>
                    010-000-000</span>
                </div>
            )}
        </div>
    )
}
export default InfoCard;