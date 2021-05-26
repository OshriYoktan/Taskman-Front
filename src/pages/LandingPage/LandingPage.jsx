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
            <div>
                <div>
                    <h3>Taskman</h3>
                    <p>Join now.</p>
                </div>
                <div className="flex">
                    <Link to="/boards" className="link">Try it now!</Link>
                </div>
                <img src="https://salazarconsultores.com/wp-content/uploads/2019/12/software.gif?la=en&&hasF952A6248E013C59481352613DB474168E2C12" alt="" />
            </div>
        </section>
    )
}