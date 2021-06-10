import './DrawNoteModal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useEffect, useState } from "react";

export function DrawNoteModal(props) {
    useEffect(() => {
        // console.log('in here');
    })
    const [color, setColor] = useState('#000000')
    return (
        <div className="draw-note-modal">
            <section className="draw-note-modal-header">
                <h3>Draw Note</h3>
                <p className="btn-close-icon" onClick={() => props.setdrawNoteModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </section>
            <section className="draw-note-modal-body">
                <div className="canvas-container">
                    {/* <CanvasToDraw color={color} ></CanvasToDraw> */}
                </div>
                <h1>nanananana</h1>
            </section>
        </div>
    )
}







