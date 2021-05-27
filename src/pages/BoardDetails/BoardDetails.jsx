import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBoards, saveBoard, setCurrBoard, updateBackground } from '../../store/actions/boardActions'
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
import './BoardDetails.scss'

export function BoardDetails(props) {
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()
    var newCard = boardService.getEmptyCard()
    const [users, setUsers] = useState(boardService.getUsers())
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [currCard, setCurrCard] = useState(null)
    const [currTask, setCurrTask] = useState(null)
    const [isMsg, setIsMsg] = useState(false)
    const [msg, setMsg] = useState(null)
    const ref = useRef()
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
        // Add ref and handler to effect dependencies
        // It's worth noting that because passed in handler is a new ...
        // ... function on every render that will cause this effect ...
        // ... callback/cleanup to run every render. It's not a big deal ...
        // ... but to optimize you can wrap handler in useCallback before ...
        // ... passing it into this hook.
    }

    useEffect(() => {
        dispatch(loadBoards())
        dispatch(updateBackground(false))
        const { id } = props.match.params
        socketService.emit("board topic", id);
        if (!currBoard) dispatch(setCurrBoard(id))
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
        }
    }, [currBoard])

    // Sockets /////////////////////////////////////////////////////////

    const updateCardForSockets = card => {
        console.log('card:', card)
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
        console.log('data:', data)
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
        dispatch(setCurrBoard(currBoard._id))
    }

    ////////////////////////////////////////////////////////////////////

    useOnClickOutside(ref, () => setCurrTask(false));
    const [isMenu, setIsMenu] = useState(false)
    const menuRef = useRef()
    useOnClickOutside(menuRef, () => setIsMenu(false));
    const [cardModal, setCardModal] = useState(null)
    const cardModalRef = useRef()
    useOnClickOutside(cardModalRef, () => setIsCardModal(false));
    const [isAddCard, setIsAddCard] = useState(null)
    const [draggedCards, setDraggedCards] = useState((currBoard?.cards) ? currBoard.cards : null)
    const [isInvite, setIsInvite] = useState(null)
    const [isCardModal, setIsCardModal] = useState(null)
    const [x, setX] = useState(null)
    const [addMembersToBoard, setMembersToBoard] = useState(null)
    const [isDescShown, setIsDescShown] = useState(false)

    //Card Drag
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = draggedCards;
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // console.log('items:', items)
        setDraggedCards(items);
    }

    // Card modal
    const openCardModal = (ev, card) => {
        setX(ev.clientX)
        setIsCardModal(true)
        setCardModal(card)
    }

    const closeModal = () => {
        setCardModal(null)
        setIsCardModal(false)
    }

    const setBoardTitle = data => {
        var title = data.boardTitle
        // title.slice(2)
        // var match = /'/.exec(title);
        // const removeChars = []
        // var re = /'/g,
        //     str = title;
        // while ((match = re.exec(str)) != null) {
        //     removeChars.push(match.index)
        // }
        // removeChars.forEach(idx => {
        //     title.slice(2)
        // })
        // console.log('title:', title)
        // console.log('removeChars:', removeChars)
        dispatch(saveBoard({ ...currBoard, title }))
    }

    const addMemberToBoard = data => {
        var userToAdd = users.filter(user => user.name.toLowerCase().includes(data.member.toLowerCase()))
        if (data.member === '') userToAdd = null
        // setMembersToBoard(userToAdd)
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
        addActivity('Aviv Zohar', 'added', 'label', currCard.title)
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

    const addMember = (member) => {
        member.tasks.push(currTask._id)
        if (!currTask.members.length) {
            currTask.members.push(member)
            addActivity('Aviv Zohar', 'attached', member.name, currTask.title)
        }
        else if (currTask.members.some((currMember) => currMember._id === member._id)) {
            const memberToRemove = currTask.members.findIndex(currMember => currMember._id === member._id)
            currTask.members.splice(memberToRemove, 1)
            addActivity('Aviv Zohar', 'removed', member.name, currTask.title)
        } else {
            currTask.members.push(member)
            addActivity('Aviv Zohar', 'attached', member.name, currTask.title)
        }
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        socketService.emit('task to-update-task', { card: currCard, task: currTask })
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addNewCard = (data) => {
        newCard.title = data.newCardTitle
        currBoard.cards.push(newCard)
        setDraggedCards(currBoard.cards)
        dispatch(saveBoard({ ...currBoard, cards: [...currBoard.cards] }))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 150)
        setIsAddCard(!isAddCard)
        reset()
        addActivity('Aviv Zohar', 'added', 'card')
        socketService.emit('card to-add-card', newCard);
        newCard = boardService.getEmptyCard()
        data.newCardTitle = ''
    }

    const deleteCard = () => {
        const cardIdx = currBoard.cards.findIndex(card => card._id === currCard._id)
        const boardToSave = boardService.updateBoard(cardIdx, currBoard)
        socketService.emit('card to-delete-card', cardIdx);
        addActivity('Aviv Zohar', 'deleted', 'card')
        dispatch(saveBoard(boardToSave))
        dispatch(setCurrBoard(boardToSave._id))
        closeModal()
    }

    const changeBackground = (background, type) => {
        if (type) {
            addActivity('Aviv Zohar', 'change', 'color')
            dispatch(saveBoard({ ...currBoard, background: { color: background, img: null } }))
        }
        else {
            addActivity('Aviv Zohar', 'change', 'image')
            dispatch(saveBoard({ ...currBoard, background: { color: null, img: background } }))
        }
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 100)
    }

    const removeUserFromBoard = (user) => {
        if (user.boards.includes(currBoard._id)) {
            //עד שלא נעשה יוזר לא נוכל לרנדר את היוזרים
            // -ה USER.BOARD 
            // שלהם קבוע, כלומר כל פעם הוא יהיה אותו דבר
            // Why in hebrew?!
            const boardIdx = user.boards.findIndex(board => board._id === currBoard._id)
            user.boards.splice(boardIdx, 1)
        } else {
            user.boards.push(currBoard._id)
        }
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
                failCard.title = 'There are no matched tasks.'
                setDraggedCards([failCard])
            } else setDraggedCards(newCards)
        } else setDraggedCards(currBoard.cards)
    }

    const addActivity = (member, type, desc, card = 'board') => {
        const newActivity = { _id: utilService.makeId(), member, type, desc, card, createdAt: Date.now() }
        currBoard.activity.unshift(newActivity)
        socketService.emit('board to-add-activity', newActivity)
        sendMsg(member, type, desc, card)
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

    if (!currBoard || !draggedCards || !draggedCards.length) return (<div className="loader-container"><img src={loader} alt="" /></div>)

    const cardPreviewOp = {
        openCardModal,
        closeModal,
        addActivity,
        setCurrCard,
        setCurrTask,
        isDescShown,
        setIsDescShown
    }

    const boardMenuOp = {
        setIsMenu,
        isMenu,
        changeBackground,
        members: currBoard.members,
        filterTasks,
        labels: currBoard.labels,
        addActivity
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
                        <input type="text" id="title" name="title" {...register("boardTitle")} defaultValue={currBoard.title} />
                    </form>
                    <div className="flex">
                        <div className="avatars">
                            {currBoard.members.map((member, idx) => <Avatar key={idx} name={member.name} size="30" round={true} />)}
                        </div>
                        <button onClick={() => setIsInvite(!isInvite)}>Invite</button>
                        {isInvite && <div className="invite-members-modal">
                            <form onChange={handleSubmit(addMemberToBoard)} >
                                <button onClick={() => setIsInvite(!isInvite)}>x</button>
                                <div className="invite-title">
                                    <p>Invite to board:</p>
                                    <input type="text" autoComplete="off" placeholder="Search Taskman Members.." id="member" name="member"  {...register("member")} />
                                </div>
                            </form>
                            {addMembersToBoard && <div className="exist-members">
                                <ul>
                                    {addMembersToBoard.map((member, idx) => {
                                        if (!member.boards.includes(currBoard._id)) return (
                                            <li key={member._id}>
                                                <p>Add members:</p>
                                                <button className="suggested-user">
                                                    <Avatar key={idx} name={member} size="30" round={true} />
                                                    <p>{member}</p>
                                                    <p><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></p>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>}
                            <div className="exist-members">
                                <div className="suggested-title">
                                    <p>Suggested Users:</p>
                                </div>
                                {users.map((user, idx) => {
                                    if (!user.boards.includes(currBoard._id)) return (
                                        <button key={user._id} onClick={() => removeUserFromBoard(user)} className="suggested-user">
                                            <Avatar key={idx} name={user.name} size="30" round={true} />
                                            <p>{user.name}</p>
                                            <p><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></p>
                                        </button>

                                    )
                                })}
                            </div>
                            <div className="exist-members">
                                <p>In This Board:</p>
                                {users.map((user, idx) => {
                                    if (user.boards.includes(currBoard._id)) return (
                                        <button key={user._id} onClick={() => removeUserFromBoard(user)} className="suggested-user">
                                            <Avatar key={idx} name={user.name} size="30" round={true} />
                                            <p>{user.name}</p>
                                            <p><FontAwesomeIcon icon={faCheckCircle} /></p>
                                        </button>)
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
                <div ref={menuRef} className="flex">
                    <p className="open-menu-btn" onClick={() => setIsMenu(true)}><FontAwesomeIcon className="fa" icon={faBars}></FontAwesomeIcon></p>
                    <BoardMenu boardMenuOp={boardMenuOp}></BoardMenu>
                </div>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="cards" type="CARD">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="cards-container flex">
                            <div className="flex">
                                {draggedCards.map((card, idx) => {
                                    return <div className="test" key={card._id}> <Draggable key={card._id} draggableId={card._id} index={idx}>
                                        {(previewProvider) =>
                                        (<div key={card._id}  {...previewProvider.draggableProps} {...previewProvider.dragHandleProps} ref={previewProvider.innerRef}>
                                            <CardPreview key={card._id} cardPreviewOp={cardPreviewOp} card={card}></CardPreview>
                                        </div>)}
                                    </Draggable>{provided.placeholder}</div>
                                })}
                                {!isAddCard && <button className="add-card-btn" onClick={() => setIsAddCard(!isAddCard)}><FontAwesomeIcon className="fa" icon={faPlus}></FontAwesomeIcon> Add another card</button>}
                                {isAddCard && <div className="add-card"> <form className="add-card-container" onSubmit={handleSubmit(addNewCard)}>
                                    <input type="text" autoComplete="off" placeholder="Card name" id="title" name="title" {...register("newCardTitle")} />
                                    <div className="flex">
                                        <button>Add Card</button>
                                        <p onClick={() => setIsAddCard(!isAddCard)}><FontAwesomeIcon className="fa" icon={faTimes}></FontAwesomeIcon></p>
                                    </div>
                                </form></div>}
                            </div>
                        </div>)}
                </Droppable>
            </DragDropContext>
            {
                isCardModal && <div ref={cardModalRef} style={{ left: `${x}px`, top: `155px` }} className="card-modal">
                    <div className="card-title-modal">
                        <p>{cardModal.title}</p>
                        <button onClick={() => closeModal()}>x</button>
                    </div>
                    <div className="card-modal-btns">
                        <button onClick={deleteCard}>Delete This Card</button>
                    </div>
                </div>
            }
            { currTask && <div ref={ref}><TaskModal taskModalOp={taskModalOp}></TaskModal></div>}
            <Notification notifyOp={notifyOp} />
        </div >
    )
}