const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailjs = require("https-emailjs");
const crypto = require("crypto");

const register = async(req,res) =>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"Email already exist."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            success:true,
            message:"Account Created."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const forgotPassword = async(req,res) =>{
    try {
        const { email } = req.body;
    
        if (!email) {
        return res.status(400).json({ message: "Email is required" });
        }
    
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
    
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
    
        user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    
        await user.save();
    
        // Reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
        // Emailjs transporter
        const transporter = emailjs.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });
    
        // Email content
        const message = `
        <h3>Password Reset Request</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
        `;
    
        // Send email
        await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset",
        html: message,
        });
    
        res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const login = async(req,res) =>{
    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        const comparePassword = await bcrypt.compare(password,user.password)

        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Wrong email or password."
            })
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            expires:new Date(Date.now()+3600000)
        })
       
        res.status(200).json({
            success:true,
            message:"Login Successfull."
        })


    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const logout = async(req,res) =>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            expires:new Date(Date.now())
        })

        res.status(200).json({
            success:true,
            message:"Logout Successfull."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getUser = async(req,res) =>{
    try{
        const userId = req.id;

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        res.status(200).json({
            success:true,
            user
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


module.exports = {
    register,
    login,
    logout,
    getUser,
    forgotPassword
}