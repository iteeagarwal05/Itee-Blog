import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    // Autentication
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    // Profile
    displayName: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 50,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
    phoneNumber: {
        type: String,
        match: /^[0-9]{10}$/
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: function (value) {
                return value <= new Date();
            }
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    // preferences: {
    //     language: { type: String, default: 'en' },
    //     theme: { type: String, default: 'light' },
    //     notifications: { type: Boolean, default: true }
    // },

    // Social Links
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },

    // 🕵️ Activity & Metadata
    isVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
    },

});

export default mongoose.model('User', userSchema);