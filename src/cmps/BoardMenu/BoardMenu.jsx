import { useCallback, useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { saveBoard, setCurrBoard } from '../../store/actions/boardActions'
import Moment from 'react-moment';
import './BoardMenu.scss'
import { faChevronLeft, faPalette, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { utilService } from '../../services/utilService'
import { PolarArea, Bar } from 'react-chartjs-2';
import { Cloudinary } from '../Cloudinary/Cloudinary'

export function BoardMenu({ boardMenuOp }) {
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm();
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [isAbout, setIsAbout] = useState(false)
    const [isBackground, setIsBackground] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [isLabels, setIsLabels] = useState(false)
    const [labels, setLabels] = useState(null)
    const [cloudImgs, setCloudImgs] = useState(null)
    const [isAddLabel, setIsAddLabel] = useState(false)
    const [filterBy, setFilterBy] = useState({ task: '', labels: [] })
    const colors = ['lightgreen', 'lightyellow', 'lightblue', 'orange', 'slateblue', 'lightpink', 'lightgray', 'white']

    useEffect(() => {
        setCloudImgs(currBoard.images)
        sendFilter()
    }, [filterBy])

    useEffect(() => {
        if (!boardMenuOp.isMenu) closeMenu()
    }, [boardMenuOp.isMenu])

    useEffect(() => {
        setLabels(currBoard.labels)
    }, [currBoard])

    const onSearchTask = data => {
        setFilterBy({ ...filterBy, task: data.searchTask })
    }

    const onSearchLabel = idx => {
        if (filterBy.labels.includes(boardMenuOp.labels[idx].desc)) {
            const removeIdx = filterBy.labels.findIndex(label => label === boardMenuOp.labels[idx].desc)
            filterBy.labels.splice(removeIdx, 1)
            setFilterBy({ ...filterBy, labels: filterBy.labels })
        }
        else setFilterBy({ ...filterBy, labels: [...filterBy.labels, boardMenuOp.labels[idx].desc] })
    }

    const sendFilter = () => {
        boardMenuOp.filterTasks(filterBy)
    }

    // const saveLabels = data => {
    //     const entries = Object.entries(data)
    //     const labels = entries.map((label, idx) => {
    //         if (!idx) return
    //         if (idx % 2 === 0) return { color: label[1] }
    //         return { desc: label[1] }
    //     })
    //     labels.splice(0, 1)
    //     const arr = []
    //     labels.forEach((label, idx) => {
    //         if (idx % 2 === 0) arr.push({ _id: utilService.makeId(), desc: label.desc, color: labels[idx + 1].color })
    //     })
    //     setLabels(currBoard.labels)
    //     dispatch(saveBoard({ ...currBoard, labels: labels }))
    //     setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 100)
    // }

    const saveLabels = data => {
        const descs = []
        const colors = []
        Object.keys(data).forEach(input => {
            if (input.includes('editBoardLabelColor')) colors.push(input)
            else if (input.includes('editBoardLabel')) descs.push(input)
        })
        const arrValues = Object.values(data)
        arrValues.splice(0, 1)
        const arr1 = []
        const arr2 = []
        arrValues.forEach((val, idx) => {
            if (idx % 2 === 0) arr1.push(val)
            else arr2.push(val)
        })
        const labels = arr1.map((val, idx) => {
            return { _id: utilService.makeId(), desc: arr1[idx], color: arr2[idx] }
        })
        setLabels(currBoard.labels)
        dispatch(saveBoard({ ...currBoard, labels: labels }))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 100)
    }

    const onAddBoardLabel = (data) => {
        const label = { _id: utilService.makeId(), desc: data.addBoardLabel, color: data.addBoardLabelColor }
        currBoard.labels.push(label)
        setIsAddLabel(!isAddLabel)
        boardMenuOp.addActivity('Guest', 'added', 'label')
        dispatch(saveBoard(currBoard))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 100)
    }

    const deleteLabel = (labelId) => {
        const idx = currBoard.labels.findIndex(l => l._id === labelId)
        currBoard.labels.splice(idx, 1)
        setLabels(currBoard.labels)
        dispatch(saveBoard(currBoard))
        setTimeout(() => dispatch(setCurrBoard(currBoard._id)), 100)
        boardMenuOp.addActivity('Guest', 'deleted', 'label')
    }

    const closeMenu = () => {
        boardMenuOp.setIsMenu(false)
        setIsAbout(false)
        setIsBackground(false)
        setIsFilter(false)
        setIsLabels(false)
        onSearchTask('')
    }

    if (!cloudImgs || !currBoard || !labels) return (<div className="loader-container">Loading</div>)

    const inProgress = []
    const overdue = []
    const completed = []
    currBoard.cards.forEach(card => {
        card.tasks.forEach(task => {
            if (task.doneAt) completed.push(task)
            else if (!task.dueDate) inProgress.push(task)
            else task.dueDate > Date.now() ? inProgress.push(task) : overdue.push(task)
        })
    })

    const dataForMembersChart = {
        labels: currBoard.members.map(m => m.name),
        datasets: [{
            label: 'Members',
            data: currBoard.members.map(m => m.tasks.length),
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 205, 86, 0.7)',
                'rgba(201, 203, 207, 0.7)',
                'rgba(54, 162, 235, 0.7)'
            ],
            hoverOffset: 4
        }]
    };

    const dataForChart = {
        labels: ['Completed', 'In progress', 'Overdue'],
        datasets: [{
            label: 'Status',
            data: [completed.length, inProgress.length, overdue.length],
            backgroundColor: [
                'rgba(29, 185, 84, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 99, 132, 0.7)',
            ],
            borderColor: [
                'rgba(29, 185, 84)',
                'rgba(255, 159, 64)',
                'rgba(255, 99, 132)',
            ],
            borderWidth: 1,
        }]
    };

    return (
        <section className="board-menu flex" style={boardMenuOp.isMenu ? { maxWidth: 100 + '%' } : { maxWidth: 0 }}>
            <article className="menu-main">
                <div className="flex">
                    <h3>Menu</h3>
                    <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div className="flex">
                    <p onClick={() => setIsAbout(!isAbout)}>About & Statistics</p>
                    <p onClick={() => setIsBackground(!isBackground)}>Background</p>
                    <p onClick={() => setIsFilter(!isFilter)}>Search cards</p>
                    <p onClick={() => setIsLabels(!isLabels)}>Labels</p>
                </div>
                <div className="hide-overflow flex">
                    <h3>Activity</h3>
                    <ul>
                        {!currBoard.activity.length ? null : currBoard.activity.map(activity => <li key={activity._id}>
                            {(activity.type !== 'attached' && activity.type !== 'removed') ? <p><span>{activity.member}</span> {activity.type} {activity.desc} {activity.type === 'deleted' ? 'from' : 'to'} <span>{activity.card}</span>{activity.card === 'board' ? '' : ' card'}.</p>
                                : <p><span>{activity.member}</span> {activity.type} {activity.desc} {activity.type === 'removed' ? 'from' : 'to'} <span>{activity.card}</span> task.</p>}
                            <small><Moment fromNow>{activity.createdAt}</Moment></small>
                        </li>)}
                        {!currBoard.activity.length && <li><h1>No activity here...</h1></li>}
                    </ul>
                </div>
            </article>
            <article className="menu-about sub-menu" style={isAbout ? { maxWidth: 100 + '%' } : { maxWidth: 0 }}>
                <div className="flex">
                    <p onClick={() => setIsAbout(!isAbout)}><FontAwesomeIcon className="fa" icon={faChevronLeft} /></p>
                    <h3>About & Statistics</h3>
                    <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div className="flex hide-overflow">
                    <div className="flex">
                        <h3>Members</h3>
                        <div>{boardMenuOp.members.map((member, idx) => <Avatar key={idx} name={member.name} size="30" round={true} />)}</div>
                        <p>Total: {boardMenuOp.members.length}</p>
                    </div>
                    <div className="flex">
                        <h3>Description</h3>
                        <textarea placeholder="Type here a description" />
                    </div>
                    <div className="flex">
                        <h3>Statistics</h3>
                        <h4>Tasks per member</h4>
                        <PolarArea data={dataForMembersChart} />
                        <h4>Tasks status</h4>
                        <Bar height="200" data={dataForChart} />
                    </div>
                </div>
            </article>
            <article className="menu-background sub-menu" style={isBackground ? { maxWidth: 100 + '%' } : { maxWidth: 0 }}>
                <div className="flex">
                    <p onClick={() => setIsBackground(!isBackground)}><FontAwesomeIcon className="fa" icon={faChevronLeft} /></p>
                    <h3>Change background</h3>
                    <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div className="hide-overflow flex">
                    <div className="flex">
                        <h4>Colors</h4>
                        <div className="flex">
                            {colors.map((color, idx) => <aside key={idx} style={{ backgroundColor: color }} onClick={() => boardMenuOp.changeBackground(color, true)}></aside>)}
                        </div>
                    </div>
                    <div className="flex">
                        <h4>Photos</h4>
                        <div className="flex">
                            <Cloudinary txt="Upload photo" type="background" setCloudImgs={setCloudImgs} />
                            {cloudImgs.map((url, idx) => <img key={idx} onClick={() => boardMenuOp.changeBackground(url)} decoding="async" loading="lazy" src={url} alt={url} />)}
                        </div>
                    </div>
                </div>
            </article>
            <article className="menu-filter sub-menu" style={isFilter ? { maxWidth: 100 + '%' } : { maxWidth: 0 }}>
                <div className="flex">
                    <p onClick={() => setIsFilter(!isFilter)}><FontAwesomeIcon className="fa" icon={faChevronLeft} /></p>
                    <h3>Search cards</h3>
                    <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div>
                    <form onChange={handleSubmit(onSearchTask)}>
                        <input type="text" placeholder="Search for task..." {...register("searchTask")} />
                    </form>
                </div>
                <div>
                    <h4>Search by label</h4>
                    <ul>
                        {labels.map((label, idx) => <li key={idx} style={{ backgroundColor: filterBy.labels.includes(label.desc) ? 'gray' : 'inherit' }} onClick={() => onSearchLabel(idx)}>
                            <div style={{ backgroundColor: label.color }}></div>
                            <p>{label.desc}</p>
                        </li>)}
                    </ul>
                </div>
            </article>
            <article className="menu-labels sub-menu" style={isLabels ? { maxWidth: 100 + '%' } : { maxWidth: 0 }}>
                <div className="flex">
                    <p onClick={() => setIsLabels(!isLabels)}><FontAwesomeIcon className="fa" icon={faChevronLeft} /></p>
                    <h3>Labels</h3>
                    <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div className="hide-overflow">
                    <ul>
                        {labels.map((label, idx) => <li key={label._id} style={{ backgroundColor: label.color }}>
                            <form onChange={handleSubmit(utilService.debounce(saveLabels, 100))}>
                                <input type="text" defaultValue={label.desc} placeholder="Label name" required {...register("editBoardLabel" + idx)} />
                                <label name="label-color"><FontAwesomeIcon className="fa" icon={faPalette} />
                                    <input type="color" {...register("editBoardLabelColor" + idx)} defaultValue={label.color} /></label>
                            </form>
                            <p><FontAwesomeIcon className="fa" icon={faTimes} onClick={() => deleteLabel(label._id)} /></p>
                        </li>)}
                        {!isAddLabel && <li onClick={() => setIsAddLabel(!isAddLabel)}><p>New label</p></li>}
                        {isAddLabel && <li>
                            <form onSubmit={handleSubmit(onAddBoardLabel)}>
                                <input type="text" placeholder="Label name" autoComplete="off" required {...register("addBoardLabel")} />
                                <input type="color" name="label-color" id="label-color" defaultValue="#FFFFFF" {...register("addBoardLabelColor")} />
                                <button>Add label</button>
                            </form>
                            <button onClick={() => setIsAddLabel(!isAddLabel)}>X</button></li>}
                    </ul>
                </div>
            </article>
        </section >
    )
}