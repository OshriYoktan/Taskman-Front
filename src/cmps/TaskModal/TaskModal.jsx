import { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faClock, faList, faTag, faTimes, faUser, faCheckSquare, faThermometerEmpty, faSquare, faPaperclip, faClipboard } from '@fortawesome/free-solid-svg-icons'
import boardService from '../../services/boardService.js'
import './TaskModal.scss'
import Avatar from 'react-avatar';
import { LabelModal } from '../LabelModal/LabelModal';
import { MemberModal } from '../MemberModal/MemberModal';
import { CheckListModal } from '../CheckListModal/CheckListModal';
import { saveBoard, setCurrBoard } from '../../store/actions/boardActions';
import { DueDateModal } from '../DueDateModal/DueDateModal.jsx';
import loader from '../../assets/imgs/taskman-loader.svg'
import Moment from 'react-moment';
import { utilService } from '../../services/utilService.js';

export function TaskModal(props) {
    const { taskModalOp } = props
    const { currTask } = taskModalOp
    const inputFile = useRef(null)
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm();
    const [labelModal, setLabelModal] = useState(false)
    const [attModal, setAttModal] = useState(false)
    const [memberModal, setMemberModal] = useState(false)
    const [checklistModal, setChecklistModal] = useState(false)
    const [dueDateModal, setDueDateModal] = useState(false)
    const [isDesc, setIsDesc] = useState(false)
    const [attSrc, setAttSrc] = useState(null)

    var descValue;
    var currBoard = useSelector(state => state.boardReducer.currBoard)


    const currCard = currBoard.cards.find(card => {
        return card.tasks.find(t => {
            return t._id === currTask._id
        })
    })

    const onSubmit = data => {
        currTask.desc = data.desc
        updateBoard(currTask)
    }

    const onSubmitItemInList = (data, idxInList) => {
        const input = Object.keys(data).find(str => str === ('inputItem' + idxInList))
        currTask.checklists[idxInList].list.push({ desc: data[input], isChecked: false })
        setRange(currTask.checklists[idxInList])
    }

    const changeCheckBox = (item) => {
        item.isChecked = !item.isChecked
        updateBoard(currTask)
    }
    const toggleTaskDone = () => {
        if (!currTask.doneAt) currTask.doneAt = Date.now()
        else currTask.doneAt = ''
        updateBoard(currTask)
    }

    const setRange = checklist => {
        const itemsChecked = checklist.list.reduce((acc, itemInList) => {
            return itemInList.isChecked + acc
        }, 0)
        const rengeToShow = +((itemsChecked / checklist.list.length * 100).toFixed(2))
        checklist.range = rengeToShow
        updateBoard(currTask)
    }
    const updateBoard = task => {
        const updatedBoard = boardService.updateCard(task, currCard, currBoard)
        dispatch(saveBoard(updatedBoard))
        dispatch(setCurrBoard(currBoard._id))
    }

    const onButtonClick = () => {
        inputFile.current.click()
    }

    const onAttChange = (ev) => {
        if (ev.target.files.length) {
            const newAtt = { _id: utilService.makeId(), title: ev.target.files[0].name }
            currTask.attachments.push(newAtt)
            setAttSrc(URL.createObjectURL(ev.target.files[0]))
        }

    }


    if (!currTask || !currCard) return (<div className="loader-container"><img src={loader} alt="" /></div>)


    return (
        <div className="task-modal">
            <div className="task-modal-form">
                <div className="task-header">
                    <div className="task-title">
                        <h3>{currTask.title}</h3>
                        <p>In list: {currCard.title}</p>
                    </div>
                </div>
                <div className="task-description-modal">
                    {!currTask.dueDate ? null : <section onClick={toggleTaskDone}>
                        <span className="due-date-moment">{!currTask.doneAt ? <FontAwesomeIcon icon={faClock} /> : <FontAwesomeIcon icon={faCheckSquare} />} <Moment fromNow>{currTask.dueDate}</Moment></span>
                        {/* <span className="due-date-moment">{!currTask.doneAt ? <FontAwesomeIcon icon={faClock} /> : <FontAwesomeIcon icon={faCheckSquare} />} <Moment fromNow>{currTask.dueDate}</Moment></span> */}
                        <Moment format="MMM D YYYY" withTitle>{currTask.dueDate}</Moment>
                    </section>}
                    {!currTask.labels.length ? null : <section><h4>Lables</h4>
                        {currTask.labels.map((label, idx) =>
                            <div className="label-in-modal" key={idx} style={{ backgroundColor: label.color }}>
                                <p>{label.desc}</p>
                            </div>)}
                        <button onClick={() => setLabelModal(true)}>+</button>
                    </section>}
                    {!currTask.members.length ? null : <section><h4>Members</h4>
                        <div className="member-list">
                            {currTask.members.map((member, idx) =>
                                <div className="member-in-modal" key={idx}>
                                    <Avatar key={idx} name={member.name} size="30" round={true} />
                                </div>)}
                            <button onClick={() => setMemberModal(true)}>+</button>
                        </div>
                    </section>}

                    <div className="desc-svg"><FontAwesomeIcon icon={faAlignLeft} />
                        <p>Description:</p>
                    </div>
                    <textarea id="desc" name="desc" onClick={() => setIsDesc(!isDesc)} defaultValue={descValue} placeholder="Add some detailed description..." {...register("desc")} defaultValue={taskModalOp.currTask.desc} />
                    {isDesc && <div className="saveDesc"><button onClick={(ev) => { ev.preventDefault(); setIsDesc(!isDesc) }} >Save</button> <button onClick={() => setIsDesc(false)}>x</button> </div>}
                </div>

                {!currTask.checklists.length ? null : <section >
                    {currTask.checklists.map((checklist, listIdx) =>
                        <div className="checklist-in-modal" key={listIdx}>
                            <div className="checklist-svg"> <div className="flex"> <FontAwesomeIcon icon={faList} ></FontAwesomeIcon> <p>{checklist.title}</p></div>
                                <button onClick={() => taskModalOp.addChecklist(listIdx)}>delete list</button>
                            </div>
                            {!checklist.list.length ? null : <div className="demo-range-container">
                                <div className="demo-range-checked" style={{ width: checklist.range + '%' }}></div>
                            </div>}
                            {!checklist.list.length ? null : <span>{checklist.range}%</span>}
                            {!checklist.list.length ? null : checklist.list.map((item, idx) => {
                                return <div className="checklist-items" key={idx}>
                                    <input type="checkbox" id={'checklist-item-' + idx} checked={item.isChecked} onChange={() => {
                                        changeCheckBox(item)
                                        setRange(checklist)
                                    }} />
                                    {item.isChecked ? <label style={{ textDecoration: 'line-through' }}>{item.desc}</label> : <label>{item.desc}</label>}
                                </div>
                            })}
                            <form onSubmit={handleSubmit(res => onSubmitItemInList(res, listIdx))}>
                                <input type="text" autoComplete="off" id={'input-item-' + listIdx} name="item" placeholder="add an item"  {...register('inputItem' + listIdx)} />
                                <button >Add An Item</button>

                            </form>
                        </div>)}
                </section>}
                {!currTask.attachments.length ? null : <section >
                    <div className="att-svg"><FontAwesomeIcon icon={faPaperclip} />
                        <p>Attachments:</p>
                    </div>
                    {currTask.attachments.map((attac, idx) =>
                        <div className="attachments-container">
                            <div className="att-src">
                                <img src={attSrc} alt="photo" />
                            </div>
                            <div className="att-details">
                                <p>{attac.title}</p>
                                <p>Added Right now!</p>
                                <div className="att-btns">
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>}
                <div className="task-comment">
                    <p>Post a Comment:</p>
                    <input type="text" autoComplete="off" id="comment" name="comment" placeholder="Write a comment..."  {...register("activity")} defaultValue={currTask.activity} />
                </div>
            </div>
            <div className="add-to-task">
                <div className="right-task-modal">
                    <h3>Add To Task:</h3>
                    <p onClick={() => taskModalOp.setCurrTask(null)} className="btn-close-icon"><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div className="right-task-modal-btns">
                    <div onClick={() => setLabelModal(true)} className="right-task-btn">
                        <FontAwesomeIcon icon={faTag}></FontAwesomeIcon>
                        <p> Labels </p>
                    </div>
                    <div onClick={() => setMemberModal(true)} className="right-task-btn">
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        <p> Members </p>
                    </div>
                    <div onClick={() => setChecklistModal(true)} className="right-task-btn">
                        <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
                        <p> Checklist </p>
                    </div>
                    <div onClick={() => setDueDateModal(true)} className="right-task-btn">
                        <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                        <p> Due Date </p>
                    </div>
                    <div onClick={() => setAttModal(true)} className="right-task-btn">
                        <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon>
                        <p> Attachment </p>
                    </div>
                </div>
            </div>
            {(!labelModal) ? null : <LabelModal setLabelModal={setLabelModal} labelModal={labelModal} currTask={currTask} addLabel={taskModalOp.addLabel}  ></LabelModal>}
            {(!memberModal) ? null : <MemberModal setMemberModal={setMemberModal} memberModal={memberModal} currTask={currTask} addMemberToTask={taskModalOp.addMember} ></MemberModal>}
            {(!checklistModal) ? null : <CheckListModal setChecklistModal={setChecklistModal} checklistModal={checklistModal} currTask={currTask} addChecklist={taskModalOp.addChecklist} ></CheckListModal>}
            {(!dueDateModal) ? null : <DueDateModal setDueDateModal={setDueDateModal} dueDateModal={dueDateModal} addDueDate={taskModalOp.addDueDate} currTask={currTask}></DueDateModal>}
            {(!attModal) ? null :
                <div className="att-modal">
                    <div className="att-modal-header">
                        <h3>Attach from..</h3>
                        <button onClick={() => setAttModal(false)}>x</button>
                    </div>
                    <div className="att-buttons">
                        <button onClick={onButtonClick}>Computer</button>
                        <input id="file" type="file" accept="image/*" onChange={onAttChange} ref={inputFile} name="name" style={{ display: 'none' }} />
                    </div>

                </div>}
        </div>
    )
}

