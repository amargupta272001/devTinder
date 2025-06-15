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

const validateProfileEditData = (req) => {
    const editFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    const isProfileEditAllowed = Object.keys(req.body).every(field => editFields.includes(field));
    return isProfileEditAllowed;
};

const validateProfilePasswordData = (req) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if(!currentPassword || !newPassword || !confirmPassword){
        throw new Error("Fill all required fields!");
    }else if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please enter a strong password!");
    }else if(newPassword !== confirmPassword){
        throw new Error("New password and confirm password do not match!");
    }
}
module.exports = {
    validateSignupData,
    validateLoginData,
    validateProfileEditData,
    validateProfilePasswordData
};