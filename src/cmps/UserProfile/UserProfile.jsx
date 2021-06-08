import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './UserProfile.scss'

export function UserProfile({ profileOp }) {
    const { isProfile, setIsProfile } = profileOp

    const closeMenu = () => setIsProfile(false)
    
    return (
        <section className="user-menu" style={isProfile ? { maxWidth: '100%' } : { maxWidth: '0' }}>
            <div>
                <h3>Profile</h3>
                <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
            </div>
            <div>
                <p>Aviv Zohar</p>
                <p>Tasks: 5</p>
            </div>
        </section>
    )
}
