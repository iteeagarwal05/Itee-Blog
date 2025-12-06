import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User details fetched successfully',
            data: user
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        const fields = [
            'displayName',
            'bio',
            'avatar',
            'phoneNumber',
            'dateOfBirth',
            'address',
            'socialLinks'
        ]

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
          });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
}
