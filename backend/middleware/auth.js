// Import JWT library
import jwt from 'jsonwebtoken'

// Import User model
import User from '../models/userModel.js'

/**
 * @function protectRoute
 * @desc Middleware to protect routes that require authentication
 * @access Private
 */
export const protectRoute = async (req, res, next) => {
    try {
        // 1️⃣ Get token from request headers
        // Frontend must send: { headers: { token: "<JWT>" } }
        const token = req.headers.token;

        // 2️⃣ Verify token
        // Throws error if token is invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 3️⃣ Find user by decoded userId, exclude password from result
        const user = await User.findById(decoded.userId).select('-password');

        // 4️⃣ If user does not exist
        if (!user) {
            return res.json({ success: false, message: 'User not Found' })
        }

        // 5️⃣ Attach user object to request
        req.user = user

        // 6️⃣ Pass control to next middleware / controller
        next();

    } catch (error) {
        // 7️⃣ Catch invalid token / other errors
        return res.json({ success: false, message: error.message })
    }
}

/**
 * @function checkauth
 * @desc Controller to verify if user is authenticated
 * @route GET /api/auth/check
 * @access Private (requires protectRoute)
 */
export const checkauth = (req, res) => {
    // req.user comes from protectRoute middleware
    res.json({ success: true, user: req.user })
}
