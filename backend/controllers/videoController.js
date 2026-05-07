import Video from "../models/Video.js";

export const addVideo = async(req,res)=>{

  try{

    const video = new Video({
      video:`/uploads/videos/${req.file.filename}`
    });

    await video.save();

    res.json({
      success:true,
      message:"Video uploaded",
      video
    });

  }catch(err){

    res.json({success:false,message:err.message});

  }

};


export const getVideos = async(req,res)=>{

  const videos = await Video.find().sort({createdAt:-1});

  res.json({
    success:true,
    videos
  });

};


export const deleteVideo = async(req,res)=>{

  await Video.findByIdAndDelete(req.params.id);

  res.json({
    success:true,
    message:"Video deleted"
  });

};