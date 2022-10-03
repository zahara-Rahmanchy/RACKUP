import React from 'react';
import './DefaultPage.css';
//import antc from "../assets/antc.jpeg";
import {FaCloudUploadAlt} from "react-icons/fa";
import {HiOutlineMail} from "react-icons/hi";
import {BsPencilSquare} from "react-icons/bs";
import bgImage from '../../assets/rackupDefault.mp4';

import { db } from '../../Shared/Components/Database/Firebase';
import { getDocs, collection, deleteDoc } from 'firebase/firestore';


const DefaultPage = () => 
{
    ////////////*************************************************************** */
    /*const accountExpiration = async(e) =>{

        const snap = await getDocs(collection(db, "temp_account"));
        console.log("snap "+JSON.stringify(snap));
        snap.docs.map(async(doc)=>{
            if(Math.floor(Date.parse(new Date()) - (Date.parse(doc.data().request_time)))/3600000>2){
                const uid = doc.data.uid;
                if(doc.data().userInfo.category==="Student") await deleteDoc(db, "users", uid);
                else if(doc.data().userInfo.category==="Teacher") await deleteDoc(db, "teachers", uid);
                try{
                
                    const response = await fetch(`http://localhost:5000/users/${uid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type':'applcation/json'
                        },
                        // body: JSON.stringify(uid)
                    });
            
                    const resData = response.json();
                    alert('Account deleted!');
                }catch(err){
                    console.log(err);
                }
            }
        })
      
    }
    accountExpiration();*/
    
    //<img src= "" alt= "Space for hkj"/>
    return( 
    <React.Fragment>
        <div className="default-page">

        

        {/* <div className="flex-item1"> */}
            <video className="background-video" autoPlay loop muted> 
                <source src={bgImage} type="video/mp4"/>
    </video>
        
        {/* </div> */}

        </div> 



        <div className='second-section'>
            <h1>Features</h1>

            <div className='flex-container_2'>
        
                <div className='flex-item2'>    
                    <FaCloudUploadAlt size = "2em" />
                    <h3 className='title'> Upload your work</h3>
                    <hr className='hr-shortline linewidth'/>
                    <hr className='hr2 linewidth'/>
                    <p className='descrip'>You can upload your work in the forms of files<br/>
                    i.e.pdfs, share links of your websites and many more! </p>
                
                </div>


                <div className='flex-item2'>    

                    <BsPencilSquare size="1.5em"/>
                    <h3 className='title'> Rate and Review </h3>
                    <hr className='hr-shortline linewidth'/>
                    <hr className='hr2 linewidth'/>
                        <p className='descrip'>You works would be rated and reviews can be  <br/>
                        posted by the faculty members of the University. </p>
                    
                </div>

                <div className='flex-item2'>    
                    <HiOutlineMail size = "2em"/>
                    <h3 className='title'> Email Authentication </h3>

                    <hr className='hr-shortline linewidth'/>
                    <hr className='hr2 linewidth'/>

                    <p className='descrip'> Email sent to the supervisor for the authentication of the work.</p>
                
                </div>
            </div>

        </div>

    

    </React.Fragment>);
};

export default DefaultPage;