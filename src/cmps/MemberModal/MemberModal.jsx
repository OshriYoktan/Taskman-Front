
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import './MemberModal.scss'
import { useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { socketService } from '../../services/socketService'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


export function MemberModal(props) {

    const { register, handleSubmit } = useForm();
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [usersToAdd, setUsersToAdd] = useState(null)
    

    const onSearchMember = data => {
        const users = currBoard.members.filter(user => {
            return user.name.toLowerCase().includes(data.searchMember.toLowerCase())
        })
        setUsersToAdd(users)
    }
    const chooseMember = (member) => {
        // socketService.emit("add-member-to-task", member);
        props.addMemberToTask(member)
    }
    const chooseMemberForSockets = (member) => {
        console.log('workes');
        console.log('member:', member)
        props.addMemberToTask(member)
    }
    useEffect(() => {
        socketService.on("add-member-to-task-from-back", (() => {
            console.log('workes');
        }))
        // socketService.on("add-member-to-task-from-back", chooseMemberForSockets)
    })

    return (
        <div className="member-modal" style={true ? { maxWidth: 100 + '%' } : { maxWidth: 0, visibility: 'visible' }}>
            <div className="member-modal-header">
                <h3>Members</h3>
                <p className="btn-close-icon" onClick={() => props.setMemberModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </div>
            <ul className="member-container">
                <form onChange={handleSubmit(onSearchMember)}>
                    <input autoComplete="off" {...register("searchMember")} type="text" placeholder="Search members..." />
                </form>
                <p>Members:</p>
                {usersToAdd && usersToAdd.map((user, idx) => {
                    return <li onClick={() => chooseMember(user)} key={user._id}>
                        <div className="member-details">
                            <Avatar key={idx} name={user.name} size="30" round={true} />
                        </div>
                        <span>{user.name}</span>
                        <span >{(props.currTask.members.find((currMember) => currMember._id === user._id) ? <FontAwesomeIcon icon={faCheckCircle}> </FontAwesomeIcon> : null)}</span>
                    </li>
                })}

                {currBoard.members.map((member, idx) => {
                    return <li onClick={() => chooseMember(member)} key={idx}  >
                        <div className="member-details">
                            <Avatar key={idx} name={member.name} size="30" round={true} />
                        </div>
                        <span>{member.name}</span>
                        <span >{(props.currTask.members.find((currMember) => currMember._id === member._id) ? <FontAwesomeIcon icon={faCheckCircle}> </FontAwesomeIcon> : null)}</span>
                    </li>
                })}
            </ul>
        </div>
    )
}
