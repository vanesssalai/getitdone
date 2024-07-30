import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";

import Format from "../../layout/Format";

export default function TaskManager() {
    const { userID } = useParams();

    return (
        <Format content={
            <>
                <h1> jiayou</h1>
                <button><FaPlus /> Add New </button>
            </>
        } />
    )
}