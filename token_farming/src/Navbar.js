import React, { Component } from 'react'

class Navbar extends Component{
    render(){
        return(
            <nav className="nav-wrapper grey darken-3">
            <a href="https://github.com/sidgangwani" className="center">SID'S TOKEN FARM</a>
            <ul className="right">  
                <li>{this.props.account}</li>
            </ul>
            </nav>   
        );
    }
}
export default Navbar;