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
                {!props.currTask.attachments.length ?null: < div >
                    <h4>ATTACHMENTS:</h4>
                    <div className="cover-attachments-container">
                        {props.currTask.attachments.map((attach) => {
                            return <Color crossOrigin="anonymous" key={attach._id} src={attach.src} format="hex">
                                {({ data, loading }) => {
                                    if (loading) return <div>Loading...</div>;
                                    return <div className="cover-attach" style={{ backgroundColor: data, backgroundImage: `url(${attach.src})` }} onClick={() => props.addCover(attach.src)} />
                                }}
                            </Color>
                        })}
                    </div>
                </div>}
                
                <Cloudinary cloudOp={props.cloudOp} currCard={props.currCard} className="add-attachment-cover-btn" txt='Upload photo' type='cover' currTask={props.currTask} />
                {props.currTask.cover && <button className="remove-cover-btn" onClick={() => props.addCover('')}>Remove cover</button>}
            </div>
        </section >
    )
}
