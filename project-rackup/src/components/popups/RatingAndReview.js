import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import {FaTimes} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../../Shared/Components/Database/Firebase';
import { loggedUserDataContext } from '../Contexts';

import './RatingAndReview.css';

const RatingAndReview =((props) =>{
    const[review, setReview] = useState("");
    const[isActive, setIsActive] = useState(0);
    const userInfo = JSON.parse(window.localStorage.getItem('currentUserInfo'));
    const {userData, setUserData} = useContext(loggedUserDataContext);
    const inputRef = useRef();
    var rate = 0;


    const handleRatingReview = ((e) =>{
        e.preventDefault();
        console.log(review);
        // console.log("name:  "+userInfo.name);
        var reviewRef;
        if(props.type==="projects"){
            reviewRef = doc(db,'projects',props.id);
        }else{
            reviewRef = doc(db,'researches',props.id);
        }
        console.log(' Propsid: ' + props.id);
        
        if(review !== "" && isActive !== 0){
            updateDoc( reviewRef, {
                 reviews: arrayUnion({
                    username: userData.name,
                    review: review,

                }),
                ratings: arrayUnion(
                    isActive
                )
                
            });
            toast.success('Your Review and Rating has been posted!');
           
        }

        else if(review !=="" && isActive===0){
            updateDoc( reviewRef, {
                reviews: arrayUnion({
                    username: userData.name,
                    review: review,

                })})
                toast.success("Your Review has been posted!")

        }

        else if(review ==="" && isActive !==0){
            updateDoc( reviewRef, {
                ratings: arrayUnion(
                    isActive
                )
                
            });
            toast.success("Your Rating has been posted!")

        }
        else{
            toast.error("Please add a Review or a Rating!")
        }
        
    });

    const changeHandler = ((e) =>{
        setReview(e.target.value);
    });


    return(props.trigger)?(
       
        <div className='review-form-div'>
            <ToastContainer className='toast'/>
            <div className='review-form-container'>
                <button className='close-review-form' onClick={((e) =>{props.setTrigger(false); setIsActive(0); setReview("")})}><FaTimes/></button>
                <h3 className='rate'>Rate this Project</h3>
                <div className='rating-div'>
                    <input
                        // className='radio'
                        style={{display: 'none'}}
                        type="radio"
                        ref={inputRef}
                        value={rate}
                        onClick={() => {
                            // setRate(rate);
                            alert(`Are you sure you want to give ${rate} stars ?`);
                        }}
                    />
                    <span class="star" onClick={((e)=>{
                        rate=1;
                        if(isActive===1){
                            setIsActive(0);
                            rate=0;
                        }else{setIsActive(1);}
                        
                        inputRef.current.click();})}><FaStar className={(isActive>1 || isActive===1) ? "star active":"star"}/>
                    </span>
                    <span class="star" onClick={((e)=>{
                        rate=2;
                        if(isActive===2){
                            setIsActive(0);
                            rate=0;
                        }else{setIsActive(2);}
                        inputRef.current.click();
                        })}><FaStar className={(isActive>2 || isActive===2) ? "star active":"star"}/>
                    </span>
                    <span class="star" onClick={((e)=>{
                        rate=3;
                        if(isActive===3){
                            setIsActive(0);
                            rate=0;
                        }else{setIsActive(3);}
                        inputRef.current.click();
                        })}><FaStar className={(isActive>3 || isActive===3) ? "star active":"star"}/>
                    </span>
                    <span class="star" onClick={((e)=>{
                        rate=4;
                        if(isActive===4){
                            setIsActive(0);
                            rate=0;
                        }else{setIsActive(4);}
                        inputRef.current.click();
                        })}><FaStar className={(isActive>4 || isActive===4) ? "star active":"star"}/>
                    </span>
                    <span class="star" onClick={((e)=>{
                        rate=5;
                        if(isActive===5){
                            setIsActive(0);
                            rate=0;
                        }else{setIsActive(5);}
                        inputRef.current.click();
                        })}><FaStar className={(isActive===5) ? "star active":"star"}/>
                    </span>
                    
                </div>
                <div className='review-area'>
                    <form autoComplete="off" onSubmit={handleRatingReview} className="review-form">
                        <textarea
                            className='input-area'
                            type="textarea"
                            rows={3}
                            name = "review"
                            value={review}
                            placeholder="Write a Review here..."
                            onChange={changeHandler}
                        />
                        
                    </form>
                </div>
                
                <button className='post-review-form' onClick={handleRatingReview}>Post</button>
           
            </div>
            
        </div>
    ):"";

});

export default RatingAndReview;