import './DrawNoteModal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

export function DrawNoteModal(props) {
    const {
        width = 100,
        height = 100,
        pixelRatio = window.devicePixelRatio
    } = props;

    const canvas = useRef(null);

    useEffect(() => {
        const context = canvas.current.getContext("2d");

        context.save();
        context.scale(pixelRatio, pixelRatio);
        context.fillStyle = "green";
        context.fillRect(0, 0, width, height);

        context.strokeStyle = "purple";
        context.beginPath();
        context.arc(width / 2, height / 2, width / 4, 0, Math.PI * 2);
        context.stroke();
        context.restore();
    });
    const dw = Math.floor(pixelRatio * width);
    const dh = Math.floor(pixelRatio * height);
    const style = { width, height };
    return (
        <div className="draw-note-modal">
            <section className="draw-note-modal-header">
                <h3>Draw Note</h3>
                <p className="btn-close-icon" onClick={() => props.setdrawNoteModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </section>
            <section className="draw-note-modal-body">
                <canvas ref={canvas} width={dw} height={dh} style={style} />
                <h1>nanananana</h1>
            </section>
        </div>
    )
}







