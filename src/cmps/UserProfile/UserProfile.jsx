import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef } from 'react'
import './UserProfile.scss'

export function UserProfile({ profileOp }) {
    const { isProfile, setIsProfile } = profileOp

    const closeMenu = () => setIsProfile(false)
    
    const profileRef = useRef()

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

    useOnClickOutside(profileRef, () => setIsProfile(false));
    
    
    return (
        <section ref={profileRef} className="user-menu" style={isProfile ? { maxWidth: '100%' } : { maxWidth: '0' }}>
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
