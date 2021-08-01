import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { saveBoard, setCurrBoard } from '../../store/actions/boardActions';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import boardService from '../../services/boardService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faList, faTimes, faClock, faSquare, faPlus, faPaperclip, faAlignLeft, faComments } from '@fortawesome/free-solid-svg-icons'
import './CardPreview.scss'
import Avatar from 'react-avatar';
import Moment from 'react-moment';
import { socketService } from '../../services/socketService';

export default forwardRef(CardPreview)

function CardPreview(props, ref) {
    const { card, cardPreviewOp } = props
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm();
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [tasks, setTasks] = useState(card.tasks)
    const [isAddTask, setIsAddTask] = useState(null)
    const [isEditTitle, setIsEditTitle] = useState(false)
    const [isCardModal, setIsCardModal] = useState(false)
    var newTask = boardService.getEmptyTask()

    useEffect(() => {
        setIsEditTitle(!isEditTitle)
    }, [currBoard])

    const useOnClickOutside = (ref, handler) => {
        useEffect(
            () => {
                const listener = (event) => {
                    if (!ref.current || ref.current.contains(event.target)) {
                        return;
                    }
                    handler(event);
                };
                document.addEventListener("mousedown", listener);
                document.addEventListener("touchstart", listener);
                return () => {
                    document.removeEventListener("mousedown", listener);
                    document.removeEventListener("touchstart", listener);
                };
            },
            [ref, handler]
        );
    }

    const addTaskRef = useRef()
    useOnClickOutside(addTaskRef, () => setIsAddTask(false));
    const cardModalRef = useRef()
    useOnClickOutside(cardModalRef, () => setIsCardModal(false));

    useImperativeHandle(ref, () => ({
        async setFromOutside(res) {
            const { source, destination } = res
            const card = currBoard.cards.find(c => c._id === source.droppableId)
            if (!card) return
            if (source.droppableId !== destination.droppableId) {
                const from = card
                const to = currBoard.cards.find(c => c._id === destination.droppableId)
                const [removed] = from.tasks.splice(source.index, 1);
                to.tasks.splice(destination.index, 0, removed)
                const cardsToUpdate = [from, to]
                cardsToUpdate.forEach(c => boardService.updateBoard(c, currBoard))
                dispatch(saveBoard(currBoard))
            }
            else {
                const [removed] = card.tasks.splice(source.index, 1)
                card.tasks.splice(destination.index, 0, removed)
                const boardToSave = boardService.updateBoard(card, currBoard)
                dispatch(saveBoard(boardToSave))
            }
        }
    }), [])

    const setCardTitle = data => {
        if (!data.cardTitle) return
        card.title = data.cardTitle.replace(/'|"/g, '')
        const boardToUpdate = boardService.updateBoard(card, currBoard)
        socketService.emit('card to-update-card', card)
        socketService.emit('card to-update-card-title', card)
        setIsEditTitle(false)
        dispatch(saveBoard(boardToUpdate))
    }

    const labelsDescToggle = (ev, bool) => {
        ev.stopPropagation()
        cardPreviewOp.setIsDescShown(bool)
    }

    const doneAtToggle = (ev, task) => {
        ev.stopPropagation()
        if (!task.doneAt) task.doneAt = Date.now()
        else task.doneAt = ''
        socketService.emit('task to-update-task', { card, task })
        const newBoard = boardService.updateCard(task, card, currBoard)
        dispatch(saveBoard(newBoard))
    }

    const addTask = async data => {
        newTask.title = data.newTask
        tasks.push(newTask)
        setTasks(tasks)
        const newBoard = boardService.updateCard(newTask, card, currBoard)
        dispatch(saveBoard(newBoard))
        setIsAddTask(!isAddTask)
        const forSocket = { task: newTask, card: card._id }
        socketService.emit('task to-add-task', forSocket);
        cardPreviewOp.addActivity('Guest', 'added', 'task', card.title)
        newTask = boardService.getEmptyTask()
        reset()
    }

    const backgroundColorDueDate = (task) => {
        return task.doneAt ? '#61BD4F' : ((task.dueDate > Date.now()) ? '#F4F5F7' : '#ec9488')
    }

    const colorDueDate = (task) => {
        return task.doneAt ? 'white' : ((task.dueDate > Date.now()) ? '#8b95a7' : 'white')
    }

    const taskListHeight = () => {
        if (isAddTask) return '60vh'
        if (isCardModal) return '60vh'
        return '65vh'
    }

    return (
        <div className="board-card" onClick={() => cardPreviewOp.setCurrCard(card)}>
            <Droppable droppableId={card._id} key={card._id} type='TASK'>
                {(provided) => {
                    return (<div className="hide-overflow" {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="title">
                            <form onBlur={handleSubmit(setCardTitle)}>
                                <input type="text" required onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); if (e.key === '\'') return }} {...register("cardTitle")} defaultValue={card.title} placeholder="Card name" autoComplete="off" />
                            </form>
                            <div onClick={() => {
                                setIsCardModal(true)
                                // setTimeout(() => setIsCardModal(false), 3000)
                            }} className="manage-card"><p>⋮</p></div>
                        </div>
                        <div className="card-modal" ref={cardModalRef} style={{ maxWidth: isCardModal ? '100vw' : '0' }, { maxHeight: isCardModal ? '100vw' : '0' }}>
                            <button>Delete Card</button>
                        </div>
                        <ul className="hide-overflow" style={{  maxHeight: taskListHeight() }}>
                            {tasks.map((task, idx) => {
                                return (
                                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                                        {(provided) => {
                                            return (<li onClick={() => cardPreviewOp.setCurrTask(task)} key={task._id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} style={{ ...provided.draggableProps.style }} className="card-task">
                                                {(!task.cover) ? null : (task.cover.includes('#')) ? <div className="task-cover-color" style={{ backgroundColor: `${task.cover}` }} ></div> : <div className="task-cover-img" style={{ backgroundImage: `url(${task.cover})` }}></div>}
                                                <div className="label-color-to-preview-container">
                                                    {!cardPreviewOp.isDescShown && task.labels.map((label, idx) => <label key={idx} className="label-color-to-preview" style={{ backgroundColor: `${label.color}` }} onClick={(ev) => labelsDescToggle(ev, true)}></label>)}
                                                    {cardPreviewOp.isDescShown && task.labels.map((label, idx) => <label key={idx} className="label-color-open-to-preview" style={{ backgroundColor: `${label.color}` }} onClick={(ev) => labelsDescToggle(ev, false)}>{label.desc}</label>)}
                                                </div>
                                                <span>{task.title}</span>
                                                <section className="container-of-all">
                                                    <section className="buttom-preview-info">
                                                        {!task.dueDate ? null : !task.doneAt ?
                                                            <div className="due-date-to-preview" style={{ color: colorDueDate(task), backgroundColor: backgroundColorDueDate(task) }} onClick={(ev) => doneAtToggle(ev, task)}>
                                                                <FontAwesomeIcon className="icon font-awesome-clock" icon={faClock} /><FontAwesomeIcon className="icon font-awesome-home" icon={faSquare} /><Moment format="MMM D" withTitle>{task.dueDate}</Moment>
                                                            </div> :
                                                            <div className="due-date-to-preview" style={{ color: colorDueDate(task), backgroundColor: backgroundColorDueDate(task) }} onClick={(ev) => doneAtToggle(ev, task)}>
                                                                <FontAwesomeIcon className="icon font-awesome-clock" icon={faClock} /><FontAwesomeIcon className="icon font-awesome-check-square" icon={faCheckSquare} /><Moment format="MMM D" withTitle>{task.dueDate}</Moment>
                                                            </div>}
                                                        {!task.attachments.length ? null : <div><FontAwesomeIcon icon={faPaperclip} /> {task.attachments.length} </div>}
                                                        {!task.desc ? null : <div><FontAwesomeIcon icon={faAlignLeft} /></div>}
                                                        {!task.comments.length ? null : <div><FontAwesomeIcon icon={faComments} />{task.comments.length}</div>}
                                                        {(!task.checklists.length || (task.checklists.reduce((acc, checklist) => checklist.list.length + acc, 0) <= 0)) ? null :
                                                            <p> <FontAwesomeIcon icon={faList} />{task.checklists.reduce((accTotal, checklist) => {
                                                                return accTotal + checklist.list.reduce((acc, itemInList) => itemInList.isChecked + acc, 0)
                                                            }, 0)}/
                                                                {task.checklists.reduce((acc, checklist) => checklist.list.length + acc, 0)}
                                                            </p>}
                                                    </section>
                                                    {!task.members.length ? null : <div className="avatar-card-preview">
                                                        {task.members.map((member, idx) => <Avatar key={idx} name={member.name} size="30" round={true} />)}
                                                    </div>}
                                                </section>
                                            </li>)
                                        }}</Draggable>)
                            })}
                            {provided.placeholder}
                        </ul>
                        {(!isAddTask && card.title !== 'No search results.') && <button className="add-task-btn" onClick={() => setIsAddTask(!isAddTask)}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add task</button>}
                        {isAddTask && <form ref={addTaskRef} className="add-task-container" onSubmit={handleSubmit(addTask)}>
                            <input type="text" id="title" name="title" autoComplete="off" required {...register("newTask")} placeholder="Enter a title for this card" defaultValue={newTask.title} />
                            <div className="add-task-btns">
                                <button>Add Task</button>
                                <button onClick={() => setIsAddTask(!isAddTask)} className="btn-close-icon"><FontAwesomeIcon className="fa" icon={faTimes} /></button>
                            </div>
                        </form>}
                    </div>)
                }}</Droppable>
        </div >
    )
}