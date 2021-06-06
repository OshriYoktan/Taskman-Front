import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import boardService from '../../services/boardService'
import Color from 'color-thief-react';
import './CoverModal.scss'
import { Cloudinary } from '../Cloudinary/Cloudinary'

export function CoverModal(props) {
    const coverColors = boardService.getCoverColors()

    return (
        <section className="cover-modal" style={!props.currTask.cover ? { top: '175px' } : null}>
            <div className="cover-modal-header">
                <h3>Cover</h3>
                <p className="btn-close-icon" onClick={() => props.setCoverModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </div>
            <div className="cover-modal-body">
                <h4>COLORS:</h4>
                <div className="cover-color-container">
                    {coverColors.map((color, idx) => <span className="cover-color" key={idx} onClick={() => props.addCover(color)} style={{ backgroundColor: color }}></span>)}
                </div>
                {!props.currTask.attachments.length ? <div>
                    <Cloudinary currCard={props.currCard} txt='Upload photo' type='cover' currTask={props.currTask} />
                </div> : <div>
                    <h4>ATTACHMENTS:</h4>
                    <div className="cover-attachments-container">
                        {props.currTask.attachments.map((attach) => {
                            return <Color key={attach._id} src={attach.src || 'https://images.unsplash.com/photo-1563718428108-a2420c356c5c?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'} format="hex">
                                {({ data }) => (<div className="cover-attach" style={{ backgroundColor: data, backgroundImage: `url(${attach.src || 'https://images.unsplash.com/photo-1563718428108-a2420c356c5c?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'})` }} onClick={() => props.addCover(attach.src)} />)}
                            </Color>
                        })}
                    </div>
                </div>}
                {props.currTask.cover && <button className="remove-cover-btn" onClick={() => props.addCover('')}>Remove cover</button>}
            </div>
        </section>
    )
}
