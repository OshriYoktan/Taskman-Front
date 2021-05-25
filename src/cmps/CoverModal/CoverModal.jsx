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
                <h4>colors:</h4>
                <div className="cover-color-container">
                    {coverColors.map((color) => <span className="cover-color" onClick={() => props.addCover(color)} style={{ backgroundColor: color }}></span>)}
                </div>
                <h4>hahahahha</h4>
                <h4>i made another component matherfuckers</h4>
            </section>
        </div>
    )
}
