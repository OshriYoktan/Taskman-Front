import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form";
import './CheckListModal.scss'

export function CheckListModal(props) {
    const { register, handleSubmit } = useForm();

    const setTitle = data => {
        data.title=data.title.replace(/'|"/g, '\\"')
        const newChecklistToSend = { title: data.title, list: [], range: 0 }
        props.handleChecklist(newChecklistToSend)
        props.setChecklistModal(false)
    }

    return (
        <div className="checklist-modal" >
            <div className="modal-header">
                <h3>Add Checklist</h3>
                <p className="btn-close-icon" onClick={() => props.setChecklistModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </div>
                <h3>Title:</h3>
            <form onSubmit={handleSubmit(setTitle)}>
                <input type="text" placeholder="Checklist title" autoComplete="off" id="title" name="title"  {...register("title")} defaultValue='' />
                <button>Add checklist</button>
            </form>
        </div>
    )
}
