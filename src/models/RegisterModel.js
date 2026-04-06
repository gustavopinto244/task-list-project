const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const RegisterSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});