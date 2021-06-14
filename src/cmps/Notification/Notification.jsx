import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Notification.scss'

export function Notification({ notifyOp }) {
    const { isMsg, msg } = notifyOp

    if (!msg) return (<></>)

    if (msg.type === 'delete') {
        return <section className="notification-container" style={isMsg ? { maxWidth: '100%' } : { maxWidth: '0' }}>
            <div>
                <FontAwesomeIcon className="fa" icon={faCheckCircle}></FontAwesomeIcon>
                {msg.type === 'warning' && <FontAwesomeIcon className="fa" icon={faExclamationCircle}></FontAwesomeIcon>}
            </div>
            <div>
                {<p><span>{msg.member}</span> {msg.type} {msg.desc} try again later.</p>}
            </div>
        </section>
    }

    return (
        <section className="notification-container" style={isMsg ? { maxWidth: '100%' } : { maxWidth: '0' }}>
            <div>
                <FontAwesomeIcon className="fa" icon={faCheckCircle}></FontAwesomeIcon>
                {msg.type === 'warning' && <FontAwesomeIcon className="fa" icon={faExclamationCircle}></FontAwesomeIcon>}
            </div>
            <div>
                {(msg.type !== 'attached' && msg.type !== 'removed') ? <p><span>{msg.member}:<br /></span> {msg.type} {msg.desc} {msg.type === 'deleted' ? 'from' : 'to'} <span>{msg.card}</span>{msg.card === 'board' ? '' : ' card'}.</p>
                    : <p><span>{msg.member}:</span><br /> {msg.type} {msg.desc} {msg.type === 'removed' ? 'from' : 'to'} <span>{msg.card}</span> task.</p>}
            </div>
        </section>
    )
}