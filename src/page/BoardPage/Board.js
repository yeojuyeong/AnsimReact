import BoardList from '../../components/BoardList';
import BoardWrite from '../../components/BoardWrite';
import {Route, Routes} from "react-router-dom";
import React from "react";
import BoardView from "../../components/BoardView";
import BoardModify from "../../components/BoardModify";

const Board = () => {

    return (
        <Routes>
            <Route path="/list/*" element={<BoardList />} />
            <Route path="/write" element={<BoardWrite />} />
            <Route path="/view/*" element={<BoardView />} />
            <Route path="/modify/*" element={<BoardModify />} />
        </Routes>
    )

}
export default Board;