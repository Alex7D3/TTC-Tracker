import React from "react";

export default function PopupList({ clickFunction, items }) {
    return (
        <div className="list-group position-absolute z-1">{
                items.map((item, idx) => 
                    <button key={idx}
                        className={
                            "list-group-item list-group-item-action position-relative z-2"
                        }
                        onMouseDown={() => clickFunction(idx)}
                    >{item.title}</button>
                )   
        }</div>
    );
}