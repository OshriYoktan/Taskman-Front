import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBoards, saveBoard, setCurrBoard, updateBackground, removeBoard } from '../../store/actions/boardActions'
import { CardPreview } from '../../cmps/CardPreview'
import { TaskModal } from '../../cmps/TaskModal/TaskModal'
import { useForm } from "react-hook-form";
import boardService from '../../services/boardService'
import Avatar from 'react-avatar';
import { BoardMenu } from '../../cmps/BoardMenu'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCheckCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { utilService } from '../../services/utilService'
import loader from '../../assets/imgs/taskman-loader.svg'
import { socketService } from '../../services/socketService'
import { Notification } from '../../cmps/Notification/Notification'
import useScrollOnDrag from 'react-scroll-ondrag';
import './BoardDetails.scss'
import { updateUser } from '../../store/actions/userActions'
import userService from '../../services/userService'
import { useHistory } from 'react-router-dom'

export function BoardDetails(props) {
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()
    var newCard = boardService.getEmptyCard()
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const users = useSelector(state => state.userReducer.users)
    const user = useSelector(state => state.userReducer.user)
    const [currCard, setCurrCard] = useState(null)
    const [currTask, setCurrTask] = useState(null)
    const [isMsg, setIsMsg] = useState(false)
    const [msg, setMsg] = useState(null)
    const [members, setMembers] = useState(null)
    const ref = useRef()
    const containerRef = useRef()
    const { events } = useScrollOnDrag(containerRef);
    const history = useHistory()

    const useOnClickOutside = (ref, handler) => {
        useEffect(() => {
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
        }, [ref, handler]);
    }

    useEffect(() => {
        dispatch(loadBoards())
        dispatch(updateBackground(false))
        const { id } = props.match.params
        socketService.emit("board topic", id);
        if (!currBoard) {
            dispatch(setCurrBoard(id))
        }
        else if (!draggedCards) {
            setDraggedCards(currBoard.cards)
            socketService.on('task add-task', data => {
                addTaskForSockets(data)
            })
            socketService.on('task update-task', data => {
                updateTask(data)
            })
            socketService.on('card add-card', data => {
                addNewCardForSockets(data)
            })
            socketService.on('card delete-card', data => {
                deleteTaskForSockets(data)
            })
            socketService.on('board add-label', data => {
                addLabelForSockets(data)
            })
            socketService.on('card update-card', data => {
                updateCardForSockets(data)
            })
            socketService.on('card update-card-title', data => {
                updateCardTitleForSockets(data)
            })
            socketService.on('board add-activity', activity => {
                addActivityForSockets(activity)
            })
            setMembers(currBoard.members)
            preMembers()
        }
        if (currBoard) {
            setMembers(currBoard.members)
        }
    }, [currBoard])

    useOnClickOutside(ref, () => setCurrTask(false));
    const [isMenu, setIsMenu] = useState(false)
    const menuRef = useRef()
    useOnClickOutside(menuRef, () => setIsMenu(false));
    const [cardModal, setCardModal] = useState(null)
    const cardModalRef = useRef()
    useOnClickOutside(cardModalRef, () => setIsCardModal(false));
    const inviteRef = useRef()
    useOnClickOutside(inviteRef, () => setIsInvite(false));
    const [isAddCard, setIsAddCard] = useState(null)
    const [draggedCards, setDraggedCards] = useState((currBoard?.cards) ? currBoard.cards : null)
    const [isInvite, setIsInvite] = useState(null)
    const [isCardModal, setIsCardModal] = useState(null)
    const [xPosEl, setXPosEl] = useState(null)
    const [yPosEl, setYPosEl] = useState(null)
    const [addMembersToBoard, setMembersToBoard] = useState(null)
    const [isDescShown, setIsDescShown] = useState(false)

    // Sockets /////////////////////////////////////////////////////////

    const updateCardForSockets = card => {
        const cardIdx = currBoard.cards.findIndex(c => c._id === card._id)
        currBoard.cards.splice(cardIdx, 1, card)
        dispatch(setCurrBoard(currBoard._id))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 500)
    }

    const updateTask = data => {
        const updateCard = currBoard.cards.find(c => c._id === data.card._id)
        const taskIdx = updateCard.tasks.findIndex(t => t._id === data.task._id)
        updateCard.tasks.splice(taskIdx, 1, data.task)
        dispatch(setCurrBoard(currBoard._id))
    }

    const updateCardTitleForSockets = card => {
        const cardToUpdate = currBoard.cards.find(c => c._id === card._id)
        cardToUpdate.title = card.title
        dispatch(setCurrBoard(currBoard._id))
    }

    const addTaskForSockets = data => {
        const addTo = currBoard.cards.find(c => c._id === data.card)
        addTo.tasks.push(data.task)
        dispatch(setCurrBoard(currBoard._id))
    }

    const deleteTaskForSockets = data => {
        const cardIdx = currBoard.cards.findIndex(c => c._id === data.card)
        currBoard.cards.splice(cardIdx, 1)
        dispatch(setCurrBoard(currBoard._id))
    }

    const addNewCardForSockets = card => {
        currBoard.cards.push(card)
        dispatch(setCurrBoard(currBoard._id))
    }

    const addLabelForSockets = data => {
        if (!data.task.labels.length) data.task.labels.push(data.label)
        else {
            if (data.task.labels.some((currLabel) => currLabel.color === data.label.color)) {
                const labelToRemove = data.task.labels.findIndex(currLabel => currLabel.color === data.label.color)
                data.task.labels.splice(labelToRemove, 1)
            } else {
                data.task.labels.push(data.label)
            }
        }
        boardService.updateCard(data.task, data.card, currBoard)
        dispatch(setCurrBoard(currBoard._id))
    }

    const addActivityForSockets = activity => {
        currBoard.activity.unshift(activity)
        sendMsg(activity.member, activity.type, activity.desc, activity.card)
        dispatch(setCurrBoard(currBoard._id))
    }
    ////////////////////////////////////////////////////////////////////

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(draggedCards);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setDraggedCards(items);
    }

    const openCardModal = (ev, card) => {
        setXPosEl(ev.clientX)
        setYPosEl(ev.clientY)
        setIsCardModal(true)
        setCardModal(card)
    }

    const closeModal = () => {
        setCardModal(null)
        setIsCardModal(false)
    }

    const setBoardTitle = (data) => {
        var title = data.boardTitle;
        dispatch(saveBoard({ ...currBoard, title }))
    }

    const addMemberToBoard = data => {
        const membersInBoard = members.map(member => member._id)
        const usersToAdd = users.filter(user => {
            if (!membersInBoard.includes(user._id)) return user.name.toLowerCase().includes(data.member.toLowerCase())
        })
        setMembersToBoard(usersToAdd)
        dispatch(setCurrBoard(currBoard._id))
    }

    const preMembers = () => {
        const membersInBoard = currBoard.members.map(member => member._id)
        const usersToAdd = users.filter(user => {
            if (!membersInBoard.includes(user._id)) return user.name.toLowerCase()
        })
        setMembersToBoard(usersToAdd)
        dispatch(setCurrBoard(currBoard._id))
    }

    const onAddMember = (member) => {
        currBoard.members = [...members, member]
        setMembers(currBoard.members)
        dispatch(saveBoard(currBoard))
        dispatch(setCurrBoard(currBoard._id))
        preMembers()
    }

    const removeUserFromBoard = (id) => {
        const idx = currBoard.members.findIndex(member => member._id === id)
        currBoard.members.splice(idx, 1)
        setMembers(currBoard.members)
        preMembers()
        dispatch(saveBoard(currBoard))
        dispatch(setCurrBoard(currBoard._id))
    }

    const addLabel = (label) => {
        if (!currTask.labels.length) currTask.labels.push(label)
        else {
            if (currTask.labels.some((currLabel) => currLabel.color === label.color)) {
                const labelToRemove = currTask.labels.findIndex(currLabel => currLabel.color === label.color)
                currTask.labels.splice(labelToRemove, 1)
            } else {
                currTask.labels.push(label)
            }
        }
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
        addActivity(user ? user.username : 'Guest', 'added', 'label', currCard.title)
        socketService.emit('task to-update-task', { card: currCard, task: currTask })
    }

    const addChecklist = (list) => {
        if (typeof list === 'object') currTask.checklists.push(list)
        else currTask.checklists.splice(list, 1);
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        socketService.emit('task to-update-task', { card: currCard, task: currTask })
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addDueDate = (date) => {
        currTask.dueDate = date
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        socketService.emit('task to-update-task', { card: currCard, task: currTask })
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addCover = (cover) => {
        currTask.cover = cover
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        socketService.emit('task to-update-task', { card: currCard, task: currTask })
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addMember = async (memberId) => {
        const member = await userService.getUserById(memberId)
        if (!currTask.members.length) {
            member.tasks.push(currTask.title)
            currTask.members.push(member)
            addActivity(user ? user.username : 'Guest', 'attached', member.username, currTask.title)
        }
        else if (currTask.members.some(currMember => currMember._id === member._id)) {
            const taskIdx = member.tasks.findIndex(t => t === currTask._id)
            member.tasks.splice(taskIdx, 1)
            const memberToRemove = currTask.members.findIndex(currMember => currMember._id === member._id)
            currTask.members.splice(memberToRemove, 1)
            addActivity(user ? user.username : 'Guest', 'removed', member.username, currTask.title)
        } else {
            member.tasks.push(currTask.title)
            currTask.members.push(member)
            addActivity(user ? user.username : 'Guest', 'attached', member.username, currTask.title)
        }
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        socketService.emit('task to-update-task', { card: currCard, task: currTask })
        dispatch(saveBoard(newBoard))
        dispatch(updateUser(member))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addNewCard = (data) => {
        newCard = boardService.getEmptyCard()
        newCard.title = data.newCardTitle
        currBoard.cards.push(newCard)
        setDraggedCards(currBoard.cards)
        dispatch(saveBoard({ ...currBoard, cards: [...currBoard.cards] }))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 150)
        setIsAddCard(!isAddCard)
        reset()
        addActivity(user ? user.username : 'Guest', 'added', 'card')
        socketService.emit('card to-add-card', newCard);
    }

    const deleteCard = () => {
        const cardIdx = currBoard.cards.findIndex(card => card._id === currCard._id)
        const boardToSave = boardService.updateBoard(cardIdx, currBoard)
        socketService.emit('card to-delete-card', cardIdx);
        addActivity(user ? user.username : 'Guest', 'deleted', 'card')
        setDraggedCards(currBoard.cards)
        dispatch(saveBoard(boardToSave))
        dispatch(setCurrBoard(boardToSave._id))
        closeModal()
    }

    const changeBackground = (background, type) => {
        if (type) {
            addActivity(user ? user.username : 'Guest', 'change', 'color')
            dispatch(saveBoard({ ...currBoard, background: { color: background, img: null } }))
        }
        else {
            addActivity(user ? user.username : 'Guest', 'change', 'image')
            dispatch(saveBoard({ ...currBoard, background: { color: null, img: background } }))
        }
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 100)
    }

    const filterTasks = (filterBy) => {
        if (filterBy.task || filterBy.labels.length) {
            var newCards = []
            if (filterBy.task !== '') {
                currBoard.cards.map(card => {
                    return card.tasks.filter(task => {
                        if (task.title.includes(filterBy.task)) newCards.push(card);
                    })
                })
            }
            if (filterBy.labels.length) {
                currBoard.cards.map(card => {
                    return card.tasks.map(task => {
                        return task.labels.map(label => {
                            if (filterBy.labels.includes(label.desc)) newCards.push(card)
                        })
                    })
                })
            }
            const cardsIds = []
            newCards = newCards.filter(c => {
                if (cardsIds.includes(c._id)) return
                cardsIds.push(c._id)
                return c;
            })
            if (!newCards || !Object.keys(newCards).length) {
                const failCard = boardService.getEmptyCard()
                failCard.title = 'No search results.'
                setDraggedCards([failCard])
            } else setDraggedCards(newCards)
        } else setDraggedCards(currBoard.cards)
    }

    const addActivity = (member, type, desc, card = 'board') => {
        const newActivity = { _id: utilService.makeId(), member, type, desc, card, createdAt: Date.now() }
        console.log('newActivity:', newActivity)
        currBoard.activity.unshift(newActivity)
        socketService.emit('board to-add-activity', newActivity)
        // sendMsg(member, type, desc, card)
        dispatch(saveBoard(currBoard))
        dispatch(setCurrBoard(currBoard._id))
    }

    const sendMsg = (member, type, desc, card = 'board') => {
        setMsg({ member, type, desc, card })
        setIsMsg(true)
        setTimeout(() => {
            setIsMsg(false)
        }, 3000)
        dispatch(setCurrBoard(currBoard._id))
    }

    const deleteBoard = async (boardId) => {
        const res = await dispatch(removeBoard(boardId || currBoard._id))
        console.log('res:', res)
        if (!res) sendMsg('Can\'t', 'delete', 'board')
        else history.push('/boards')
    }

    if (!currBoard || !draggedCards || !draggedCards.length || !members) return (<div className="loader-container"><img src={loader} alt="" /></div>)

    const cardPreviewOp = {
        openCardModal,
        closeModal,
        addActivity,
        setCurrCard,
        setCurrTask,
        isDescShown,
        setIsDescShown,
    }

    const boardMenuOp = {
        setIsMenu,
        isMenu,
        changeBackground,
        members: currBoard.members,
        filterTasks,
        addActivity,
        deleteBoard
    }

    const taskModalOp = {
        setCurrTask,
        currTask,
        addLabel,
        addMember,
        addChecklist,
        addDueDate,
        addCover,
        currBoard: currBoard
    }

    const notifyOp = {
        isMsg: isMsg,
        msg: msg,
    }

    return (
        <div className="board-details sub-container">
            <div className="board-header flex">
                <div className="flex ">
                    <form onBlur={handleSubmit(setBoardTitle)}>
                        <input type="text" id="title" name="title" {...register("boardTitle")} defaultValue={currBoard.title} autoComplete="off" />
                    </form>
                    <div className="flex">
                        <div className="avatars">
                            {members.map((member, idx) => <Avatar key={idx} name={member.name} size="30" round={true} />)}
                        </div>
                        <button onClick={() => setIsInvite(!isInvite)}>Invite</button>
                        {isInvite && <div ref={inviteRef} className="invite-members-modal">
                            <form onChange={handleSubmit(addMemberToBoard)} >
                                <div className="invite-title">
                                    <div className="close-btn">
                                        <p>Invite to board:</p>
                                        <button onClick={() => setIsInvite(!isInvite)}>x</button>
                                    </div>
                                    <input type="text" autoComplete="off" placeholder="Search Taskman Members.." id="member" name="member"  {...register("member")} />
                                </div>
                            </form>
                            {addMembersToBoard && <div className="exist-members">
                                <ul>
                                    <p>Suggested Members:</p>
                                    {addMembersToBoard.map((member, idx) => {
                                        return <li key={member._id}>
                                            <button onClick={() => onAddMember(member)} className="suggested-user">
                                                <Avatar key={idx} name={member.name} size="30" round={true} />
                                                <p>{member.name}</p>
                                                <p><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></p>
                                            </button>
                                        </li>
                                    })}
                                </ul>
                            </div>}
                            {!currBoard.members.length ? null : <div className="exist-members">
                                <p>In This Board:</p>
                                {currBoard.members.map((user, idx) => {
                                    return <button key={user._id} onClick={() => removeUserFromBoard(user._id)} className="suggested-user">
                                        <Avatar key={idx} name={user.name} size="30" round={true} />
                                        <p>{user.name}</p>
                                        <p><FontAwesomeIcon icon={faCheckCircle} /></p>
                                    </button>
                                })}
                            </div>}
                        </div>}
                    </div>
                </div>
                <div ref={menuRef} className="flex">
                    <p className="open-menu-btn" onClick={() => setIsMenu(true)}><FontAwesomeIcon className="fa" icon={faBars}></FontAwesomeIcon></p>
                    <BoardMenu boardMenuOp={boardMenuOp}></BoardMenu>
                </div>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable direction="horizontal" droppableId="cards" type="CARD">
                    {(provided) => (
                        <div className="cards-container flex" ref={provided.innerRef}>
                            <div {...provided.droppableProps}  {...events} ref={containerRef} className="cards-container flex">
                                <div className="flex">
                                    {draggedCards.map((card, idx) => {
                                        return <div className="test" key={card._id}><Draggable key={card._id} draggableId={card._id} index={idx}>
                                            {(previewProvider) =>
                                            (<div key={card._id}  {...previewProvider.draggableProps} {...previewProvider.dragHandleProps} ref={previewProvider.innerRef}>
                                                <CardPreview key={card._id} cardPreviewOp={cardPreviewOp} card={card}></CardPreview>
                                            </div>)}
                                        </Draggable></div>
                                    })}
                                    {provided.placeholder}
                                    {!isAddCard && <button className="add-card-btn" onClick={() => setIsAddCard(!isAddCard)}><FontAwesomeIcon className="fa" icon={faPlus}></FontAwesomeIcon><p>Add another card</p></button>}
                                    {isAddCard && <div className="add-card"> <form className="add-card-container" onSubmit={handleSubmit(addNewCard)}>
                                        <input type="text" autoComplete="off" placeholder="Card name" id="title" name="title" {...register("newCardTitle")} />
                                        <div className="flex">
                                            <button>Add Card</button>
                                            <p onClick={() => setIsAddCard(!isAddCard)}><FontAwesomeIcon className="fa" icon={faTimes}></FontAwesomeIcon></p>
                                        </div>
                                    </form></div>}
                                </div>
                            </div>
                        </div>)}
                </Droppable>
            </DragDropContext>
            {isCardModal && <div ref={cardModalRef} style={{ left: `${xPosEl}px`, top: `${yPosEl}px` }} className="card-modal">
                <div className="card-title-modal">
                    <p>{cardModal.title}</p>
                    <button onClick={() => closeModal()}>x</button>
                </div>
                <div className="card-modal-btns">
                    <button onClick={() => deleteCard()}>Delete This Card</button>
                </div>
            </div>}
            {currTask && <div ref={ref}><TaskModal taskModalOp={taskModalOp}></TaskModal></div>}
            <Notification notifyOp={notifyOp} />
        </div >
    )
}