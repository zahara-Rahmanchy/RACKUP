import React from 'react';

import './MainHeader.css';

//prop -> properties so properties from 
const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;