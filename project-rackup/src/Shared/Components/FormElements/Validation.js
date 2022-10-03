const Validation = (values) => {
    let errors={};
    if(!values.loginId){
        errors.loginId = "Email is required.";
    } else if(!(/^[a-z]+_?\d*@(lus.ac.bd|gmail.com)$/.test(values.loginId))){
        errors.loginId = "invalid ID.";
    }
    if(!values.logPassword){
        errors.logPassword = "Password is required.";
    } 
    else if(!(/^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{6,18}$/.test(values.logPassword))){
        errors.logPassword = "Invalid Password";
        if (values.logPassword.length < 6){
            errors.logPassword = "Password length is less than 6 characters.";
            }
        
    }
    // if(!values.signingCat){
    //     errors.signingCat = "Please select a category";
    // }
    return errors;
};

export default Validation;