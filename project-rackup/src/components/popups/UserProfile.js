import React, { useState,useContext, useRef, useEffect } from 'react';
import {AiOutlineClose} from 'react-icons/ai';
import {FaUserCircle} from "react-icons/fa";

import './UserProfile.css';
import { userContext } from '../Contexts';
import { loggedUserDataContext } from '../Contexts';
import { auth, db, storage } from '../../Shared/Components/Database/Firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';


const UserProfile = (props) =>{
    const[selectedPhoto, setSelectedPhoto] = useState(false);
    const[remove, setRemove] = useState(false);
    const[saveBtn, showSaveBtn] = useState(false);
    const[profile, isProfile] = useState(true);
    const[photoURL, setPhotoURL] = useState();
    const handleClick=()=>{
         props.setTrigger(false);
        
    };

    const inputRef = useRef(null);

    const {userData, setUserData} = useContext(loggedUserDataContext);
    // if(userData.profilePhoto==="") isProfile(false);

    useEffect(() => {
        if (!selectedPhoto) {
            return;
        }
  
        setPhotoURL(URL.createObjectURL(selectedPhoto));
        console.log(photoURL);
  
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(photoURL);
    }, [selectedPhoto]);

    const handlePhotoClick = (e) => {
        e.preventDefault();
        // open file input box on click of other element
        inputRef.current.click();
        showSaveBtn(true);

    };

    const handleSaveClick = (e) => {
        const userRef = doc(db, "users", userData.id);
        // const storageProfileref = 
        if(profile){
            const storageProfileref = ref(storage, `profilePhoto/${userData.studentId}`);
            uploadBytes(storageProfileref, selectedPhoto).then(
            
                getDownloadURL(storageProfileref).then((url) => {
                    updateDoc(userRef, {
                        profilePhoto: url
                        
                    });
                })
            )
        }else{  //when user doesn't want any profile photo
            updateDoc(userRef, {
                profilePhoto: ""
                
            });
        }
        // const profileref = ref(storage, selectedPhoto);

        // updateDoc(userRef, {
        //     profilePhoto: profileref.name
            
        // });
        showSaveBtn(false);
      
    };

    const handlePhotoChange = e => {
        if (!e.target.files || e.target.files.length === 0) {
          setSelectedPhoto(undefined);
          return
        }
  
        setSelectedPhoto(e.target.files[0])
        console.log("pp:"+e.target.files[0]);
      
    };

    const removePhoto = e => {
    
        setSelectedPhoto(!selectedPhoto);
      
    };
  

    const{state, dispatch} = useContext(userContext);

    return(props.trigger) ? (
        
        <div className='user-profile-div'>
            
            <div className='user-profile-inner'>
                <button  onClick={handleClick} className="close-profile-btn"> 
                    <AiOutlineClose/> 
                </button>
                <h2 className="profile-title">Profile</h2>
                <div className='profile-photo' onMouseEnter={((e)=>{if(photoURL || userData.profilePhoto) setRemove(true)})} onMouseLeave={((e)=>{setRemove(false)})} /*onClick={removePhoto}*/>{userData.profilePhoto==="" || !profile ? <FaUserCircle className="user-icon" size={130}/>:<img src = {userData.profilePhoto} className="photo"/>}{photoURL && <img src = {photoURL} className="photo"/>}
                {remove && <div className='overlay-remove' onClick={((e)=>{setPhotoURL(!photoURL); isProfile(false); showSaveBtn(true);})}>Remove</div>}
                </div>
                <input type="file" name="myImage" accept="image/*" style={{display:'none'}} ref={inputRef} onChange={handlePhotoChange}/>
                <button className='edit-btn' onClick={handlePhotoClick}>Edit</button>
                {saveBtn && <button className='save-btn' onClick={handleSaveClick}>Save</button>}
                {userData &&
                <>
                    <h2 className='username'>{userData.name}</h2>
                    <p className='email'>{userData.email}</p>
                    <p className='p-tag'>Total Projects: <br/>0</p>
                    <p className='p-tag'>Total Research Papers: <br/>0</p>
                </> 
                }
                <button className='logout-btn' onClick={((e)=>{
                    dispatch({type:"USER", payload:false});
                    onAuthStateChanged(auth,(user)=>{
                        if(user) signOut(auth).then(()=>{alert("Signed out successfully!")}).catch((er)=>{alert(er)});
                    }); 
                })}>Sign Out</button>
            </div>

        </div>
    ):"";
        
};

export default UserProfile;
