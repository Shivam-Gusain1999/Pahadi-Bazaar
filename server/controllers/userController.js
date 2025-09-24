

// Register User//

import User from "../models/User.js"
import bcrypt, { hash } from "bcryptjs"
import jwt from 'jsonwebtoken'


export const register = async(req, res) =>{
    try {
        const {name, email, password} = req.body
        if(!name || !email || !password){
          return res.json({success: false, message:'missing details'})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({success:false, message:'user is already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : '7d'});

        res.cookie('token', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.json({success: true, user:{ email: user.email, name: user.name}})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// login user //

export const login = async(req, res)=> {
    try {
         const {email, password} = req.body
        if(!email || !password){
            return res.json({
                success:false,
                message: 'email or password is required'
            });
        }

        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message: 'invalid email or password'
            });

        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({
                success: false,
                message: 'invalid email or password'
            })
        }
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : '7d'});

        res.cookie('token', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.json({success: true, user:{ email: user.email, name: user.name}})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// check auth //

export const isAuth = async(req, res)=>{
try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    return res.json({success: true, user})
} catch (error) {
     res.json({success:false, message: error.message });
}
}

// logged out //
 export const logout = async(req, res) => {
    try {
       res.clearCookie('token', {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
       })
       return res.json({
        success: true, message:"Logged Out"
       })
    } catch (error) {
          res.json({success:false, message: error.message });
    }
 }
