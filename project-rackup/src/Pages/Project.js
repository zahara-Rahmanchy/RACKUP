import React, { useState, useRef, useContext, useEffect} from "react";
import emailjs from '@emailjs/browser';
import {ImUpload} from 'react-icons/im';
import {AiOutlineClose} from 'react-icons/ai';
import {FaTimes} from 'react-icons/fa';
import {BiLinkAlt} from 'react-icons/bi';
import {MdOutlineDevices} from 'react-icons/md';
import {collection, addDoc, updateDoc, where, query, arrayUnion, onSnapshot, doc, setDoc} from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

import { db } from "../Shared/Components/Database/Firebase";
import Postblock from '../components/popups/Postblock';
import './Project.css';
// import { async } from "@firebase/util";
import { FileType } from "../components/FileType";
import { sendEmailVerification } from "firebase/auth";
import { loggedUserDataContext} from "../components/Contexts";
import { toast, ToastContainer } from "react-toastify";
import Slider from "../components/Slider";
import Validators from "../components/Validators";


// export const storage = getStorage();
const Project = (props) =>{
    
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [filesArray, setFilesArray] = useState([]);
  const[formState,setformState] = useState(false);
  const [fileURLArray, setFileURLArray] = useState([]);
  const storage = getStorage();

  const [title, setTitle] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [popupLinkInput, setPopupLinkInput] = useState(false);
  const [batch, setBatch] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [linkArr, setLinkArr] = useState([]);
  //userData
  const {userData, setUserData} = useContext(loggedUserDataContext);
  const[link,setLink] = useState("");

  const [isConfirm, setIsConfirm] = useState(false);
  // const currentUserInfo = JSON.parse(window.localStorage.getItem('currentUserInfo'));
  const dept = window.localStorage.getItem('dept');
  const [errors, setErrors] = useState({});
  const [isTouched, setTouch] = useState(false);

  // const info = JSON.stringify()
  console.log("userData : "+JSON.stringify(userData));
  console.log("use id: "+userData.name);

  var date = new Date().toLocaleString('en-US');  // US English uses month-day-year order and 12-hour time with AM/PM
  console.log("date: "+date);

  console.log("isarray:"+Array.isArray(fileURLArray));
  console.log(fileURLArray);

  var projectid = "";

  //handle errors
  useEffect(()=>{
      
    const errorHandler=async()=>{
      setErrors(Validators(title, supervisor, batch));
    };
    errorHandler();
    
  },[title, supervisor, batch]);

  const handleClick=(e)=>{

    setformState(!formState);
    //if the state is true then it will become false and false then will become true
  }


  const handleFileChange = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return
    }

    const files = e.target.files;

    const temp = Array.from(files);
    console.log(filesArray);
    const previewFilesArray = temp.map((file)=>{
      return file;
    });

    
    setSelectedFile((prevFile)=>prevFile.concat(temp)); ////previewFilesArray
    setFilesArray((prev)=>prev.concat(temp));
    
    console.log(previewFilesArray);

  };

  //on clicking the device icon
  const handleDevClick = (e) => {
    e.preventDefault();
    // open file input box on click of other element
    inputRef.current.click();

  };

  //on clicking link icon
  const handleLinkClick=(e)=>{
    e.preventDefault();
    setPopupLinkInput(!popupLinkInput);
  }

  //add link
  const addLink = e =>{
    e.preventDefault();
    if(link){
      setLinkArr((prev)=>prev.concat(link));
      setLink("")
    }
    else alert("Link field is empty.");
      
  }


  const handlePost = async(e) => {
    e.preventDefault();
    
    console.log("fileArr: "+fileURLArray);
    projectid = uuidv4();
    const projectsCollectionRef = doc(db, "projects", projectid);
    
    if(linkArr || fileURLArray){
      //used setdoc() to create new doc with a given doc id
      await setDoc(projectsCollectionRef, {creatorId: userData.email, creatorProfilePhoto: userData.profilePhoto, creator: userData.name, date_created: date, materials: fileURLArray, links: linkArr, ratings: [], reviews: [], title: title, department: userData.department, approved: false, supervisedBy: supervisor});
      alert("Project posted!");
    }else return alert("No resources found! Please put something to upload...");
    
    if(userData.category==="Student"){
      sendEmail(e);
      const facultyCollRef = collection(db, "requests");

      const request = {type: 'Project', title: title, studentName: userData.name, studentId: userData.studentId, batch: batch, department: userData.department, projectId: projectid, supervisor: supervisor};
      await addDoc(facultyCollRef, {notifications: request, supervisor: supervisor});

    }
    //clear memory
    fileURLArray.length = 0;
    filesArray.length = 0;
    selectedFile.length = 0;
    linkArr.length = 0;
    
    setIsConfirm(false);
    setShowProgress(false);
    setBatch("");
    setTitle("");
    setSupervisor("");
    setTouch(false);
    
  }

  //send email notification to supervisor
  // const sendEmail = (e) => {
  //   e.preventDefault();

  //   emailjs.sendForm('service_w3p8fwh', 'template_y6lij2e', formRef.current, 'lVIYKhcJYyb8Z8Mng')
  //     .then((result) => {
  //         console.log(result.text);
  //     }, (error) => {
  //         console.log(error.text);
  //     });
  // };
  console.log("selected "+selectedFile.length);
  console.log("selectedLink "+linkArr.length);

  //confirm files
  const handleConfirmation = (e) => {
    e.preventDefault();
    console.log("selectedI "+selectedFile.length);
    console.log("selectedLinkI "+linkArr.length);
    if(((userData.category==="Teacher" && !errors.title) || (userData.category==="Student" && (!errors.title&&!errors.batch&&!errors.supervisor))) && ((selectedFile.length>0 && linkArr.length>0)||selectedFile.length>0)){
      // if((userData.category==="Teacher" && !errors.title) || (userData.category==="Student" && !errors)){
        var count = 0;
        alert("Please wait until the files get uploaded...");
        filesArray.forEach((file,index)=>{
          
          const storageRef = ref(storage, `${userData.studentId}/${title}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed', 
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgressPercent(progress);
              setShowProgress(true);

              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
                default:
                  console.log('canceled');
                  break;
              }
            }, 
            (error) => {
              alert(error);
            }, 
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                alert("File: "+(index+1)+" is uploaded.");
                // console.log('File '+index+ ' available at', url);
                setFileURLArray((prev)=>prev.concat(url));
                console.log("url: "+url);
                console.log("array: "+fileURLArray);
                count++;
                if(count === filesArray.length){
                  alert("Upload complete!");
                  setIsConfirm(true);  // show post btn on upload completion by setting the isConfirm to true
                }
              });
            }
          );
        
        });
        
        console.log("files: "+selectedFile.length);
      // }else toast.error("Invalid field input!");
    }else if(linkArr.length>0 && !selectedFile.length>0){
      setIsConfirm(true);
    }else{
      toast.error("Invalid field input!");
    }
  }

  const handleCancel=(e)=>{
    e.preventDefault();
    fileURLArray.length = 0;
    filesArray.length = 0;
    selectedFile.length = 0;
    linkArr.length = 0;
    
    setIsConfirm(false);
    setShowProgress(false);
    setBatch("");
    setTitle("");
    setSupervisor("");
    setformState(false);
  }


  return(

  <>
    <div className="project-body">
        <ToastContainer className={"toast"}/>
        <div className="project-header" >
          <Slider slideImg="projects"/>
        </div>
          <div className="upload-here" onClick= {handleClick}>

                    <div className="upload-icon">
                        <ImUpload/> 
                  </div>
                  <h3>Click here to Upload your Project</h3>
                  
          </div>

            {/*here upload form popup is designed */}
                  
          {/* this formState && is short of terinary operator so if formState true then it will show up else not AiOutlineClose*/}
      
        {formState && (
          <div className="overlay"  > 
          
              <div className="form-upload-container" >
                  <button  onClick={handleClick} className="close-upload-btn" > 
                      <AiOutlineClose/> 
                  </button>
              
                  <h2 className="h2tag">Upload Your Project</h2>
              
                  <form action ="/add-project" method="post" ref={formRef} className="upload-form" autoComplete="off" onSubmit={handlePost}>
                      
                      <input className="project-input" autoComplete="off" type = "text" name="titleId" value={title} placeholder="Title of the Project" onChange={((e)=>{setTitle(e.target.value); setTouch(true)})}/>
                      {errors.title &&   <span className="error">{errors.title}</span>}

                      {userData.category==="Student" && <><input className="project-input" type = "text" name="supervisorId" placeholder= "Name of your Supervisor" value={supervisor} onChange={((e)=>{setSupervisor(e.target.value); setTouch(true)})}/>
                      {errors.supervisor  &&  <span className="error">{errors.supervisor}</span>}</>
                      }

                      {userData.category==="Student" && <><input className="project-input" type = "text" name="batchId" placeholder= "Batch" value={batch} onChange={((e)=>{setBatch(e.target.value); setTouch(true)})}/>
                      {errors.batch  &&  <span className="error">{errors.batch}</span>}</>
                      }
                      
                      {/**hidden fields */}
                      <input className="project-input" type = "text" style={{display: 'none'}} name="supervisorEmailId" placeholder="mahnurakther@gmail.com" value="mahnurakther@gmail.com" onChange={((e)=>{})}/>
                      <input className="project-input" style={{display: 'none'}} name="messageinfo" value={"Title: "+title+"; Student name: "+userData.name+"; Batch: "+batch+"; Department: "+userData.department+";"} onChange={((e)=>{})}/>

                      <input type = "file" style={{display: 'none'}} name="projectId" placeholder="Add your Project " ref={inputRef} onChange={handleFileChange} multiple/>

                      <div className="files-div">
                        {selectedFile.length===0 && linkArr.length===0 && <p style={{color: "black", fontFamily: "serif", fontStyle: "italic"}}>Upload here</p>}
                        {selectedFile && 
                        
                          selectedFile.map((file, index)=>{
                            
                            return(
                              <div key={index} className="file">
                                <div className="file-icon">{FileType[filesArray[index].name.split('.')[1]] || FileType['default']} </div>
                                <div className="file-info">
                                  <p className="info-tag">{filesArray[index].name}</p>
                                  <p className="info-tag">{filesArray[index].size}</p>
                                  {showProgress && <div className="progressbar"><progress className="bar" value={progressPercent} max="100"/></div>}
                                </div>
                                {/* <div className="progressbar"><progress value={progressPercent} max="100"/></div> */}
                                <span className="span-remove-btn" onClick={((e)=>{setSelectedFile(selectedFile.filter((e)=>e!==file)); setFilesArray(filesArray.filter((e)=>e!==filesArray[index]));})} ><FaTimes size={15}/></span>
                              
                              </div>
                            );
                          }) 
                        }

                        {linkArr && linkArr.map((links)=>{ 
                          return (
                            <div className="file">
                              <div className="file-icon">{FileType['link']}</div>
                              <div className="file-info">
                                <p className="info-tag">{links}</p>
                              </div>
                              <span className="span-remove-btn" onClick={((e)=>{setLinkArr(linkArr.filter((e)=>e!==links))})} ><FaTimes size={15}/></span>
                            </div>
                          )
                        })}
                      </div>
                      
                        <div className="btns-div"> 
                          <div className="button file-iconBtn" onClick={handleDevClick}> <MdOutlineDevices className="icon-btn"/><span className="toolText1">Device</span></div>

                          <div className="button file-iconBtn" onClick={handleLinkClick}> <BiLinkAlt className="icon-btn"/><span className="toolText1">Link</span></div>
                          {/*********************NEW********************/}
                          {popupLinkInput &&
                            
                            <>
                                <input
                                  className="link-input" autoComplete="off" type = "url" name="linkId" value={link} placeholder="Add your link heres" onChange={((e)=>{setLink(e.target.value)})}
                                />
                                <button className="add-btn" onClick={addLink}>ADD</button>
                            </> 
                          }

                        </div>
                      
                      <div className="bottom-div">
                        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                        <button className="add-button" onClick={handleConfirmation}>Confirm</button>
                        {isConfirm && <button className={"post-button"} onClick={handlePost}>Post</button>}
                        
                      </div>
                  </form>    
              </div>          
          </div>
                  
      )}

      <Postblock collection="projects"/>
    </div>
  </>
  )
};

export default Project;