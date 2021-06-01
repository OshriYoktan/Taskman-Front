

import { useEffect, useState } from 'react'
import boardService from '../../services/boardService'
import { LabelEditModal } from '../LabelEditModal/LabelEditModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './LabelModal.scss'
import { useSelector } from 'react-redux'

export function LabelModal(props) {
    const [labelEditModal, setLabelEditModal] = useState(null)
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const labels = currBoard.labels

    const chooseLabel = (color) => {
        props.addLabel(color)
    }

    const editLabel = (ev, label) => {
        ev.stopPropagation()
        setLabelEditModal(label)
    }

    return (
        <section >
            {  <div className="label-modal" style={!labelEditModal ? { maxWidth: '280px' } : { maxWidth: 0, border: 'none', visibility: 'visible' }}>
                <div className="labels-modal-header">
                    <h3>Labels</h3>
                    <p className="btn-close-icon" onClick={() => props.setLabelModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <ul className="label-container">
                    {labels.map((label, idx) => {
                        return <li onClick={() => chooseLabel(label)} key={idx}  >
                            <div className="label-to-show" style={{ backgroundColor: `${label.color}` }}>
                                <span>{label.desc}</span>
                                <span>{(props.currTask.labels.find((currLabel) => currLabel.color === label.color) ? <FontAwesomeIcon className="fa" icon={faCheckCircle} /> : null)}</span>
                            </div>
                            <button className="edit-label-btn" onClick={(ev) => editLabel(ev, label)}><FontAwesomeIcon icon={faPencilAlt} /></button>
                        </li>
                    })}
                </ul>
            </div>}
            { labelEditModal && <div onClick={(ev) => ev.stopPropagation()} style={{ position: 'absolute', width: 0 }} ref={props.LabelEditRef}><LabelEditModal setLabelModal={props.setLabelModal} currBoard={currBoard} labelEditModal={labelEditModal} setLabelEditModal={setLabelEditModal} addLabel={props.addLabel}></LabelEditModal></div>}
        </section >
    )
}

