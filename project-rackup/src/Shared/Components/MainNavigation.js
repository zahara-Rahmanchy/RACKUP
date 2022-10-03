import React from 'react';
import MainHeader from './MainHeader';
import './MainNavigation.css';
import NavLinks from "./NavLinks";



const MainNavigation = (props) => {

    
    return (
    
        <MainHeader>
      

            <img src = "/images/LogoNewRU.png" alt='' className='logo'/>

            
            <NavLinks/>
            
    
         </MainHeader>        
      
    );
  
  
};
export default MainNavigation;