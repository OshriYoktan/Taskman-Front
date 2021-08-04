import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './MemberModal.scss'
import { useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import { socketService } from '../../services/socketService'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import smallLoader from '../../assets/imgs/small-loader.svg'

export function MemberModal(props) {
    const { register, handleSubmit } = useForm();
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const [searchMembers, setSearchMembers] = useState(currBoard.members)

    const onSearchMember = data => {
        const users = currBoard.members.filter(user => {
            return user.name.toLowerCase().includes(data.searchMember.toLowerCase())
        })
        if (!users.length) users.push({ _id: "failMember", name: "Member not found." })
        setSearchMembers(users)
    }

    const chooseMemberForSockets = (member) => {
        props.addMemberToTask(member)
    }

    useEffect(() => {
        socketService.on("add-member-to-task-from-back", (member => {
            chooseMemberForSockets(member)
        }))
    })

    return (
        <div className="member-modal" >
            <div className="modal-header">
                <h3>Members</h3>
                <p onClick={() => props.setMemberModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </div>
            {!props.memberModalLoader && <><form onChange={handleSubmit(onSearchMember)}>
                <input autoComplete="off" onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }} {...register("searchMember")} type="text" placeholder="Search members..." />
            </form>
                <h3>Users:</h3>
                <ul className="member-container">
                    {searchMembers.map(member => member._id !== 'failMember' ? <li onClick={() => props.addMemberToTask(member._id)} key={member._id} className="members-list" >
                        <Avatar key={member._id} name={member.name} size="30" round={true} />
                        <span>{member.name}</span>
                        <span className="member-icon">{(props.taskMembers.find((currMember) => currMember._id === member._id) ? <FontAwesomeIcon icon={faCheckCircle}> </FontAwesomeIcon> : null)}</span></li> :
                        <li className="members-list" key={member._id}><span>{member.name}</span></li>
                    )}
                </ul></>}
            {props.memberModalLoader && <div className='member-modal-loader'><img src={smallLoader} alt='loader' /></div>}
        </div>
    )
}
