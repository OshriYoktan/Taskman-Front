

import { useEffect, useState } from 'react'
import boardService from '../../services/boardService'
import { LabelEditModal } from '../LabelEditModal/LabelEditModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './LabelModal.scss'
import { useSelector } from 'react-redux'

export function LabelModal(props) {
    const [labelEditModal, setLabelEditModal] = useState(null)
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const labels = currBoard.labels

    const func = (ev) => {
        
    }

    const chooseLabel = (color) => {
        props.addLabel(color)
    }

    const editLabel = (ev, label) => {
        ev.stopPropagation()
        setLabelEditModal(label)
    }
    useEffect(() => {
        // console.log('props.currTask:', props.currTask.labels)
    })
    // const isHasV = (currLabel) => {
    //     // console.log('currLabel:', currLabel)
    //     const a= props.currTask.labels.some((label) => {
    //         // console.log('label.color:', label.color)
    //         // console.log(' currLabel.color:',  currLabel.color)
    //         // console.log('label.color === currLabel.color:', label.color === currLabel.color)
    //         return label.color === currLabel.color
    //     })
    //     console.log('a',a);
    //     return <h1>v</h1>
    // }
    return (
        <section >
            {/* <div className="label-modal" style={`top:${pageY}px}`}> */}
            {/* <button onClick={func}>click</button> */}
            {  <div className="label-modal" style={!labelEditModal ? { maxWidth: 100 + '%' } : { maxWidth: 0, visibility: 'visible' }}>
                <div className="labels-modal-header">
                    <h3>Labels</h3>
                    <p className="btn-close-icon" onClick={() => props.setLabelModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <ul className="label-container">
                    {labels.map((label, idx) => {
                        return <li onClick={() => chooseLabel(label)} key={idx}  >
                            <div className="label-to-show" style={{ backgroundColor: `${label.color}` }}>
                                <span>{label.desc}</span>
                                <span>{(props.currTask.labels.find((currLabel) => currLabel.color === label.color) ? 'v' : null)}</span>
                            </div>
                            <button className="edit-label-btn" onClick={(ev) => editLabel(ev, label)}><FontAwesomeIcon icon={faPencilAlt} /></button>
                        </li>
                    })}
                </ul>
            </div>}
            { labelEditModal && <LabelEditModal setLabelModal={props.setLabelModal} setLabelEditModal={setLabelEditModal} addLabel={props.addLabel}></LabelEditModal>}
        </section >
    )
}

