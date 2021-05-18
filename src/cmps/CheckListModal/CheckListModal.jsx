
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form";

import './CheckListModal.scss'

export function CheckListModal(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const setTitle = data => {
        const newChecklistToSend = { title: data.title, list: [], range: 0 }
        props.addChecklist(newChecklistToSend)
        props.setChecklistModal(false)
    }
    return (
        <div className="checklist-modal" >
            <section className="checklist-modal-header">
                <h3>Add Checklist</h3>
                <p className="btn-close-icon" onClick={() => props.setChecklistModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </section>
            <form className="checklist-modal-main" onSubmit={handleSubmit(setTitle)}>
                <label>Title</label>
                <input type="text" autoComplete="off" id="title" name="title"  {...register("title")} defaultValue='' />
                <button>Add</button>
            </form>
        </div>
    )
}
