//import { isDisabled } from "@testing-library/user-event/dist/utils";
import React,{useEffect, useRef, useState} from "react";
import './SignUp.css';

import signUpValidation from "./signUpValidation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from "react-icons/fa";
import {auth, db} from "../Database/Firebase";
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";


const Input = (props)  => {

  /*useReducer takes reducer function and initial state as arguments and returns an array of updatedState and dispatch fucntion */
    //turn submit off and then take values from input fields
    // const usersCollectionRef = collection(db, "users"); //stores the 'users' collection in the usersCllectionRef object
    // const teachersCollectionRef = collection(db, "teachers"); //stores the 'users' collection in the usersCllectionRef object


    const [values, setValues] = useState({
        name: "",
        category: "",
        studentId : "",
        teacherId: "",
        email: "",
        department: "",
        password: "",
        confirmPassword: "",
        //isloggedIn: false
    
    });

    const [err, setErr] = useState({});
    const [touched, setTouched] = useState(false);

    // const redirect = useNavigate();   //to navigate to the given path

    const createAccount=async()=>{    ///keyword async before a function makes the function return a promise
        //new start
        try{    
            await createUserWithEmailAndPassword(auth, values.email, values.password)
            // console.log(result);
            const newUser = auth.currentUser;
            //window.localStorage.setItem('newUser', JSON.stringify(newUser));
            //actinCodeSettings
            var actionCodeSettings = {
                url: 'http://localhost:3000/',
                
                handleCodeInApp: true,
                
              };
            
            sendEmailVerification(newUser, actionCodeSettings)
            .then(async() => {
                alert("verification link is sent to your email. Please verify and SignIn back to your New account.");
                props.setTrigger(false);
                // redirect('/');
                
            })
            .catch((error) => {
                //const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                
            });
            const usersRef = doc(db, "users", newUser.uid);
            const teachersRef = doc(db, "faculties", newUser.uid);
            if(values.category==="Student"){
                await setDoc(usersRef, {category: values.category, name: values.name, email: values.email, password: values.password, studentId: values.studentId, department: values.department, profilePhoto: ""});
            }else if(values.category==="Teacher"){
                await setDoc(teachersRef, {category: values.category, name: values.name, shortForm: values.teacherId, email: values.email, password: values.password, department: values.department, profilePhoto: ""});
            
            }
            await setDoc(doc(db, "temp_account", newUser.email), {email: values.email, userInfo: values, request_time: new Date().toLocaleString('en-US')});

           
        
        }catch(er){
            toast.error(er.message);
            console.log(er.message);
        }
     };  //new end

    ///everytime we request an api it always returns a promise
    ///promise is some sort of data that needs to be ressolved (i.e the function code returns a success or some error)
    //await addDoc(usersCollectionRef, {email: values.email, password: values.password, studentId: values.studentId});
    //The keyword await before a function makes the function wait for a promise


    useEffect(()=>{
        //let isCancelled = false;
        const errorHandler=async()=>{
            setErr(signUpValidation(values));
        };
        errorHandler();  //promise
        
    },[values]);


    const submitHandler = (e)=>{
        e.preventDefault();
        signUpValidation(values);
        if(Object.keys(err).length === 0){
            createAccount();
            
            //toast.success("Account created successfully!")
        }else{
            toast.error("Account creation denied.");
        }
    }

console.log("departments: "+values.department);
  //in changehandler function we can name the properties anything, here type and value is initialized, value is the value of input field
  const changeHandler =(e)=>{
    let dataUpdated={
        ...values,
        [e.target.name]: e.target.value,
        
    };
    // console.log(values.department);
    setValues(dataUpdated);
    setTouched(true);
  }

  let formDivRef = useRef();  ///new

    return (props.trigger) ? (

        <div className="form-div" onClick={(event) => {if(!formDivRef.current.contains(event.target)){ props.setTrigger(false);}}}>
           
            <div ref={formDivRef} className="form-container" >
                <h2 className="h2tag">Sign Up</h2>
                <button  className="close-button" onClick={() => props.setTrigger(false)}> <FaTimes/> </button>

                <form autoComplete="off" onSubmit = {submitHandler} className="form">
                    
                    <input className = 'input-field' autoComplete="off"
                        type="text"
                        name = "name"
                        placeholder="Name"
                        onChange={changeHandler}
                    
                    />
                    {err.name && touched &&  <span className="errors">{err.name}</span>}


                    <select name="category" className = 'select-field' onChange={changeHandler}>
                        <option selected disabled>Signing as</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                        
                    </select>
                    {err.category && touched &&  <span className="errors">{err.category}</span>}

                    
                    {values.category==="Student" && <input className = 'input-field' 
                        type="text"
                        name = "studentId"
                        placeholder="Student ID"
                        onChange={changeHandler}
                    
                    />}
                    {err.studentId && touched &&  <span className="errors">{err.studentId}</span>}

                    {values.category==="Teacher" && <input className = 'input-field' 
                        type="text"
                        name = "teacherId"
                        placeholder="Short-form of your name"
                        onChange={changeHandler}
                    
                    />}
                    {err.teacherId && touched &&  <span className="errors">{err.teacherId}</span>}

                    <input className = 'input-field' 
                        type="email"
                        name = "email"
                        placeholder="Email"
                        onChange={changeHandler}
                       
                    />
                    {err.email && touched && <span className="errors">{err.email}</span>}

                    {/* New selecting Dept*/ }
                    <select name="department" className = 'select-field' onChange={changeHandler} autoComplete="off">
                        <option selected disabled>Department</option>
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="CE">CE</option>
                        
                    </select>
                    {err.department && touched &&  <span className="errors">{err.department}</span>}

                    <input className = 'input-field' 
                        type="password"
                        name = "password"
                        placeholder="Password"
                        onChange={changeHandler}
                     
                    />
                    {err.password && touched && <span className="errors">{err.password}</span>}
                    
                    <input className = 'input-field' 
                        type="password"
                        name = "confirmPassword"
                        placeholder="Confirm Password"
                        onChange={changeHandler}
                    />
                    {err.confirmPassword && <span className="errors">{err.confirmPassword}</span>}

                    <button  className="sign-button" onClick={submitHandler}> Submit</button>
                    <ToastContainer/> 
                    
                </form>
            </div>

        </div>
    ):"";
    
};

export default Input;