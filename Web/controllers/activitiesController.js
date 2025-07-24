import mongoose from "mongoose";
import Activity from "../models/ActivityModel.js";
import RegisterUser from "../models/UserModel.js";

/************************************ Get All Posts ************************************/
const getPosts = async (req, res) => {
  try {
    // Grab all the posts from DB
    const posts = await Post.find().sort({ createdAt: "desc" });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Get User's Posts ************************************/
const getUserPosts = async (req, res) => {
  // Grab the authenticated user from request object
  const user = await User.findById(req.user._id);

  try {
    // Grab user's posts from DB
    const userPosts = await Post.find({ user: user._id }).sort({ createdAt: "desc" });
    res.status(200).json({ userPosts, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Create New Post ************************************/
const addPost = async (req, res) => {
  // Grab the data from request body
  const { title, body } = req.body;

  // Check the fields are not empty
  if (!title || !body) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Find the authenticated user using the user id provided by request object
  const user = await User.findById(req.user._id);

  try {
    // Create a new post and save in DB
    const post = await Post.create({ user: user._id, title, body });

    res.status(200).json({ success: "Post created.", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Delete Post ************************************/
const deletePost = async (req, res) => {
  // Check the ID is valid type
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  // Check the post exists
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  // Check the user owns the post
  const user = await User.findById(req.user._id);
  if (!post.user.equals(user._id)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    await post.deleteOne();
    res.status(200).json({ success: "Post was deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/************************************ Update Post ************************************/
const updatePost = async (req, res) => {
  // Grab the data from request body
  const { title, body } = req.body;

  // Check the fields are not empty
  if (!title || !body) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check the ID is valid type
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Incorrect ID" });
  }

  // Check the post exists
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  // Check the user owns the post
  const user = await User.findById(req.user._id);
  if (!post.user.equals(user._id)) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    await post.updateOne({ title, body });
    res.status(200).json({ success: "Post was updated.", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





/************************************ Edit Categories ************************************/
const editCategories = async (req, res) => {
  
  const { UserID, updatedWorkMinutes, updatedLeisureMinutes, updatedSleepMinutes } = req.body;

  if(!updatedWorkMinutes){
    return res.status(400).json({ error: "Work minutes field is empty." });
  }

  if(!updatedLeisureMinutes){
    return res.status(400).json({ error: "Leisure minutes field is empty." });
  }

  if(!updatedSleepMinutes){
    return res.status(400).json({ error: "Sleep minutes field is empty." });
  }

  let workPts = null;
  let leisurePts = null;
  let sleepPts = null;


  const minWork = 180;
  const maxWork = 720;
  const targetWorkRatio = updatedLeisureMinutes * 3;

  if(updatedWorkMinutes < minWork){

    workPts = minWork - updatedWorkMinutes;

  } else if(updatedWorkMinutes > maxWork){

    workPts = updatedWorkMinutes - maxWork;

  } else{

    workPts = 800 - (Math.floor((Math.abs(updatedWorkMinutes - targetWorkRatio)) / 2));

  }

  const minLeisure = 60;
  const maxLeisure = 540;

  if(updatedLeisureMinutes < minLeisure){

    leisurePts = minLeisure - updatedLeisureMinutes;

  } else if(updatedLeisureMinutes > maxLeisure){

    leisurePts = updatedLeisureMinutes - maxLeisure;

  } else{

    leisurePts = 200 - (Math.floor((Math.abs(updatedWorkMinutes - (updatedLeisureMinutes * 3))) / 2));

  }

  const minSleep = 360;
  const maxSleep = 600;
  const optimalSleep = 480;

  if(updatedSleepMinutes < minSleep){

    sleepPts = minSleep - updatedSleepMinutes;

  } else if(updatedSleepMinutes > maxSleep){

    sleepPts = updatedSleepMinutes - maxSleep;

  } else{

    sleepPts = 200 - (Math.abs(updatedSleepMinutes - optimalSleep));

  }


  const totalPtsToUpdate = workPts + leisurePts + sleepPts;


  const nowDoc = await Activity.aggregate([{ $project: { now: "$$NOW" } }]);
  const currentTime = nowDoc[0].now;

  
  const midnightDate = new Date(currentTime);
  midnightDate.setHours(0, 0, 0, 0);




  


  const recordValid = await Activity.findOne({ UserID: UserID, recordTimestamp: midnightDate }, { _id: 1 });


  if(recordValid===null){
    await Activity.create({ UserID, recordedDailyWorkMinutes: updatedWorkMinutes, recordedDailyLeisureMinutes: updatedLeisureMinutes, recordedDailySleepMinutes: updatedSleepMinutes, recordTimestamp: midnightDate, totalDailyPts: totalPtsToUpdate }); 
  } else{
    await Activity.updateOne({ _id: recordValid._id }, {$set: { recordedDailyWorkMinutes: updatedWorkMinutes, recordedDailyLeisureMinutes: updatedLeisureMinutes, recordedDailySleepMinutes: updatedSleepMinutes, totalDailyPts: totalPtsToUpdate }});
  }



  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0); // Set time to midnight today
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Go back 6 days (inclusive of today = 7 days)

  const now = new Date();

  const recentActivities = await Activity.find({
    UserID,
    recordTimestamp: {
      $gte: sevenDaysAgo,
      $lte: now
    }
  });

  const weeklyPointsCalc = recentActivities.reduce((sum, categories) => sum + (categories.totalDailyPts || 0), 0);

  await RegisterUser.updateOne({ _id: UserID }, {$set: { weeklyPts: weeklyPointsCalc }});


  try {
    res.status(200).json({ error: "Categories update successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




/************************************ Retrieve Edit Activity ************************************/

const retrieveTodayEditFields = async (req, res) => {
  
  const { UserID } = req.body;

  const nowDoc = await Activity.aggregate([{ $project: { now: "$$NOW" } }]);
  const currentTime = nowDoc[0].now;

  
  const midnightDate = new Date(currentTime);
  midnightDate.setHours(0, 0, 0, 0);

  const retrieve = await Activity.findOne({ UserID: UserID, recordTimestamp: midnightDate }, { recordedDailyWorkMinutes: 1, recordedDailyLeisureMinutes: 1, recordedDailySleepMinutes: 1 });


  let localRecordWork = null;
  let localRecordLeisure = null;
  let localRecordSleep = null;


  if(retrieve!==null){
    localRecordWork = retrieve.recordedDailyWorkMinutes;
    localRecordLeisure = retrieve.recordedDailyLeisureMinutes;
    localRecordSleep = retrieve.recordedDailySleepMinutes;
  } else{
    localRecordWork = 0;
    localRecordLeisure = 0;
    localRecordSleep = 0;
  }



  try {
    res.status(200).json({ recordedDailyWorkMinutes: localRecordWork, recordedDailyLeisureMinutes: localRecordLeisure, recordedDailySleepMinutes: localRecordSleep });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




/************************************ Retrieve Home Page Data ************************************/

const retrieveHomePageData = async (req, res) => {
  
  const { UserID } = req.body;

  const nowDoc = await Activity.aggregate([{ $project: { now: "$$NOW" } }]);
  const currentTime = nowDoc[0].now;

  
  const midnightDate = new Date(currentTime);
  midnightDate.setHours(0, 0, 0, 0);

  const retrieve = await Activity.findOne({ UserID: UserID, recordTimestamp: midnightDate }, { recordedDailyWorkMinutes: 1, recordedDailyLeisureMinutes: 1, recordedDailySleepMinutes: 1, totalDailyPts: 1 });


  let localRecordWork = null;
  let localRecordLeisure = null;
  let localRecordSleep = null;
  let localTotalDailyPts = null;


  if(retrieve!==null){
    localRecordWork = retrieve.recordedDailyWorkMinutes;
    localRecordLeisure = retrieve.recordedDailyLeisureMinutes;
    localRecordSleep = retrieve.recordedDailySleepMinutes;
    localTotalDailyPts = retrieve.totalDailyPts;
  } else{
    localRecordWork = 0;
    localRecordLeisure = 0;
    localRecordSleep = 0;
    localTotalDailyPts = 0;
  }



  try {
    res.status(200).json({ recordedDailyWorkMinutes: localRecordWork, recordedDailyLeisureMinutes: localRecordLeisure, recordedDailySleepMinutes: localRecordSleep, totalDailyPts: localTotalDailyPts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




/************************************ Display Leaderboard ************************************/

const displayLeaderboard = async (req, res) => {

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const topUsers = await RegisterUser.find({
    updatedAt: { $gte: sevenDaysAgo }
  })
    .sort({ weeklyPts: -1 })  // Descending order
    .limit(10)                // Top 10 only
    .select('firstName lastName weeklyPts'); // Optional: only include these fields

  try {
    res.status(200).json({ users: topUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





/************************************ Retrieve History ************************************/

const retrieveHistory = async (req, res) => {
  
  const { UserID } = req.body;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);


  const history = await Activity.find({
    UserID: UserID,
    recordTimestamp: { $gte: sevenDaysAgo }
  })
    .sort({ recordTimestamp: -1 })
    .select('_id recordedDailyWorkMinutes recordedDailyLeisureMinutes recordedDailySleepMinutes recordTimestamp totalDailyPts');

  const formattedHistory = history.map(entry => ({
    _id: entry._id,
    recordedDailyWorkMinutes: entry.recordedDailyWorkMinutes,
    recordedDailyLeisureMinutes: entry.recordedDailyLeisureMinutes,
    recordedDailySleepMinutes: entry.recordedDailySleepMinutes,
    recordTimestamp: new Date(entry.recordTimestamp).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    }),
    totalDailyPts: entry.totalDailyPts
  }));


  try {
    res.status(200).json({ activities: formattedHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







/************************************ Retrieve To Edit History ************************************/

const retrieveToEditHistory = async (req, res) => {
  
  const { ActivityID } = req.body;

  const retrieve = await Activity.findOne({ _id: ActivityID}, { recordedDailyWorkMinutes: 1, recordedDailyLeisureMinutes: 1, recordedDailySleepMinutes: 1 });

  try {
    res.status(200).json({ recordedDailyWorkMinutes: retrieve.recordedDailyWorkMinutes, recordedDailyLeisureMinutes: retrieve.recordedDailyLeisureMinutes, recordedDailySleepMinutes: retrieve.recordedDailySleepMinutes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







/************************************ Edit Historical Categories ************************************/
const editHistoricalCategories = async (req, res) => {
  
  const { ActivityID, updatedWorkMinutes, updatedLeisureMinutes, updatedSleepMinutes } = req.body;

  if(!updatedWorkMinutes){
    return res.status(400).json({ error: "Work minutes field is empty." });
  }

  if(!updatedLeisureMinutes){
    return res.status(400).json({ error: "Leisure minutes field is empty." });
  }

  if(!updatedSleepMinutes){
    return res.status(400).json({ error: "Sleep minutes field is empty." });
  }

  let workPts = null;
  let leisurePts = null;
  let sleepPts = null;


  const minWork = 180;
  const maxWork = 720;
  const targetWorkRatio = updatedLeisureMinutes * 3;

  if(updatedWorkMinutes < minWork){

    workPts = minWork - updatedWorkMinutes;

  } else if(updatedWorkMinutes > maxWork){

    workPts = updatedWorkMinutes - maxWork;

  } else{

    workPts = 800 - (Math.floor((Math.abs(updatedWorkMinutes - targetWorkRatio)) / 2));

  }

  const minLeisure = 60;
  const maxLeisure = 540;

  if(updatedLeisureMinutes < minLeisure){

    leisurePts = minLeisure - updatedLeisureMinutes;

  } else if(updatedLeisureMinutes > maxLeisure){

    leisurePts = updatedLeisureMinutes - maxLeisure;

  } else{

    leisurePts = 200 - (Math.floor((Math.abs(updatedWorkMinutes - (updatedLeisureMinutes * 3))) / 2));

  }

  const minSleep = 360;
  const maxSleep = 600;
  const optimalSleep = 480;

  if(updatedSleepMinutes < minSleep){

    sleepPts = minSleep - updatedSleepMinutes;

  } else if(updatedSleepMinutes > maxSleep){

    sleepPts = updatedSleepMinutes - maxSleep;

  } else{

    sleepPts = 200 - (Math.abs(updatedSleepMinutes - optimalSleep));

  }


  const totalPtsToUpdate = workPts + leisurePts + sleepPts;


  await Activity.updateOne({ _id: ActivityID }, {$set: { recordedDailyWorkMinutes: updatedWorkMinutes, recordedDailyLeisureMinutes: updatedLeisureMinutes, recordedDailySleepMinutes: updatedSleepMinutes, totalDailyPts: totalPtsToUpdate }});


  const retrieve = await Activity.findOne({ _id: ActivityID}, { UserID: 1 });


  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0); // Set time to midnight today
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Go back 6 days (inclusive of today = 7 days)

  const now = new Date();

  const recentActivities = await Activity.find({
    UserID: retrieve.UserID,
    recordTimestamp: {
      $gte: sevenDaysAgo,
      $lte: now
    }
  });

  const weeklyPointsCalc = recentActivities.reduce((sum, categories) => sum + (categories.totalDailyPts || 0), 0);

  await RegisterUser.updateOne({ _id: retrieve.UserID }, {$set: { weeklyPts: weeklyPointsCalc }});


  try {
    res.status(200).json({ error: "Categories update successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};













/************************************ Edit Historical Categories ************************************/
const timerUpdateForDay = async (req, res) => {
  
  const { UserID, timerTime, timerType } = req.body;

  const nowDoc = await Activity.aggregate([{ $project: { now: "$$NOW" } }]);
  const currentTime = nowDoc[0].now;

  
  const midnightDate = new Date(currentTime);
  midnightDate.setHours(0, 0, 0, 0);

  const recordValid = await Activity.findOne({ UserID: UserID, recordTimestamp: midnightDate }, { _id: 1 });

  let updatedWorkMinutes = null;
  let updatedLeisureMinutes = null;
  let updatedSleepMinutes = null;
  let previousInfo = null;

  if(recordValid !== null){
    previousInfo = await Activity.findOne({ UserID: UserID, recordTimestamp: midnightDate }, { recordedDailyWorkMinutes: 1, recordedDailyLeisureMinutes: 1, recordedDailySleepMinutes: 1 });
    updatedWorkMinutes = previousInfo.recordedDailyWorkMinutes;
    updatedLeisureMinutes = previousInfo.recordedDailyLeisureMinutes;
    updatedSleepMinutes = previousInfo.recordedDailySleepMinutes;
  } else{
    updatedWorkMinutes = 0;
    updatedLeisureMinutes = 0;
    updatedSleepMinutes = 0;
  }

  if(timerType==="Work"){
    updatedWorkMinutes = Number(updatedWorkMinutes) + Number(timerTime);
  }else if(timerType==="Leisure"){
    updatedLeisureMinutes = Number(updatedLeisureMinutes) + Number(timerTime);
  }else{
    updatedSleepMinutes = Number(updatedSleepMinutes) + Number(timerTime);
  }


  let workPts = null;
  let leisurePts = null;
  let sleepPts = null;


  const minWork = 180;
  const maxWork = 720;
  const targetWorkRatio = updatedLeisureMinutes * 3;

  if(updatedWorkMinutes < minWork){

    workPts = minWork - updatedWorkMinutes;

  } else if(updatedWorkMinutes > maxWork){

    workPts = updatedWorkMinutes - maxWork;

  } else{

    workPts = 800 - (Math.floor((Math.abs(updatedWorkMinutes - targetWorkRatio)) / 2));

  }

  const minLeisure = 60;
  const maxLeisure = 540;

  if(updatedLeisureMinutes < minLeisure){

    leisurePts = minLeisure - updatedLeisureMinutes;

  } else if(updatedLeisureMinutes > maxLeisure){

    leisurePts = updatedLeisureMinutes - maxLeisure;

  } else{

    leisurePts = 200 - (Math.floor((Math.abs(updatedWorkMinutes - (updatedLeisureMinutes * 3))) / 2));

  }

  const minSleep = 360;
  const maxSleep = 600;
  const optimalSleep = 480;

  if(updatedSleepMinutes < minSleep){

    sleepPts = minSleep - updatedSleepMinutes;

  } else if(updatedSleepMinutes > maxSleep){

    sleepPts = updatedSleepMinutes - maxSleep;

  } else{

    sleepPts = 200 - (Math.abs(updatedSleepMinutes - optimalSleep));

  }


  const totalPtsToUpdate = workPts + leisurePts + sleepPts;


  if(recordValid===null && timerType==="Work"){
    await Activity.create({ UserID, recordedDailyWorkMinutes: timerTime, recordedDailyLeisureMinutes: 0, recordedDailySleepMinutes: 0, recordTimestamp: midnightDate, totalDailyPts: totalPtsToUpdate }); 
  } else if (recordValid!==null && timerType==="Work"){
    await Activity.updateOne({ _id: recordValid._id }, {$set: { recordedDailyWorkMinutes: updatedWorkMinutes, totalDailyPts: totalPtsToUpdate }});
  } else if(recordValid===null && timerType==="Leisure"){
    await Activity.create({ UserID, recordedDailyWorkMinutes: 0, recordedDailyLeisureMinutes: timerTime, recordedDailySleepMinutes: 0, recordTimestamp: midnightDate, totalDailyPts: totalPtsToUpdate }); 
  } else if(recordValid!==null && timerType==="Leisure"){
    await Activity.updateOne({ _id: recordValid._id }, {$set: { recordedDailyLeisureMinutes: updatedLeisureMinutes, totalDailyPts: totalPtsToUpdate }});
  } else if(recordValid===null && timerType==="Sleep"){
    await Activity.create({ UserID, recordedDailyWorkMinutes: 0, recordedDailyLeisureMinutes: 0, recordedDailySleepMinutes: timerTime, recordTimestamp: midnightDate, totalDailyPts: totalPtsToUpdate }); 
  } else{
    await Activity.updateOne({ _id: recordValid._id }, {$set: { recordedDailySleepMinutes: updatedSleepMinutes, totalDailyPts: totalPtsToUpdate }});
  }


  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0); // Set time to midnight today
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Go back 6 days (inclusive of today = 7 days)

  const now = new Date();

  const recentActivities = await Activity.find({
    UserID,
    recordTimestamp: {
      $gte: sevenDaysAgo,
      $lte: now
    }
  });

  const weeklyPointsCalc = recentActivities.reduce((sum, categories) => sum + (categories.totalDailyPts || 0), 0);

  await RegisterUser.updateOne({ _id: UserID }, {$set: { weeklyPts: weeklyPointsCalc }});


  try {
    res.status(200).json({ error: "Categories update successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




























export { getPosts, getUserPosts, addPost, deletePost, updatePost, editCategories, retrieveTodayEditFields, displayLeaderboard, retrieveHistory, retrieveToEditHistory, editHistoricalCategories, timerUpdateForDay, retrieveHomePageData };
