//import { isDisabled } from "@testing-library/user-event/dist/utils";
import React,{useContext, useEffect, useState, useRef} from "react";
import {addDoc, deleteDoc, doc, getDoc, onSnapshot, where} from "firebase/firestore";
import {FaTimes} from "react-icons/fa";
import {collection, getDocs} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../Database/Firebase";

import './Login.css';
import Validation from "./Validation";
import {db} from "../Database/Firebase";
import { userContext } from "../../../components/Contexts";
import { loggedUserDataContext } from "../../../components/Contexts";
import { validate } from "uuid";
import { async } from "@firebase/util";



// Router.browserHistory.push('/somepath');

const usersCollectionRef = collection(db, "users"); //stores the 'users' collection in the usersCllectionRef object
const teachersCollectionRef = collection(db, "faculties"); //stores the 'users' collection in the usersCllectionRef object


const Login = (props)  => {

    //creating account for new user signed in via email link verification
    const newUser = auth.currentUser; 
    console.log("user data:", newUser);

    ///********NEW*********loggedUserDataContext
    const {userData, setUserData} = useContext(loggedUserDataContext);

    const [values, setValues] = useState({
        loginId : "",
        logPassword: "",
        signingCat: "",
       
    });

    const {state, dispatch} = useContext(userContext);  ///useContext listens to the changes that occurs in userContext
    const redirect = useNavigate();  ///api to navigate to a specific path

    const [isloggedIn, setLogIn] = useState(false);
    const [isTouched, setTouch] = useState(false);
    
    const [users, setUsers] = useState([]);
    var valid = false;
    var username = '';
    let formDivRef = useRef();

    // var userNew = [];
  
    const [errors, setErrors] = useState({});
    
    const isValidUser = () => {
        
        users.map((user) => {
           
            if(values.loginId===user.email && values.logPassword===user.password){
                //console.log(valid);
                setLogIn(true);
                valid=true;
                
                setUserData({type:"USERINFO", payload: user});
                
            }
            return valid;
        });
    }
    console.log("test: "+values.signingCat);
    //to collect users data from db and set data
    // useEffect runs at the end of the render cycle
    useEffect(()=>{
        const getUsers=async()=>{
            try{
                
                if(values.signingCat==="Student"){
                    const data = await getDocs(usersCollectionRef); //await is used for the function to wait until get all the values
                    setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
                } 
                else if(values.signingCat==="Teacher"){
                    const data = await getDocs(teachersCollectionRef);
                    //console.log(data);
                    setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
                } 

            }catch(error){
                alert(error);
            }
                    
        };
        getUsers(); //returns promise
    
    },[values.signingCat]);

    
  
    //to update input value immediately on change
    useEffect(()=>{
        
        const errorHandler=async()=>{
            setErrors(Validation(values));
        };
        errorHandler();
       
    },[values]);

    
    const handleLogin = (event)=>{
        event.preventDefault();
        // accountExpiration();
        
        if(Object.keys(errors).length === 0){   ///Calculate errors object's length
                                                /// The Object.keys() method returns an array of a given object's own enumerable property names, and the length property returns the number of elements in that array.
            
            console.log("validate "+valid);
            // if(auth.currentUser.emailVerified){

            signInWithEmailAndPassword(auth, values.loginId, values.logPassword)
            .then(async(userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("userCred: "+JSON.stringify(user));
                //******check for new user sigining in*******
                const docSnap = await getDoc(doc(db, "temp_account", user.email))/*.then(async(docSnap) => {*/
                if (docSnap.exists()) {
                    console.log("Document data:"+ docSnap.data());
                    if(user.emailVerified && (user.email===docSnap.data().userInfo.email)){
                        console.log("Document email:", docSnap.data().userInfo.email);
                        if(docSnap.data().userInfo.category==="Student"){
                            // await addDoc(usersCollectionRef, {category: docSnap.data().userInfo.category, name: docSnap.data().userInfo.name, email: docSnap.data().userInfo.email, password: docSnap.data().userInfo.password, studentId: docSnap.data().userInfo.studentId, department: docSnap.data().userInfo.department, profilePhoto: ""});
                            alert('account created successfully');
                            await deleteDoc(doc(db, "temp_account", user.email));
                        }
                        else if(docSnap.data().userInfo.category==="Teacher"){
                            // await addDoc(teachersCollectionRef, {category: docSnap.data().userInfo.category, name: docSnap.data().userInfo.name, shortForm: docSnap.data().userInfo.teacherId, email: docSnap.data().userInfo.email, password: docSnap.data().userInfo.password, department: docSnap.data().userInfo.department, profilePhoto: "", requests: []})
                            alert('account created successfully');
                            await deleteDoc(doc(db, "temp_account", user.email));
                        
                        }
                    }
                }
                isValidUser();
                console.log("val   "+valid);
                if(user.emailVerified && valid){
                    setLogIn(true);
                    props.setTrigger(false);
                    dispatch({type:"USER", payload: true});
                    
                    redirect("/Project");
                }else{
                    toast.error("Do not have an account/Your connection is poor!");
                }
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
            });
            
        }else{
            toast.error("Insert valid data");
        }
        console.log('valid1:'+valid);
        // window.localStorage.setItem('LOG_BAR', valid);
    };

    const changeHandler =(event)=>{  //in place of handleChange
        let dataUpdated={
            ...values,
            [event.target.name]: event.target.value,
            
        };
        setValues(dataUpdated);
        setTouch(true);
    };
   

    return (props.trigger) ? (

        <div className="form-login-div" onClick={(event) => {if(!formDivRef.current.contains(event.target)){ props.setTrigger(false);}}}>
            
            <div ref={formDivRef} className="form-container-login" >
                <h2 className="h2tag">
                    Sign In
                </h2>
                <button  className="close-log-button" type={"button"} onClick={() => props.setTrigger(false)}> <FaTimes/> </button>

                <form autoComplete="off" onSubmit={handleLogin} className="form-login">
                    
                    <input className = 'input-log-field' autoComplete="off"
                        type="text"
                        name = "loginId"
                        value={values.loginId}
                        placeholder="Student Email"
                        onChange={changeHandler}
                        //onMouseEnter = {setTouch(true)}
                    />
                    {errors.loginId && isTouched && <span className="error">{errors.loginId}</span>}

                    <input className = 'input-log-field' autoComplete="off"
                        type="password"
                        name = "logPassword"
                        value={values.logPassword}
                        placeholder="Password"
                        onChange={
                            changeHandler 
                        }
                        //onMouseEnter = {setTouch(true)}
                        
                    />
                    {errors.logPassword && isTouched &&  <span className="error">{errors.logPassword}</span>}

                    <select name="signingCat" className = 'select-field' onChange={changeHandler}>
                        <option selected disabled>Signing as</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                        
                    </select>
                    {errors.signingCat &&   <span className="error">{errors.signingCat}</span>}

                    <button  className="login-button" type={"submit"} onClick={handleLogin}> LogIn</button>
                    <ToastContainer/> 
                </form>
            </div>

        </div>
       
    ):"";
    
};


export default Login;

//request.auth != null