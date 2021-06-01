import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import boardService from '../../services/boardService'
import Color from 'color-thief-react';
import './CoverModal.scss'

export function CoverModal(props) {
    const [coverColors, setCoverColors] = useState(boardService.getCoverColors())

    return (
        <div className="cover-modal">
            <section className="cover-modal-header">
                <h3>Cover</h3>
                <p className="btn-close-icon" onClick={() => props.setCoverModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </section>
            <section className="cover-modal-body">
                <h4>COLORS:</h4>
                <div className="cover-color-container">
                    {coverColors.map((color, idx) => <span className="cover-color" key={idx} onClick={() => props.addCover(color)} style={{ backgroundColor: color }}></span>)}
                </div>
                {!props.currTask.attachments.length ? <div>
                    <button className="add-attachment-cover-btn" onClick={props.onButtonClick}>Upload a cover image</button>
                    <input id="file" type="file" accept="image/*" onChange={props.onAttChange} ref={props.inputFile} name="name" style={{ display: 'none' }} />
                </div> : <div>
                    <h4>ATTACHMENTS:</h4>
                    <div className="cover-attachments-container">
                        {props.currTask.attachments.map((attach) => {
                            return <Color key={attach._id} src={attach.src || 'https://images.unsplash.com/photo-1563718428108-a2420c356c5c?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'} format="hex">
                                {({ data, loading, error }) => (<div className="cover-attach" style={{ backgroundColor: data, backgroundImage: `url(${attach.src || 'https://images.unsplash.com/photo-1563718428108-a2420c356c5c?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'})` }} onClick={() => props.addCover(attach.src)} />)}
                            </Color>
                        })}
                    </div>
                </div>}
                {props.currTask.cover && <button className="remove-cover-btn" onClick={() => props.addCover('')}>Remove cover</button>}
            </section>
        </div>
    )
}
