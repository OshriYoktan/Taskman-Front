import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Notification.scss'

export function Notification({ notifyOp }) {
    const { isMsg, msg } = notifyOp

    if (!msg) return (<div>Loadiv</div>)
    return (
        <section className="notification-container" style={isMsg ? { maxWidth: '100%' } : { maxWidth: '0' }}>
            <div>
                {!msg.type && <FontAwesomeIcon className="fa" icon={faCheckCircle}></FontAwesomeIcon>}
                {msg.type === 'warning' && <FontAwesomeIcon className="fa" icon={faExclamationCircle}></FontAwesomeIcon>}
            </div>
            <div>
                <p>{msg.type ? 'Warning' : 'Success'}!</p>
                <p><span>{msg.member}</span> {msg.action} {msg.what}: "{msg.name}" {msg.action === 'added' ? 'to board' : 'from board'}.</p>
            </div>
        </section>
    )
}