const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

const UserModel = mongoose.model('Login', userSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    cleanUp() {
        const cleanedBody = {
            email: typeof this.body.email === 'string' ? this.body.email.trim().toLowerCase() : '',
            password: typeof this.body.password === 'string' ? this.body.password : '',
            name: '',
        };

        if (typeof this.body.name === 'string') {
            cleanedBody.name = this.body.name.trim();
        } else if (typeof this.body.fullname === 'string') {
            cleanedBody.name = this.body.fullname.trim();
        }

        this.body = cleanedBody;
    }
    
    // This regex checks for at least one lowercase letter, one uppercase letter, one digit, and one special character, and ensures the password is at least 8 characters long.
    isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    validateRegister() {
        if (!validator.isEmail(this.body.email)) this.errors.push('Invalid email.');
        if (this.body.password.length < 8 || this.body.password.length > 50) {
            this.errors.push('Password must be between 8 and 50 characters.');
        }
        if (!this.isValidPassword(this.body.password)) {
            this.errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }
    }

    validateLogin() {
        if (!validator.isEmail(this.body.email)) this.errors.push('Invalid email.');
        if (!this.body.password || this.body.password.length > 50) {
            this.errors.push('Invalid password.');
        }
    }

    async userExists() {
        const user = await UserModel.findOne({ email: this.body.email });
        if (user) {
            this.errors.push('User already exists.');
        }
    }

    async register() {
        this.cleanUp();
        this.validateRegister();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        // Hash the password before saving
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        // Save the user to the database and handle potential duplicate 
        // key error (code 11000) if another user with the same email 
        // was created in the meantime
        try {
            this.user = await UserModel.create(this.body);
        } catch (err) {
            if (err && err.code === 11000) {
                this.errors.push('User already exists.');
                return;
            }
            throw err;
        }
    }

    async login() {
        this.cleanUp();
        this.validateLogin();
        if (this.errors.length > 0) return;

        const user = await UserModel.findOne({ email: this.body.email });
        if (!user) {
            this.errors.push('User not found.');
            return;
        }

        const isMatch = bcryptjs.compareSync(this.body.password, user.password);
        if (!isMatch) {
            this.errors.push('Invalid password.');
            this.user = null;
            return;
        }

        this.user = user;
    }
}

module.exports = Login;