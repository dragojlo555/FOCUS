import React from 'react';
import {Icon} from "antd";
import {URL} from "../../../axios-conf";

const PreviewFile = (props) => {
    let files = props.content.split('$$').map(el => {
        return el !== '' ? <div key={el}>
            <Icon type="cloud-download"/>
            <a rel="noopener noreferrer" style={{color: !props.home ? 'white' : '#335fff'}}
               href={URL + el.split(';')[0]} target='_blank' download>{el.split(';')[1]}</a>
        </div> : null
    });
    return (
        <div>
            {files}
        </div>
    )
};

export default PreviewFile;