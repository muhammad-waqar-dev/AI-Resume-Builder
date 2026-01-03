import VersionSelector from "../VersionSelector/VersionSelector"

function MainHeader() {
    return (
        <div className="app-header">
        <div className="header-left">
          <VersionSelector />
          <h1>AI Resume Builder</h1>
        </div>
        <div className="header-right">
          <a 
            href="https://www.linkedin.com/in/jhon-dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="linkedin-heart"
            title="Visit my LinkedIn profile"
          >
            ❤️
          </a>
        </div>
      </div>
    )
}

export default MainHeader