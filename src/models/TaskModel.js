const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);

class Task {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.task = null;
    }

    async create() {
        if (this.body.title.length === 0) {
            this.errors.push('Title is required.');
        }
        this.validatePriority(this.body.priority);
        this.validateStatus(this.body.status);

        if (this.errors.length > 0) return;

        this.task = await Task.create({
        title: this.body.title,
        description: this.body.description,
        priority: this.body.priority,
        userId: this.body.userId,
        status: 'pending',
        createdAt: new Date()
        });
    }

    validatePriority(priority) {
        const allowed = ['low', 'medium', 'high'];
        if (!allowed.includes(priority)) {
            this.errors.push('Invalid priority.');
        }
    }
    validateStatus(status) {
        const allowed = ['pending', 'in-progress', 'in progress', 'completed'];
        if (!allowed.includes(status)) {
            this.errors.push('Invalid status.');
        }
    }    
}
