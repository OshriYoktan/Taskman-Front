
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import './MemberModal.scss'
import { useSelector } from 'react-redux'
import Avatar from 'react-avatar'

export function MemberModal(props) {
    const chooseMember = (member) => {
        props.addMemberToTask(member)
    }
    var currBoard = useSelector(state => state.boardReducer.currBoard)
    return (
        <div className="member-modal" style={true ? { maxWidth: 100 + '%' } : { maxWidth: 0, visibility: 'visible' }}>
            <div className="member-modal-header">
                <h3>Members</h3>
                <p className="btn-close-icon" onClick={() => props.setMemberModal(false)}><FontAwesomeIcon className="fa" icon={faTimes} /></p>

            </div>
            <ul className="member-container">
                {currBoard.members.map((member, idx) => {
                    return <li onClick={() => chooseMember(member)} key={idx}  >
                        <div className="member-details">
                        <Avatar key={idx} name={member} size="30" round={true} />
                        <span >{member}</span>
                        </div>
                        <span >{(props.currTask.members.find((currMember) => currMember._id === member._id) ? <FontAwesomeIcon icon={faCheckCircle}> </FontAwesomeIcon> : null)}</span>
                    </li>
                })}
            </ul>
        </div>
    )
}
