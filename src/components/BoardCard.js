import React from 'react';
import { Link } from 'react-router-dom';
import '../css/BoardCard.css';

const BoardCard = ({ list, page, keyword }) => {
    return (
        <div className="grid-container">
            {list ? (
                list.map((item, index) => (
                    <Link
                        key={index}
                        to={`/board/view?seqno=${item.seqno}&page=${page}&keyword=${keyword}`}
                        className="btn btn-primary"
                    >
                        <div className="grid-item">
                            <div className="card-body">
                                <div className="badge-container">
                                    {item.ansim_cnt >= 10 && item.ansim_cnt < 30 && (
                                        <img src="path_to_badge_1.png" alt="Badge 1" />
                                    )}
                                    {item.ansim_cnt >= 30 && item.ansim_cnt < 50 && (
                                        <img src="path_to_badge_2.png" alt="Badge 2" />
                                    )}
                                </div>
                                <h3 className="card-title display-3">{item.title}</h3>
                                <div className="point">
                                    <h4 className="card-title display-4">출발지: {item.departure}</h4>
                                    <h4 className="card-title display-4">목적지: {item.destination}</h4>
                                </div>
                                <p className="card-text font-weight-bold">작성자: {item.user_id}</p>
                                <p className="card-text">{item.content}</p>
                                <div className="point">
                                    <p className="card-text">조회수: {item.hitno}</p>
                                    <p className="card-text">작성일: {item.regdate}</p>
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