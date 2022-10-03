import React, {useContext, useState, useEffect} from 'react';
import {FaUserCircle} from "react-icons/fa";
import {FaBars, FaTimes} from "react-icons/fa";
import {IoIosArrowDropdown} from "react-icons/io";
import {IoIosArrowDropup} from "react-icons/io";
import {IoNotificationsCircle} from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';

import SignUp from './FormElements/SignUp';
import './NavLinks.css';

import Login from './FormElements/Login';
import { userContext, deptFilterContext, loggedUserDataContext } from '../../components/Contexts';
import UserProfile from '../../components/popups/UserProfile';
import Project from '../../Pages/Project';
import Notifications from '../../components/popups/Notifications';
import NotificationNum from '../../components/popups/NotificationNum';

//import { type } from '@testing-library/user-event/dist/type';


const NavLinks = (props) => {
  // const currentState = window.localStorage.getItem('loggedIn');
  const {state, dispatch} = useContext(userContext); ///const auth = useContext(userContext)
  const {dept, setDept} = useContext(deptFilterContext);
  const {userData, setUserData} = useContext(loggedUserDataContext);

  const [buttonPopup, setButtonPopup] = useState(false);
  const [logPopup, setLogPopup] = useState(false);
  const[profilePopup, setProfilePopup] = useState(false);
  const [istate, setState] = useState(false);
  const redirect = useNavigate();

  
  //this use state for showing or hiding dropdown menu
  const[dropdown, setDropdown] = useState(false);
  const[logout, setLogout] = useState(false);

  const [requestDiv, setRequestDiv] = useState(false);
  const[badge, setBadge] = useState(true);


  

  console.log('State '+state);
  return(state)? (
    
    <nav>
      <div className='menu-icon' onClick={() => setState(!istate)}>
        {/* {istate ? <span className='menuItems'><NavLinks trigger={true} setTrigger={true}/></span> : ""} */}
        {istate ? <FaTimes/> : <FaBars />}
      </div>
      
      <div className='nav-div'>
        <ul className= {istate ? "nav-links active":"nav-links"}>
          <li >
          <NavLink to="/">Home</NavLink>
          {<span className="errors">{state}</span>}
          </li>
          <li onMouseEnter={((e)=>{setDropdown(true);})} onMouseLeave={((e)=>{setDropdown(false);})} >
          <NavLink to="/Project" className='project-menu'> Project {<span className='drop-icon'>
            
            <ul className="dropdown-list">
            <li>
                  <div onClick={((e)=>{
                  setDept({type:"DEPT", payload:"ALL"});
                 
                    })}>All</div>
                
                </li>
                <li><div onClick={((e)=>{
                  setDept({type:"DEPT", payload:"CSE"});
                })}>Department of CSE</div></li>
                <li><div onClick={((e)=>{
                  setDept({type:"DEPT", payload:"EEE"});
                  
                })}>Department of EEE</div></li>
                <li><div onClick={((e)=>{
                  setDept({type:"DEPT", payload:"CE"});
                 
                })}>Department of Civil Engineering</div></li>
                
                
                {/* <li><div onClick={((e)=>{
                  
                })}>Show All</div></li> */}

            </ul>
            
            {dropdown ? <IoIosArrowDropdown className='icon'/>:<IoIosArrowDropup className='icon'/>}</span>}
          </NavLink>
      
          
          </li>
          <li onMouseEnter={((e)=>{setDropdown(true);})} onMouseLeave={((e)=>{setDropdown(false);})}>
            <NavLink to="/Research" className='project-menu'> Research 
              {<span className='drop-res-icon'>
                <ul className="dropdown-list">
                <li>
                  <div onClick={((e)=>{
                  setDept({type:"DEPT", payload:"ALL"});
                 
                    })}>All</div>
                
                </li>
                    <li><div onClick={((e)=>{
                      setDept({type:"DEPT", payload:"CSE"});
                    })}>Department of CSE</div></li>
                    <li><div onClick={((e)=>{
                      setDept({type:"DEPT", payload:"EEE"});
                      
                    })}>Department of EEE</div></li>
                    <li><div onClick={((e)=>{
                      setDept({type:"DEPT", payload:"CE"});
                    
                    })}>Department of Civil Engineering</div></li>
                </ul>
              {dropdown ? <IoIosArrowDropdown className='icon'/>:<IoIosArrowDropup className='icon'/>}</span>}
            </NavLink>
          </li>
          {userData.category==="Teacher" ? (<li>
            <div className='notication-icon-div'>
              {badge && <NotificationNum/>}                
              <div className='notify-icon' onClick={((e) => { setRequestDiv(true); setBadge(false);})}>
                <IoNotificationsCircle size={35} />
              </div>
            </div>
              
              {/*show notifications div*/}            {/*show notifications div*/}
            <Notifications trigger = {requestDiv} setTrigger={setRequestDiv}/>
          </li>):""}
          <li>
            <div className = 'user-profile' onClick={() => {setProfilePopup(true);}}>
              {userData.profilePhoto==="" ? <FaUserCircle size={30}/> : <img className='profile-img' src={userData.profilePhoto}></img>}
              <span className='toolText'>Profile</span>
            </div>
            <UserProfile trigger={profilePopup} setTrigger={setProfilePopup}/>
          </li>
        </ul> 
      </div>
        
    </nav>
    
  
  

  
  ):

  (
    <nav>
      <div className='menu-icon' onClick={() => setState(!istate)}>
              {/* {istate ? <span className='menuItems'><NavLinks trigger={true} setTrigger={true}/></span> : ""} */}
              {istate ? <FaTimes/> : <FaBars />}
            </div>
            <div className='nav-div'>
              <ul className= {istate ? "nav-links active":"nav-links"}>
        
                <li>
                  <NavLink to="/" exact> Home</NavLink>
                </li>
                <li>
                  <button className = 'sign-btn' onClick={() => setButtonPopup(true)}>Sign Up</button>
                  <SignUp trigger={buttonPopup} setTrigger={setButtonPopup}></SignUp>
                </li>

                <li>
                  <button className = 'log-btn' onClick={() => setLogPopup(true)}>Sign In</button>
                  <Login trigger={logPopup} setTrigger={setLogPopup}></Login>  
                </li>
      
              </ul>
            </div>
      
    </nav>
    
  );
};

export default NavLinks;

//<NavLink to="/Input">Sign Up</NavLink>