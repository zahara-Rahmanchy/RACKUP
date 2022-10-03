import React, { useEffect, useState, useContext } from "react";
import {collection,CollectionReference,deleteDoc,doc,onSnapshot,orderBy,query, where } from "firebase/firestore";
import {BiDotsVerticalRounded} from "react-icons/bi";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {FcApproval} from "react-icons/fc";

import { db } from "../../Shared/Components/Database/Firebase";
import './Postblock.css';
import RatingAndReview from "./RatingAndReview";
import { getStorage, ref } from "firebase/storage";
import { FileType } from ".././FileType";
import ShowReview from "./ShowReview";
import { deptFilterContext, loggedUserDataContext } from "../Contexts";


const Postblock =(props)=>{
    const[post,setPost] = useState([]);
    const [ID, setID] = useState();
    const [showRevId, setShowRevId] = useState();
    const[showReviewForm, setShowReviewForm] = useState(false);
    const[showReview, setShowReview] = useState(false);
    //show delete option
    const[delOp, showDelOp] = useState(false);
    const[postID, setPostID] = useState("");
    const storage = getStorage();
    const {dept, setdept} = useContext(deptFilterContext);
    const {userData, setUserData} = useContext(loggedUserDataContext);
    
    
    
    useEffect(() =>{
        var postref;
        if(props.collection==="projects"){
            postref = collection(db,"projects");
        }else{
            postref = collection(db,"researches");
        }
        var q;
        if(dept==="CSE"||dept==="EEE"||dept==="CE"){
            q = query(postref,orderBy("date_created","desc"),where("department", "==", dept));
            
        }else if(dept==="ALL"){
            q =query(postref,orderBy("date_created","desc"));
        }else q =query(postref,orderBy("date_created","desc"));

        onSnapshot(q,(snapshot) => {
            console.log(snapshot);
            const post = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }
            ))
            setPost(post);
        })
    },[dept]);

////to calculate the average ratings
    const checkRate = (e) => {
        return (e.reduce((x, y) => x + y, 0))/e.length;
    }

    //delete function
    const handleDelete = (id) =>{
        if(props.collection==="projects"){
            if(window.confirm('Are sure you want to delete this post?')===true) deleteDoc(doc(db, "projects", id));
        } 
        if(props.collection==="researches"){
            if(window.confirm('Are sure you want to delete this post?')===true) deleteDoc(doc(db, "researches", id));
        }
        showDelOp(false);
    }

    // var profileref;
    return(
        <>
        {!post && <h4>{console.log("research: "+post)}No posts found!</h4>}
        {
        post.map((posts) => (
            
            <div className="post-container" key ={posts.id}>
                {/* {posts.id===ID} */}
                <div className="top-bar">
                    <div className="approved">{posts.approved ? <FcApproval size={25} className="aprroval-icon"/>:""}</div>
                    <div className="option" onMouseEnter={((e)=>{showDelOp(true); setPostID(posts.id)})} onMouseLeave={((e)=>showDelOp(false))} /*onClick={((e)=>{showDelOp(!delOp); setPostID(posts.id)})}*/>
                        <BiDotsVerticalRounded size={25}></BiDotsVerticalRounded>
                        {userData.email===posts.creatorId && posts.id===postID && delOp && <span className={"del-post"} onClick={(e)=>(handleDelete(posts.id))}>Remove</span>}

                    </div>
                    {/* {userData.studentId===posts.creatorId && posts.id===postID && delOp && <span className={"del-post"} onClick={(e)=>(handleDelete(posts.id))}>Remove</span>} */}
                </div>
                <div className="post-body">
                    {/*{console.log("ref: "+posts.creatorProfilePhoto)*//* {profileref=collection(db, "users", where('team', '==', teamDbRef))} */}
                    {/* <div className="creator">{(posts.creatorProfilePhoto) ? <img className="profile-img" src={posts.creatorProfilePhoto}/> : <FaUserCircle size={30}/>}<h3>{posts.creator}</h3></div> */}
                    <div className="top-div"><div className="creator">{(posts.creatorProfilePhoto) ? <img className="profile-img" src={posts.creatorProfilePhoto}/> : <FaUserCircle size={30}/>}<h3>{posts.creator}</h3></div> 
                     <span className="sup_name"> Supervised By: {posts.supervisor} </span>
                    </div>
                    <h3 className="post_date">{posts.date_created}</h3>
                    {/* <p>{posts.date_created}</p> */}
                    <h2 className="h1">{posts.title}</h2>
                    {userData.category==="Student" && posts.supervisor && <h3 className="sup_name"> Supervised By: {posts.supervisor}</h3>}
                    <div className="rate-icons">
                        
                        <span key={1} className="star"><FaStar size={20} className={(checkRate(posts.ratings)>1 || checkRate(posts.ratings)===1) ? "star active":"star"}/></span>
                        <span key={2} className="star"><FaStar size={20} className={(checkRate(posts.ratings)>2 || checkRate(posts.ratings)===2) ? "star active":"star"}/></span>
                        <span key={3} className="star"><FaStar size={20} className={(checkRate(posts.ratings)>3 || checkRate(posts.ratings)===3) ? "star active":"star"}/></span>
                        <span key={4} className="star"><FaStar size={20} className={(checkRate(posts.ratings)>4 || checkRate(posts.ratings)===4) ? "star active":"star"}/></span>
                        <span key={5} className="star"><FaStar size={20} className={(checkRate(posts.ratings)===5) ? "star active":"star"}/></span>
                        
                    </div>
                    
                    <div className="show-ratings">{posts.ratings.length} Ratings</div>
                    <div className="block-div">
                    {posts.materials && posts.materials.map((file, index)=>{
                        const httpsRef = ref(storage, file);
                        // console.log(httpsRef.name);
                        return(
                            
                            <Link to="https://www.google.com/">
                                <div key={file} className="file-block" onClick={((e)=>{
                                    window.open(file, "_blank");
                                    })}>
                                    <div className="file-icon">{FileType[httpsRef.name.split('.')[1]] || FileType['default']} </div>
                                    <div className="file-info">
                                        <p className="info-tag">{httpsRef.name}</p>
                                        <p className="info-tag">{httpsRef.size}</p>
                                    </div>
                                    <span className="remove-file" onClick={((e)=>{e.preventDefault()})} ><FaTimes size={15}/></span>
                                
                                </div>
                            </Link>
                            
                            );
                    }) }
                    {posts.links && posts.links.map((link, index)=>{
                        
                        return(
                            
                            <Link to="https://www.google.com/">
                                <div key={link} className="file-block" onClick={((e)=>{
                                    window.open(link, "_blank");
                                    })}>
                                    <div className="file-icon">{FileType['link']} </div>
                                    <div className="file-info">
                                        <p className="info-tag">{link}</p>
                                    </div>
                                    <span className="remove-file" onClick={((e)=>{e.preventDefault()})} ><FaTimes size={15}/></span>
                                
                                </div>
                            </Link>
                            
                            );
                    }) }
                    </div>  
                    {/* <img src={posts.materials} alt="title" style={{height:180,width:180}}/> */}
                    <hr className="section-line"/>
                    <div className="bottom-section">
                        <div className="rate-review-section" onClick={((e) =>{
                            setShowReviewForm(true);
                            setID(posts.id); 
                            console.log('idreview  '+ID);
                        })}>Rate&Review</div> 
                        {posts.id===ID && <RatingAndReview trigger={showReviewForm} setTrigger={setShowReviewForm} id={ID} setId={setID} type={props.collection}/>}
                        
                        {/* <div className="show-review" onClick={((e) =>{setShowReview(true)})}>Show Reviews</div>  */}
                        <div className="show-review" onClick={((e) =>{
                            setShowReview(true);
                            setShowRevId(posts.id);
                            // console.log('idshowreview  '+showRevId);
                            })}>
                            Show Reviews
                        </div> 
                        {console.log('idshowreview...  '+showRevId)}
                        {posts.id===showRevId && <ShowReview trigger={showReview} setTrigger={setShowReview}  id = {showRevId} setId={setShowRevId} type={props.collection}/>}
                    
                    
                    </div>
                </div>
                
                
            </div>

        ))}
        
        </>
    )
}

export default Postblock;