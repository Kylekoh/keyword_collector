import React from 'react';
import ReactLoading from "react-loading";

const IsLoading = () => {
    return (
        <div className="loading-container">
            <ReactLoading type="spin" color="black" >
            </ReactLoading>
        </div>
    )
};

export default IsLoading;