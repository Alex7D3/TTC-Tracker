import React from 'react';

export default function PopupList({ items, isOpen }) {
    if(!isOpen) return null;
    return (
        <datalist className="list-group">{
                items && items.map((item, idx) => 
                    <option key="idx" className="list-group-item">
                        {item.name}
                    </option>
                )   
        }</datalist>
    );
}