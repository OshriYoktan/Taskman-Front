import './LandingPage.scss'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateBackground } from '../../store/actions/boardActions'

export function LandingPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateBackground(false))
    })

    return (
        <section className="sub-container landing-page-container">
            
            <div className="landing-page-section">
                <div>
                    <h3>Taskman</h3>
                    <p>Taskman helps teams move work forward.
                        Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique-accomplish it all with Taskman.</p>
                </div>
                <article>
                    <img src="https://cdn.dribbble.com/users/2851002/screenshots/9667092/media/09648e273e248e7cfd22ade4010b2a6e.gif" alt="" />
                </article>
            </div>
            <div className="landing-page-section landing-page-section-right">
                <article>
                    <img src="https://cdn.dribbble.com/users/2851002/screenshots/9073688/media/bb69af3d8f2404f4cfcc7cecdc558be6.gif" alt="" />
                </article>
                <div>
                    <h3>Keep Track Of Your Team</h3>
                    <p>Taskman has statistics panel to see your team progress.
                        Keep track of your team's assignment and completion of tasks easily!</p>
                </div>
            </div>
            <div className="landing-page-section">
                <div>
                    <h3>Live Updates & Push Notifications</h3>
                    <p>Always be up-to-date with recent activities in your project.
                        our unique system of real-time push notifications will make sure
                        you always know all about the recent developments.</p>
                </div>
                <article>
                    <img src="https://cdn.dribbble.com/users/2851002/screenshots/7736965/media/e08e0676dd54ae8715c2d72bbdd51eb2.gif" alt="" />
                </article>
            </div>
            <div className="flex try-btn bounce-animation">
                <Link to="/boards" className="link">Try Taskman!</Link>
            </div>
            <div className="landing-page-header">
                <Link to="/boards" className="link">Task<span>man</span></Link>
            </div>
        </section>
    )
}