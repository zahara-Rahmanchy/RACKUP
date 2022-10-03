const Validators = (title, supervisor, batch) => {
    let errors={};
    if(!title){
        errors.title = "Write a title";
    } else if(!(/^[a-zA-Z]+$/.test(title))){
        errors.title = "Title should contain only letters and digits";
    }
    if(!(/^[A-Z]+$/.test(supervisor))){
        errors.supervisor = "Supervisor name should be their abbreviated name in capital.";
    }
    if(!(/^[0-9]+$/.test(batch))){
        errors.batch = "Write a valid batch name";
    }
    return errors;
};

export default Validators;