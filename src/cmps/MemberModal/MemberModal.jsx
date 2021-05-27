import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './MemberModal.scss'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { socketService } from '../../services/socketService'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export function MemberModal(props) {

    const { register, handleSubmit } = useForm();
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [searchMembers, setSearchMembers] = useState(currBoard.members)
    const dispatch = useDispatch()

    const onSearchMember = data => {
        const users = currBoard.members.filter(user => {
            return user.name.toLowerCase().includes(data.searchMember.toLowerCase())
        })
        if (!users.length) users.push({ _id: "failMember", name: "Member not found." })
        console.log('users:', users)
        setSearchMembers(users)
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
                {searchMembers.map(member => member._id !== 'failMember' ? <li onClick={() => chooseMember(member)} key={member._id}  >
                    <div className="member-details">
                        <Avatar key={member._id} name={member.name} size="30" round={true} />
                    </div>
                    <span>{member.name}</span>
                    <span className="member-icon" >{(props.currTask.members.find((currMember) => currMember._id === member._id) ? <FontAwesomeIcon icon={faCheckCircle}> </FontAwesomeIcon> : null)}</span>
                </li> :
                    <li key={member._id}><span>{member.name}</span></li>
                )}
            </ul>
        </div>
    )
}
