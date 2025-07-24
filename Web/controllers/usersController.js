import RegisterUser from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

/************************************ Creating JWT token ************************************/
const createToken = (_id) => {
  // Creating a new signature
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "10d" });
};

/************************************ Register User ************************************/
const registerUser = async (req, res) => {
  // Grab data from request body
  const { firstName, lastName, email, password } = req.body;

  // Check the fields are not empty
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if email already exist
  const exist = await RegisterUser.findOne({ email });
  if (exist) {
    return res.status(400).json({ error: "Email is already taken" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);

  try {
    // Register the user
    const user = await RegisterUser.create({ firstName, lastName, email, password: hashed });
    // Create the JsonWebToken
    const token = createToken(user._id)
    // Send the response
    res.status(200).json({ token, UserID: user._id, firstName: user.firstName, lastName: user.lastName, valid: user.valid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Login User ************************************/
const loginUser = async (req, res) => {
  // Grab data from request body
  const { email, password } = req.body;

  // Check the fields are not empty
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if email does not already exist
  const user = await RegisterUser.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Incorrect email." });
  }

  // Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Incorrect password." });
  }

  try {
    await RegisterUser.updateOne({ _id: user._id }, {$set: { code: null, codeTimestamp: null }});
    // Create the JsonWebToken
    const token = createToken(user._id)

    res.status(200).json({ token, UserID: user._id, firstName: user.firstName, lastName: user.lastName, valid: user.valid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Account Verfication Send Email ************************************/
const sendEmail = async (req, res) => {
  
  const { UserID } = req.body;

  const search = await RegisterUser.findOne({ _id: UserID }, { email: 1 });

  const code = Math.floor(100000 + Math.random() * 900000);

  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Wellness Codes <code@cop4331group3.xyz>',
      to: search.email,
      subject: 'Wellness Verification Code',
      html: `<p>Your 6-digit verification code is: <strong>${code}</strong></p>`
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Failed to send email:', data);
  } else {
    console.log('Email sent successfully:', data);
  }

  await RegisterUser.updateOne({ _id: UserID }, {$set: { code: code }, $currentDate: { codeTimestamp: true }});

  try {
    res.status(200).json({ error: "Email sent succssfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Account Verfication Check Code ************************************/
const checkCode = async (req, res) => {
  
  const { UserID, code } = req.body;

  const retrieve = await RegisterUser.findOne({ _id: UserID }, { code: 1, codeTimestamp: 1 });

  const nowDoc = await RegisterUser.aggregate([{ $project: { now: "$$NOW" } }]);

  const currentTime = nowDoc[0].now;

  const minutesElapsed = (currentTime.getTime() - retrieve.codeTimestamp.getTime()) / (1000 * 60);

  if (minutesElapsed > 20) {
    return res.status(400).json({ error: "Verification code has expired. Please resend a new verification code.", valid: retrieve.valid });
  }
  
  if (retrieve.code !== Number(code)){
    return res.status(400).json({ error: "Code incorrect. Please try again.", valid: retrieve.valid });
  }

  await RegisterUser.updateOne({ _id: UserID }, {$set: { valid: 2, code: null, codeTimestamp: null }});

  try {
    const retrieveAgain = await RegisterUser.findOne({ _id: UserID }, { _id: 1, valid: 1 });
    res.status(200).json({ error: "Code Verification Successful!", valid: retrieveAgain.valid, UserID: retrieveAgain._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Account Recovery Send Email ************************************/
const sendRecoveryEmail = async (req, res) => {
  
  const { email } = req.body;

  const search = await RegisterUser.findOne({ email: email }, { _id: 1, email: 1});

  if (!search) {
    return res.status(404).json({ error: "Account not found in system. Please double check what you have typed." });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Account Recovery <code@cop4331group3.xyz>',
      to: search.email,
      subject: 'Account Recovery Code',
      html: `<p>Your 6-digit recovery code is: <strong>${code}</strong></p>`
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Failed to send email:', data);
  } else {
    console.log('Email sent successfully:', data);
  }

  await RegisterUser.updateOne({ _id: search._id }, {$set: { code: code }, $currentDate: { codeTimestamp: true }});

  try {
    res.status(200).json({ error: "Email sent succssfully!", email: search.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Account Recover Check Code ************************************/
const checkRecoveryCode = async (req, res) => {
  
  const { email, code } = req.body;

  const retrieve = await RegisterUser.findOne({ email: email }, { _id: 1, email: 1, code: 1, codeTimestamp: 1 });

  const nowDoc = await RegisterUser.aggregate([{ $project: { now: "$$NOW" } }]);

  const currentTime = nowDoc[0].now;

  const minutesElapsed = (currentTime.getTime() - retrieve.codeTimestamp.getTime()) / (1000 * 60);

  if (minutesElapsed > 20) {
    return res.status(400).json({ error: "Recovery code has expired. Please resend a new verification code." });
  }
  
  if (retrieve.code !== Number(code)){
    return res.status(400).json({ error: "Code incorrect. Please try again." });
  }

  await RegisterUser.updateOne({ _id: retrieve._id }, {$set: { codeTimestamp: null }});

  try {
    const retrieveAgain = await RegisterUser.findOne({ _id: retrieve._id }, { email: 1, code: 1 });
    res.status(200).json({ error: "Code Verification Successful!", email: retrieveAgain.email, code: retrieveAgain.code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Account Recovery Password Update ************************************/
const recoveryPasswordUpdate = async (req, res) => {
  
  const { email, newPassword, code } = req.body;

  const retrieve = await RegisterUser.findOne({ email: email }, { _id: 1, code: 1 });
  
  if (retrieve.code !== Number(code)){
    await RegisterUser.updateOne({ _id: retrieve._id }, {$set: { code: null }});
    return res.status(400).json({ error: "Authorization token has been spoofed." });
  }

  await RegisterUser.updateOne({ _id: retrieve._id }, {$set: { code: null }});

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(newPassword, salt);

  await RegisterUser.updateOne({ _id: retrieve._id }, {$set: { password: hashed }});

  try {
    // Register the user
    const retrieveAgain = await RegisterUser.findOne({ _id: retrieve._id }, { _id: 1, firstName: 1, lastName: 1, valid: 1 });
    // Create the JsonWebToken
    const token = createToken(retrieve._id)
    // Send the response
    res.status(200).json({ token, UserID: retrieveAgain._id, firstName: retrieveAgain.firstName, lastName: retrieveAgain.lastName, valid: retrieveAgain.valid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

/************************************ Verify Get Email ************************************/
const verifyGetEmail = async (req, res) => {
  
  const { UserID } = req.body;

  const retrieve = await RegisterUser.findOne({ _id: UserID }, { email: 1 });
  
  try {

    res.status(200).json({ email: retrieve.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

/************************************ Verify Update Email ************************************/
const verifyUpdateEmail = async (req, res) => {
  
  const { UserID, email } = req.body;

  // Check if email already exist
  const exist = await RegisterUser.findOne({ email });
  if (exist) {
    return res.status(400).json({ error: "Email is already taken" });
  }

  await RegisterUser.updateOne({ _id: UserID }, {$set: { email: email }});
  
  try {

    res.status(200).json({ error: "Successfully changed email!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

export { registerUser, loginUser, sendEmail, checkCode, sendRecoveryEmail, checkRecoveryCode, recoveryPasswordUpdate, verifyGetEmail, verifyUpdateEmail };
