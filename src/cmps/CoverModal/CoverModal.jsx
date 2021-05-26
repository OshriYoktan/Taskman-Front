import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import boardService from '../../services/boardService'

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
                <h4>ATTACHMENTS:</h4>
                <div className="cover-attachments-container">
                    {console.log('props.currTask.attachments:', props.currTask.attachments)}
                    {props.currTask.attachments.map((attach) => {
                        console.log('attach:', attach)
                        return <img className="cover-attach" key={attach._id} onClick={() => props.addCover(attach.src)} src={attach.src} alt={attach.title}/>
                    })}
                </div>
                <h4>hahahahha</h4>
                <h4>i made another component matherfuckers</h4>
            </section>
        </div>
    )
}
