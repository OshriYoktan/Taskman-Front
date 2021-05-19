import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBoards, saveBoard, setCurrBoard, updateBackground } from '../../store/actions/boardActions'
import { CardPreview } from '../../cmps/CardPreview'
import './BoardDetails.scss'
import { TaskModal } from '../../cmps/TaskModal/TaskModal'
import { useForm } from "react-hook-form";
import boardService from '../../services/boardService'
import Avatar from 'react-avatar';
import { BoardMenu } from '../../cmps/BoardMenu'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons'
import { utilService } from '../../services/utilService'
import loader from '../../assets/imgs/taskman-loader.svg'

export function BoardDetails(props) {
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    var newCard = boardService.getEmptyCard()
    const [users, setUsers] = useState(boardService.getUsers())
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [currCard, setCurrCard] = useState(null)
    const [currTask, setCurrTask] = useState(null)
    const [isAddCard, setIsAddCard] = useState(null)
    const [isMenu, setIsMenu] = useState(false)
    const [draggedCards, setDraggedCards] = useState(null)
    const [isInvite, setIsInvite] = useState(null)
    const [isCardModal, setIsCardModal] = useState(null)
    const [x, setX] = useState(null)
    const [cardModal, setCardModal] = useState(null)
    const [addMembersToBoard, setMembersToBoard] = useState(null)
    const [isDescShown, setIsDescShown] = useState(false)

    useEffect(() => {
        dispatch(updateBackground(false))
        const { id } = props.match.params
        if (!currBoard) dispatch(setCurrBoard(id))
        else if (!draggedCards) setDraggedCards(currBoard.cards)
        dispatch(loadBoards())
        console.log('render!');
    }, [currBoard])

    //Card Drag
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = draggedCards;
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
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

    // forms
    const setBoardTitle = data => {
        dispatch(saveBoard({ ...currBoard, title: data.boardTitle }))
    }

    const addMemberToBoard = data => {
        var userToAdd = users.filter(user => user.name.toLowerCase().includes(data.member.toLowerCase()))
        if (data.member === '') userToAdd = null
        setMembersToBoard(userToAdd)
    }

    const addLabel = (label) => {
        if (!currTask.labels.length) currTask.labels.push(label)
        else {
            if (currTask.labels.some((currLabel) => currLabel.color === label.color)) {
                //member is already in the Task
                const labelToRemove = currTask.labels.findIndex(currLabel => currLabel.color === label.color)
                currTask.labels.splice(labelToRemove, 1)
            } else {
                currTask.labels.push(label)
            }
        }
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
        addActivity('Aviv Zohar', 'added', 'labal')
    }

    const addChecklist = (list) => {
        if (typeof list === 'object') currTask.checklists.push(list)
        else {//variable "list" is an index of the checklist we want to remove from the array
            currTask.checklists.splice(list, 1);
        }
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addDueDate = (date) => {
        currTask.dueDate = date
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
    }

    const addMember = (member) => {
        if (!currTask.members.length) currTask.members.push(member)
        else {
            if (currTask.members.some((currMember) => currMember._id === member._id)) {
                // member is already in the Task
                const memberToRemove = currTask.members.findIndex(currMember => currMember._id === member._id)
                currTask.members.splice(memberToRemove, 1)
            } else {
                currTask.members.push(member)
            }
        }
        const newBoard = boardService.updateCard(currTask, currCard, currBoard)
        dispatch(saveBoard(newBoard))
        dispatch(setCurrBoard(newBoard._id))
        addActivity('Aviv Zohar', 'Attached', member.name, currTask.title)
    }

    const addNewCard = (data) => {
        newCard.title = data.newCardTitle
        currBoard.cards.push(newCard)
        setDraggedCards(currBoard.cards)
        dispatch(saveBoard({ ...currBoard, cards: [...currBoard.cards, newCard] }))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 150)
        newCard = boardService.getEmptyCard()
        setIsAddCard(!isAddCard)
        data.newCardTitle = ''
        addActivity('Aviv Zohar', 'added', 'card')
    }

    const deleteCard = () => {
        const cardIdx = currBoard.cards.findIndex(card => card._id === currCard._id)
        const boardToSave = boardService.updateBoard(cardIdx, currBoard)
        dispatch(saveBoard(boardToSave))
        dispatch(setCurrBoard(boardToSave._id))
        addActivity('Aviv Zohar', 'deleted', 'card')
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
            const boardIdx = user.boards.findIndex(board => board._id === currBoard._id)
            user.boards.splice(boardIdx, 1)
        } else {
            user.boards.push(currBoard._id)
        }
    }

    const filterTasks = (filterBy) => {
        if (filterBy.task || filterBy.labels.length) {
            var cards = currBoard.cards
            if (filterBy.task) {
                cards = currBoard.cards.find(card => {
                    return card.tasks.find(task => {
                        return task.title.includes(filterBy.task)
                    })
                })
            }
            if (filterBy.labels.length) {
                cards = currBoard.cards.find(card => {
                    return card.tasks.find(task => {
                        return task.labels.find(label => label.desc.includes(filterBy.labels))
                    })
                })
            }
            if (!cards || !Object.keys(cards).length) {
                const failCard = boardService.getEmptyCard()
                failCard.title = 'There are no matched tasks.'
                setDraggedCards([failCard])
            } else setDraggedCards([cards])
        } else setDraggedCards(currBoard.cards)
    }

    const addActivity = (member, type, desc, card = 'board') => {
        const newActivity = { _id: utilService.makeId(), member, type, desc, card, createdAt: Date.now() }
        currBoard.activity.unshift(newActivity)
        dispatch(saveBoard(currBoard))
        dispatch(setCurrBoard(currBoard._id))
    }

    if (!currBoard || !draggedCards || !draggedCards.length) return (<div className="loader-container"><img src={loader} alt="" /></div>)

    const cardPreviewOp = {
        openCardModal,
        closeModal,
        addActivity,
        setCurrCard,
        setCurrTask
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
        addDueDate
    }

    return (
        <div className="board-details sub-container">
            <div className="board-header flex">
                <div className="flex">
                    <form onChange={handleSubmit(setBoardTitle)}>
                        <input type="text" id="title" name="title" {...register("boardTitle")} defaultValue={currBoard.title} />
                    </form>
                    <div className="flex">
                        <div className="avatars">
                            {currBoard.members.map((member, idx) => <Avatar key={idx} name={member} size="30" round={true} />)}
                        </div>
                        <button onClick={() => setIsInvite(!isInvite)}>Invite</button>
                        {isInvite && <div className="invite-members-modal">
                            <form onChange={handleSubmit(addMemberToBoard)} >
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
                                                    <Avatar key={idx} name={member.name} size="30" round={true} />
                                                    <p>{member.name}</p>
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
                <div className="flex">
                    <p className="open-menu-btn" onClick={() => setIsMenu(true)}><FontAwesomeIcon className="fa" icon={faBars}></FontAwesomeIcon></p>
                    <BoardMenu boardMenuOp={boardMenuOp}></BoardMenu>
                </div>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters" type="TASK">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="cards-container flex">
                            <div className="flex">
                                {draggedCards.map((card, idx) =>
                                    <Draggable key={card._id} draggableId={card._id} index={idx}>
                                        {provided => (<div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                            <CardPreview key={card._id} cardPreviewOp={cardPreviewOp} isDescShown={isDescShown} setIsDescShown={setIsDescShown} card={card}></CardPreview>
                                        </div>)}
                                    </Draggable>)}
                                {provided.placeholder}
                                {!isAddCard && <button className="add-card-btn" onClick={() => setIsAddCard(!isAddCard)}> + Add Card.</button>}
                                {isAddCard && <form className="add-card-container" onSubmit={handleSubmit(addNewCard)}>
                                    <input type="text" id="title" name="title" {...register("newCardTitle")} />
                                    <button>Add Card</button>
                                </form>}
                            </div>
                        </div>)}
                </Droppable>
            </DragDropContext>
            {isCardModal && <div style={{ left: `${x}px`, top: `155px` }} className="card-modal">
                <div className="card-title-modal">
                    <p>{cardModal.title}</p>
                    <button onClick={() => closeModal()}>x</button>
                </div>
                <div className="card-modal-btns">
                    <button onClick={deleteCard}>Delete This Card</button>
                </div>
            </div>}
            {currTask && <TaskModal taskModalOp={taskModalOp}></TaskModal>}
        </div>
    )
}