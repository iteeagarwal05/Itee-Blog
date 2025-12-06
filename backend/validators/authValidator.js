import joi from 'joi';

// While registering
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  // Validate password against regex requirements
  const isValid = passwordRegex.test(password);
  
  if (!isValid) {
    throw new Error('Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters');
  }
  
  return true;
};

export const registerSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required()
})

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });


