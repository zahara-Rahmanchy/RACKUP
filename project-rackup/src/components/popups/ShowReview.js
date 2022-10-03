import React,{useEffect, useState} from "react";
import { FaTimes,FaUserCircle } from "react-icons/fa";
import { db } from '../../Shared/Components/Database/Firebase';
import {/*collection,onSnapshot,orderBy*,*/onSnapshot,doc, getDoc} from "firebase/firestore";
import './ShowReview.css';

const ShowReview = (props) =>{
 
    const [allReview, setAllReviews] = useState([]);
   
    console.log('doc id: '+props.id)
    useEffect(()=>{
        var showrevref
        if(props.type==="projects"){
            showrevref = doc(db,'projects', props.id);
        }else{
            showrevref = doc(db,'researches', props.id);
        }
        
        const getReviews=async()=>{
            const showRevSnap = await getDoc(showrevref);
            // const temp = Array.from(showRevSnap.data().reviews);
            setAllReviews(showRevSnap.data().reviews);
        };
        getReviews();
        // onSnapshot(showrevref,(snapshot) =>{
        //     setAllReviews(snapshot.data().reviews);
        // })
        

    },[props.id]);
    
    console.log('isArrat'+Array.isArray(allReview));
    console.log(allReview);
    return(props.trigger)?(

        <div className="review-div">

            <div className="review-container">
                <button className='close-review-form'onClick={((e) =>{props.setTrigger(false)})}><FaTimes/></button>
                <h2 className='review-header'>Reviews</h2>

                {
                    allReview ?
                    allReview.map((getReview)=>(

                        <div className="reviews"> 
                            <div className="name-div"><FaUserCircle/> <p className="name">{getReview.username}</p></div>
                        
                            <p> {getReview.review}</p>
                        
                        </div>
                    ) ):<div><p>No Reviews</p></div>

                }

               
            </div>


        </div>


    ):'';


};
export default ShowReview;