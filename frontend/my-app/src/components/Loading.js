import React, { Component } from 'react';

export default function Loading(props) {

    const style = {
        paddingTop: "40vh"
    }

    return (
        <div className="Loading" style={style}>
            <h2>{props.text ? props.text : "Loading ..."}</h2>
        </div>
    );
}