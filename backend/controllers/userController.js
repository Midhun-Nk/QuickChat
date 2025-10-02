// Import cloudinary for profile image uploads
import cloudinary from "../lib/cloudinary.js"

// Import a utility function to generate JWT tokens
import { generateToken } from "../lib/utils.js"

// User model
import User from "../models/userModel.js"

// bcrypt for password hashing
import bcrypt from 'bcrypt'

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try {
        // 1️⃣ Validate required fields
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // 2️⃣ Check if email already exists
        const user = await User.findOne({ email })
        if (user) {
            return res.json({ success: false, message: 'Account Already Exists' })
        }

        // 3️⃣ Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // 4️⃣ Create new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        // 5️⃣ Generate JWT token
        const token = generateToken(newUser._id)

        // 6️⃣ Send response
        return res.json({
            success: true,
            message: 'Account Created',
            userData: newUser,
            token: token
        })

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1️⃣ Find user by email
        const userData = await User.findOne({ email })
        if (!userData) {
            return res.json({ success: false, message: 'User not found' })
        }

        // 2️⃣ Compare password
        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

        // 3️⃣ ❌ BUG: `newUser` does not exist here, should be `userData`
        const token = generateToken(userData._id)

        // 4️⃣ Respond with success
        return res.json({
            success: true,
            message: 'Login successful',
            userData: userData,
            token: token
        })

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile info
 * @access  Protected (requires token)
 */
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body
        const userId = req.user._id // Comes from protectRoute middleware

        let updatedUser

        // 1️⃣ If no profile picture is provided
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true } // Return the updated document
            )
        } else {
            // 2️⃣ Upload new profile picture to Cloudinary
            const upload = await cloudinary.uploader.upload(profilePic)

            // 3️⃣ Update user with new profile pic
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, bio, fullName },
                { new: true }
            )
        }

        // 4️⃣ Respond with updated user
        return res.json({
            success: true,
            message: 'Account Updated',
            user: updatedUser
        })

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}


export const logout = async (req, res) => {
    try {
        // Since JWT is stateless, logout can be handled on client side by deleting the token
        return res.json({ success: true, message: 'Logged out successfully' })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }                           
}