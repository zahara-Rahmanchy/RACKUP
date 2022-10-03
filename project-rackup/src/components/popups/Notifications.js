import React, {useState, useEffect, useContext} from "react";
import { where, query, onSnapshot, collection, doc, updateDoc, FieldValue, arrayRemove, getDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../../Shared/Components/Database/Firebase";
// import {db} from "../Shared/Components/Database/Firebase";
import "./Notifications.css";
import { FaTimes } from "react-icons/fa";
import { loggedUserDataContext } from "../Contexts";
import NotificationNum from "./NotificationNum";

const Notifications =(props)=>{
    const[reqPost,setReqPost] = useState([]);
    const {userData, setUserData} = useContext(loggedUserDataContext);

    useEffect(() =>{
        
        const postref = collection(db,"requests");
        
        const q =query(postref,where("supervisor","==",userData.shortForm));
        onSnapshot(q,(snapshot) => {
            console.log(snapshot);
            const reqPost = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }
            ))
            setReqPost(reqPost);
        })
    },[]);
    

    //handle Approval
    const handleApprove = (docid, type) => {
        if(type==='Project'){
            const postRef = doc(db,'projects', docid);
            
            updateDoc(postRef, {
                approved: true,
            });
            alert("1 request is approved.");

        }else if(type==='Research'){
            const postRef = doc(db,'researches', docid);
            
            updateDoc(postRef, {
                approved: true,
                
            });
            alert("1 request is approved.");
        }
      
    }

    //remove requests
    const handleRemove = async(id) => {
        const requestRef = doc(db, "requests", id);
        await deleteDoc(requestRef);
        <NotificationNum/>
    }

    const handleDeletePost = async(id, type, reqId) =>{
        if(type==="projects") {
            await deleteDoc(doc(db, "projects", id))
            alert('Post has been deleted from projects');
            handleRemove(reqId);

        };
       
        if(type==="researches"){
            await deleteDoc(doc(db, "researches", id));
            alert('Post has been deleted from researches');
        }
        // if(props.collection==="researches") deleteDoc(doc(db, "researches", id));
       
    }
   
    return(props.trigger)?
        (<>
            <div className="overlay-req-div">
                <div className="request-div">
                    <h1 style={{"color":"white"}}>Requests</h1>
                    <div className="close-drawer" onClick={((e)=>{props.setTrigger(false)})}><FaTimes size={20} style={{"color":"white"}}/></div>
                    <div className="req-body">
                        {reqPost.map((request) => (
                            
                            <div className="req-container">
                                <div className="remove" onClick={((e)=>{handleRemove(request.id)})}><FaTimes size={15}/></div>
                                <h2 className="title">
                                    {request.notifications.title}
                                    {/* <span>{request.id}</span> */}
                                    {console.log("req id: "+request.id)}
                                    <span className="btn-span">
                                        {console.log(request.notifications)}
                                        <button className="btn-action" id="approve" onClick={((e)=>{handleApprove(request.notifications.projectId, request.notifications.type)})}>Approve</button>
                                        <button className="btn-action" id="remove" onClick={((e)=>{handleDeletePost(request.notifications.projectId, request.notifications.type, request.id);})}>Remove</button>
                                    </span>
                                    {/* <span className="btn-span"><button>Remove</button></span> */}
                                </h2>
                                <p id="requestInfo">
                                    <b>Name:</b> {request.notifications.studentName};<br></br><b>ID:</b> {request.notifications.studentId};<br></br><b>Batch:</b> {request.notifications.batch};<br></br><b>Department:</b> {request.notifications.department};<br></br><b>Type:</b> {request.notifications.type};<br></br><b>{request.notifications.type} Title:</b> {request.notifications.title};
                                </p>

                            </div>
                            
                        ))}
                    </div>
                    
                </div>
            </div>
        </>
    ):"";
    
}

export default Notifications;