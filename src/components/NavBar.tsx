import { useState } from "react"
import "./style.css"

const NavBar = () => {
    const [dropDown, setDropDown] = useState(false)

    return (
        <>
            <nav className="navbar navbar-expand-xl bg-primary navbar-custom" data-bs-theme="dark">
                <div className="container-fluid">
                    <a className="navbar-brand ps-3" href="/">
                        <img src="public\assets\Profile Picture (Vector).svg" width="30" height="30" />
                    </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto position-absolute top-50 start-50 translate-middle">
                            <li className="nav-item px-2">
                                <a className="nav-link active" aria-current="page" href="/">Updates</a>
                            </li>
                            <li className="nav-item px-2">
                                <a className="nav-link active" href="/anime-opener">Anime Opener</a>
                            </li>
                            <li className="nav-item dropdown px-2">
                                <a 
                                    className={dropDown === false? "nav-link active dropdown-toggle" : "nav-link active dropdown-toggle show"}
                                    href="#" 
                                    role="button" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded={dropDown} 
                                    onClick={() => setDropDown(!dropDown)}>
                                    More
                                </a>
                                    <ul className={dropDown === false? "dropdown-menu" : "dropdown-menu show"} data-bs-popper={dropDown === false? null : "static"}>
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar