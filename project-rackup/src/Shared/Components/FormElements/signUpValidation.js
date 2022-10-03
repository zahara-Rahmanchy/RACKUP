const signUpValidation = (values, category) => {
    let err={};
    if(!values.name){
        err.name = "Name is required.";
    }
    if(values.category==="Student"){
        if(!values.studentId){
            err.studentId = "ID is required.";
        } else if(!(/^[0-9]+$/.test(values.studentId))){
            err.studentId = "invalid ID.";
        }
    }
    if(values.category==="Teacher"){
        if(!values.teacherId){
            err.teacherId = "Short-form is required.";
        } else if(!(/^[A-Z]+$/.test(values.teacherId))){
            err.teacherId = "Please put letters in capital.";
        }
    }
    if(!values.category){
        err.category = "Please select a category";
    }
    if(!values.department){
        err.department = "Please select a department";
    }
    if(!values.email){
        err.email = "Email is required.";
    } else{
        if(values.category==="Student"){
            if(!(/^[a-z]+_\d+@(lus.ac.bd)$/.test(values.email))){
                err.email = "invalid Email.";
            }
        }else{
            
            if(!(/^[a-z]+_?\d*@gmail.com$/.test(values.email))){
                err.email = "invalid Email.";
            }
           
        }
    } 
    if(!values.password){
        err.password = "Password is required.";
    } 
    
    else if(!(/^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{6,18}$/.test(values.password))){
        err.password = "Password must contain at least one digit, one alphabet and one special character.";
        if (values.password.length < 6){
            err.password = "Password length is less than 6 characters.";
            }
        
    }
        
    if(values.password!==values.confirmPassword){
        err.confirmPassword = "Password didn't match.";
    }
    return err;
};

export default signUpValidation;