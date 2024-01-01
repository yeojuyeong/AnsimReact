import React from 'react';
import { Link } from 'react-router-dom';
import '../css/BoardCard.css';
import protecting from "../images/protecting.jpg"
import madongrock from "../images/madongrock.png"

const BoardCard = ({ list, page, keyword }) => {
    return (
        <div className="grid-container">
            {list ? (
                list.map((item, index) => (
                    <Link
                        key={index}
                        to={`/board/view?seqno=${item.seqno}&page=${page}&keyword=${keyword}`}
                        className="btn-primary"
                    >
                        <div className="grid-item">
                            <div className="badge-container">
                                {item.ansim_cnt >= 10 && item.ansim_cnt < 30 && (
                                    <img src={protecting} alt="Badge 1"/>
                                )}
                                {item.ansim_cnt >= 30 && item.ansim_cnt < 50 && (
                                    <img src={madongrock} alt="Badge 2"/>
                                )}
                            </div>
                            <div className="card-body">
                                <h3 className="card-title display-3">{item.title}</h3>
                                <div className="point">
                                    <h4 className="card-title display-4">출발지: {item.departure}</h4>
                                    <h4 className="card-title display-4">목적지: {item.destination}</h4>
                                </div>
                                <p className="card-text font-weight-bold">작성자: {item.user_id}</p>
                                <h4 className="card-text">{item.content.length > 25 ? item.content.substring(0, 23) + '...' : item.content}</h4>
                                <div className="point">
                                    <p className="card-text">조회수: {item.hitno || 0}</p>
                                    <p className="card-text">작성일: {item.regdate.split(' ')[0]}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-md-12">
                    <p>등록된 게시물이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default BoardCard;