import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import './LabelEditModal.scss'

 export function LabelEditModal (props) {

        return (
            <div className="label-edit-modal">
                <div className="labels-edit-modal-header">
                    <button onClick={()=>props.setLabelEditModal(false)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    <h3>Labels</h3>
                    <p className="btn-close-icon" onClick={()=>props.setLabelModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <h1>edit that madafaka label</h1>
            </div>
        )
}
