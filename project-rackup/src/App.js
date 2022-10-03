//import logo from './logo.svg';
import React, {useEffect, useReducer, useState} from 'react';
import {BrowserRouter as Router,Routes,Route,Navigate } from 'react-router-dom';
import DefaultPage from './Default/Page/DefaultPage';

import './App.css';
import MainNavigation from './Shared/Components/MainNavigation';
import All from './Pages/All';
import Project from './Pages/Project';
import Research from './Pages/Research';
import { reducer } from './components/UseReducer';
import { userContext, loggedUserDataContext, deptFilterContext } from './components/Contexts';
import { auth } from './Shared/Components/Database/Firebase';
import Footer from './Shared/Components/FormElements/Footer';

/*IN <Route path= "*" element = {  <Navigate to = '/' /> } />, here to redirect to same page if anything unknown is given in  slash url
then for version-6 the above process is used where redirect to is changed to Navigate to and path set to *  */

// export const userContext = createContext();
// export const loggedUserDataContext = createContext({});

const App = () => {
  // window.localStorage.setItem('LoggedIn', )
  // const[user, setUser] = useState("");
  // useEffect(()=>{
  //   setUser(auth.currentUser); 
  // },[user]) 
  // const signedIn = (user) =>{
  //   if(user){
  //     return true;
  //   }else return false;
  // }
  
  const [state, dispatch] = useReducer(reducer, false);
  const [userData, setUserData] = useReducer(reducer, []);
  const [dept, setDept] = useReducer(reducer, "");

  console.log('state:'+state);

  // const accountExpiration = async(e) =>{
  //   const uid = '5WieDmKAlDWm2I5BJaIutWA2SvJ2';
  //   try{
      
  //       const response = await fetch(`http://localhost:5000/users/${uid}`, {
  //           method: 'DELETE',
  //           headers: {
  //               'Content-Type':'applcation/json'
  //           },
  //           // body: JSON.stringify(uid)
  //       });

  //       const resData = response.json();
  //       alert(resData);
  //   }catch(err){
  //       console.log(err);
  //   }

  // }

  // accountExpiration();
  
  return (
    <userContext.Provider value={{state, dispatch}}>
      <loggedUserDataContext.Provider value={{userData, setUserData}}>
        <deptFilterContext.Provider value={{dept, setDept}}>
          <Router>
              <MainNavigation/>
              <main>
                <Routes>

                  <Route path = '/' element={<DefaultPage />}/>

                  <Route path = '/All' element = {<All/>}/>
                  
                  {state && (<Route path = '/Research' element = {<Research/>}/>)}

                  {state && (<Route path = '/Project' element={<Project />}/>)}
                

                  {/* <Route path = '/Input' element={<Input />}/>

                  <Route path = '/Login' element={<Login/>}/> */}
                
                  <Route path= "*" element = {  <Navigate to = '/' /> } />
          
                </Routes>
                <Footer/>
              </main>
          </Router>
        </deptFilterContext.Provider>
      </loggedUserDataContext.Provider>
    </userContext.Provider>
  );
}

export default App;

// "start": "react-scripts start",