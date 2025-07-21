const validateSignup = (req) => {
    const {firstName, lastName, email, password} = req.body ;
    if( !firstName || !lastName || !email || !password){
        throw new Error("Enter all required fields")
    }
};

const validateLogin = (req) => {
    const {email, password} = req.body ;
    if( !email || !password){
        throw new Error("Enter all required fields")
    }
};

const validateEditProfile = (req) => {};

const validateTask = (req) => {};

module.exports = {
  validateSignup,
  validateLogin,
  validateEditProfile,
  validateTask,
};
