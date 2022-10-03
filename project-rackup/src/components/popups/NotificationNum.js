import React,{useEffect,useState,useContext} from "react";
import { db } from "../../Shared/Components/Database/Firebase";
import { where, query, onSnapshot, collection, doc, updateDoc, FieldValue, arrayRemove, getDocs } from "firebase/firestore";
// import { loggedUserDataContext } from "../Contexts";
import "./Notifications.css";


const NotificationNum = (props)=>{
    const [count, setCount] = useState(0);
    
    // const {userData, setUserData} = useContext(loggedUserDataContext);
        useEffect(() =>{
            const getNotificaton = async() => {
                const notifRef = collection(db,"requests");
                const snapShot = await getDocs(notifRef);
                
                setCount(snapShot.size);
                // snapShot.docs.map((data)=>{return console.log("data  "+data.data());});
            }
            getNotificaton();
        
            console.log('count outside: ' + count);
    
        },[count]);

        return(
        <>             
            {count-1>0 ? <div className="notifNum"><h5 className="notif-div">{count-1}</h5></div> : ""} 
        </>
    );
}

export default NotificationNum;