import './LandingPage.scss'

export function LandingPage() {

    return (
        <div className="sub-container landing-page-container">
            <h1>Welcome to Taskman!</h1>
            <div className="landing-page-section">
                <div>
                    <div>
                        <h3>Stop working alone!</h3>
                        <p>Join now.</p>
                    </div>
                    <img src="https://media.giphy.com/media/3oEdv1vkhqxcynkB5C/giphy.gif" alt="" />
                </div>
            </div>
            <div className="landing-page-section">
                <div>
                    <div>
                        <h3>Suits for all!</h3>
                        <p>Workspaces, projects, big meetings.</p>
                    </div>
                    <img src="https://media.giphy.com/media/l0Iybn1vpbUzeqkqQ/giphy.gif" alt="" />
                </div>
            </div>
        </div>
    )
}