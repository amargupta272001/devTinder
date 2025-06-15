const validator = require('validator')


const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not valid!");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!");
    }
};

const validateLoginData = (req) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new Error("Fill all required fields!");
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not valid!");
    }
};


module.exports = {
    validateSignupData,
    validateLoginData
};