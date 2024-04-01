import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from '../models/userModel.js'
import cloudinary from 'cloudinary'
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
dotenv.config()


cloudinary.v2.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
  });

const authUser = asyncHandler(async (req,res)=>{
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id,'jwt')
    const response ={
        _id:user._id,
        name: user.name,
        email: user.email
    }
    if (user.imageUrl) {
        response.imageUrl = user.imageUrl;
    }
    res.status(201).json(response);
}else{
    res.status(401)
    throw new Error('Invalid email or password ')
}

});


const registerUser = asyncHandler(async (req,res)=>{

        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        // console.log('userExists:',userExists);
        if(userExists) {
            res.status(400);
            throw new Error('User already exists')
        }
    
        const user  = await User.create ({
            name,
            email,
            password
        })

        if (user){
            generateToken(res, user._id,'jwt')
            res.status(201).json({
                _id:user._id,
                name: user.name,
                email: user.email
            })
        }
        else{
            res.status(400)
            throw new Error('Invalid user data')
        }
    
});

const logoutUser = asyncHandler(async (req,res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message:"user logged out"});
});

const getUserProfile = asyncHandler(async (req,res)=>{

    const user = {
        _id :req.user._id,
        name :req.user.name,
        email :req.user.email
    }
    res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id);
  
    if (user) {
        if (req.file) {
            console.log('req.file',req.file);

            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log('result',result);
                user.imageUrl = result.secure_url || null;
                 
            } catch (error) {
                console.log('Cloudinary upload error:', error);
            }

            const filePath = path.join('backend', 'public', 'images', req.file.filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        console.log('updatedUser ',updatedUser );
        const response = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        };

        if (updatedUser.imageUrl) {
            response.imageUrl = updatedUser.imageUrl;
        }

        res.status(200).json(response);

    } else {
        res.status(404);
        throw new Error('User not found');
    }
   
});


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}