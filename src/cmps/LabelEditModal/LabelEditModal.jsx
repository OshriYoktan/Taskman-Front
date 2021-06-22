import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import './LabelEditModal.scss'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { saveBoard } from '../../store/actions/boardActions';

export function LabelEditModal(props) {
    const { labelEditModal, currBoard } = props
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm();


    const onChangeEditLabel = (data) => {
        labelEditModal.desc = data.labelName
        labelEditModal.color = data.labelColor
        props.setLabelModal(labelEditModal)
        dispatch(saveBoard({ ...currBoard }))
        props.setLabelEditModal(false)
    }
    return (
        <div className="label-edit-modal">
            <div className="labels-edit-modal-header">
                <button onClick={() => props.setLabelEditModal(false)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <h3>Edit Label</h3>
                <button className="btn-close-icon" onClick={() => props.setLabelModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit(res => onChangeEditLabel(res))}>
                <p>Name:</p>
                <input type="text" name="edit-name" autoComplete="off" defaultValue={labelEditModal.desc} {...register('labelName')} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} />
                <p>Color:</p>
                <input type="color" name="edit-color" className="edit-color" defaultValue={labelEditModal.color} {...register('labelColor')} />
                <button>Save</button>
            </form>
        </div>
    )
}