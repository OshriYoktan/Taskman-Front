import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { saveBoard, setCurrBoard } from '../../store/actions/boardActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import boardService from '../../services/boardService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faList, faTimes, faClock, faSquare, faPlus, faPaperclip, faAlignLeft, faComments } from '@fortawesome/free-solid-svg-icons'
import './CardPreview.scss'
import Avatar from 'react-avatar';
import Moment from 'react-moment';
import { socketService } from '../../services/socketService';

export function CardPreview(props) {
    const { card, cardPreviewOp } = props
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm();
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [tasks, setTasks] = useState(card.tasks)
    const [isAddTask, setIsAddTask] = useState(null)
    const [isEditTitle, setIsEditTitle] = useState(false)
    var newTask = boardService.getEmptyTask()

    useEffect(() => {
        setIsEditTitle(!isEditTitle)
    }, [currBoard])

    const setCardTitle = data => {
        card.title = data.cardTitle
        const boardToUpdate = boardService.updateBoard(card, currBoard)
        socketService.emit('card to-update-card', card)
        socketService.emit('card to-update-card-title', card)
        setIsEditTitle(false)
        dispatch(saveBoard(boardToUpdate))
        dispatch(setCurrBoard(currBoard._id))
    }

    const labelsDescToggle = (ev, bool) => {
        ev.stopPropagation()
        cardPreviewOp.setIsDescShown(bool)
        dispatch(setCurrBoard(currBoard._id))
    }

    const doneAtToggle = (ev, task) => {
        ev.stopPropagation()
        if (!task.doneAt) task.doneAt = Date.now()
        else task.doneAt = ''
        socketService.emit('task to-update-task', { card, task })
        const newBoard = boardService.updateCard(task, card, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(currBoard._id))
    }

    const addTask = async data => {
        newTask.title = data.newTask
        tasks.push(newTask)
        setTasks(tasks)
        const newBoard = boardService.updateCard(newTask, card, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(currBoard._id))
        setIsAddTask(!isAddTask)
        const forSocket = { task: newTask, card: card._id }
        socketService.emit('task to-add-task', forSocket);
        cardPreviewOp.addActivity('Guest', 'added', 'task', card.title)
        newTask = boardService.getEmptyTask()
        reset({ newTask: '' })
    }

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        card.tasks = items
        setTasks(card.tasks);
        const boardToSave = await boardService.updateBoard(card, currBoard)
        dispatch(saveBoard(boardToSave))
        dispatch(setCurrBoard(currBoard._id))
    }

    const backgroundColorDueDate = (task) => {
        return task.doneAt ? '#61BD4F' : ((task.dueDate > Date.now()) ? '#F4F5F7' : '#ec9488')
    }

    const colorDueDate = (task) => {
        return task.doneAt ? 'white' : ((task.dueDate > Date.now()) ? '#8b95a7' : 'white')
    }
    return (
        <div className="board-card" onClick={() => cardPreviewOp.setCurrCard(card)}>
            <div className="hide-overflow">
                <div className="title">
                    <form onChange={handleSubmit(setCardTitle)}>
                        <input type="text" {...register("cardTitle")} defaultValue={card.title} placeholder="Card name" autoComplete="off" />
                    </form>
                    <div onClick={(ev) => cardPreviewOp.openCardModal(ev, card)} className="manage-card"><p>⋮</p></div>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="tasks">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="tasks-container">
                                {tasks.map((task, idx) => {
                                    return (
                                        <Draggable key={task._id} draggableId={task._id} index={idx}>
                                            {(provided) => (
                                                <li onClick={() => cardPreviewOp.setCurrTask(task)} key={task._id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="card-task">
                                                    {(!task.cover) ? null : (task.cover.includes('#')) ? <div className="task-cover-color" style={{ backgroundColor: `${task.cover}` }} ></div> : <div className="task-cover-img" style={{ backgroundImage: `url(${task.cover}) ,url(https://images.unsplash.com/photo-1563718428108-a2420c356c5c?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60)` }}></div>}
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
                                                                < p > <FontAwesomeIcon icon={faList} />{task.checklists.reduce((accTotal, checklist) => {
                                                                    return accTotal + checklist.list.reduce((acc, itemInList) => itemInList.isChecked + acc, 0)
                                                                }, 0)}/
                                                        {task.checklists.reduce((acc, checklist) => checklist.list.length + acc, 0)}
                                                                </p>}
                                                        </section>
                                                        {!task.members.length ? null : <div className="avatar-card-preview">
                                                            {task.members.map((member, idx) => <Avatar key={idx} name={member.name} size="30" round={true} />)}
                                                        </div>}
                                                    </section>
                                                </li>
                                            )}</Draggable>)
                                })}{provided.placeholder}
                            </ul>)}
                    </Droppable>
                </DragDropContext>
                {!isAddTask && <button className="add-task-btn" onClick={() => setIsAddTask(!isAddTask)}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add task</button>}
                {isAddTask && <form className="add-task-container" onSubmit={handleSubmit(addTask)}>
                    <input type="text" id="title" name="title" autoComplete="off" required {...register("newTask")} placeholder="Enter a title for this card…" defaultValue={newTask.title} />
                    <div className="add-task-btns">
                        <button>Add Task</button>
                        <p onClick={() => setIsAddTask(!isAddTask)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                    </div>
                </form>}
            </div>
        </div >
    )
}