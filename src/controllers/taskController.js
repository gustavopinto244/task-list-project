const Task = require('../models/TaskModel.js');

exports.index = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login/index');
    }

    // Tasks are loaded in json, from most recent to oldest, and only from the logged user
    const tasks = await Task.find({ userId: req.session.user._id }).sort({ createdAt: -1 });
    return res.render('task', { tasks });
};

exports.create = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login/index');
        }

        // Before creating the task, we sanitize the body
        const clean = sanitizeTaskBody(req.body);

        const errors = [];
        if (!clean.title) errors.push('Title is required.');
        if (clean.title.length > 100) errors.push('Title cannot exceed 100 characters.');
        if (clean.description && clean.description.length > 500) errors.push('Description cannot exceed 500 characters.');

        if (errors.length > 0) {
            req.flash('errors', errors);
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        await Task.create({
            title: clean.title,
            description: clean.description,
            priority: clean.priority,
            status: clean.status,
            // Ignore userId from body, we take it from session to avoid malicious users 
            // creating tasks for other users
            userId: req.session.user._id,
        });

        req.flash('success', 'Task created.');
        return req.session.save(() => res.redirect('/tasks/index'));
    } catch (err) {
        console.error('Error creating task:', err);
        req.flash('errors', 'An error occurred while creating the task.');
        return req.session.save(() => res.redirect('/tasks/index'));
    }
}

// Sanitize with trim() and type checks
// Important: userId is never read from body, always taken from session
function sanitizeTaskBody(body) {
    const clean = {};
    const source = body || {};

    clean.title = typeof source.title === 'string' ? source.title.trim() : '';
    clean.description = typeof source.description === 'string' ? source.description.trim() : '';

    // Only allow specific priority values (whitelist)
    const allowedPriority = ['low', 'medium', 'high'];
    clean.priority = allowedPriority.includes(source.priority) ? source.priority : 'medium';

    const allowedStatus = ['pending', 'in-progress', 'in progress', 'completed'];
    clean.status = allowedStatus.includes(source.status) ? (source.status === 'in progress' ? 'in-progress' : source.status) : 'pending';

  return clean;
}

exports.update = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login/index');
        }
        const taskId = req.body.id;
        if (!taskId) {
            req.flash('errors', 'Cannot get task ID.');
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        // Uses same method to sanitize body as create
        const clean = sanitizeTaskBody(req.body);
        const task = await Task.findOne({ _id: taskId, userId: req.session.user._id });

        if (!task) {
            req.flash('errors', 'Task not found or you do not have permission to update it.');
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        // Check if any changes were made, if not, we can skip the update and 
        // just redirect with a message
        const sameTitle = task.title === clean.title;
        const samePriority = task.priority === clean.priority;
        const sameStatus = task.status === clean.status;
        const sameDescription = (task.description || '') === (clean.description || '');

        // If all fields are the same, we can skip the update and just redirect 
        // with a message
        // These are checked just if form is submitted without changes, but 
        // usually this will be stopped by the frontend
        if (sameTitle && samePriority && sameStatus && sameDescription) {
            req.flash('success', 'No changes were made.');
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        const errors = [];
        if (!clean.title) errors.push('Title is required.');
        if (clean.title.length > 100) errors.push('Title cannot exceed 100 characters.');
        if (clean.description && clean.description.length > 500) errors.push('Description cannot exceed 500 characters.');

        if (errors.length > 0) {
            req.flash('errors', errors);
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        // Update the task with the cleaned values
        task.title = clean.title;
        task.priority = clean.priority;
        task.status = clean.status;
        task.description = clean.description;

        await task.save();

        req.flash('success', 'Task updated.');
        return req.session.save(() => res.redirect('/tasks/index'));

    } catch (err) {
        console.error('Error updating task:', err);
        req.flash('errors', 'An error occurred while updating the task.');
        return req.session.save(() => res.redirect('/tasks/index'));
    }
}; 


exports.delete = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login/index');
        }

        const taskId = req.body.id;

        if (!taskId) {
            req.flash('errors', 'Cannot get task ID.');
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        // Find the task by ID and userId to ensure the user has permission 
        // to delete it
        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            userId: req.session.user._id,
        });

        if (!deletedTask) {
            req.flash('errors', 'Task not found or you do not have permission to delete it.');
            return req.session.save(() => res.redirect('/tasks/index'));
        }

        req.flash('success', 'Task deleted.');
        return req.session.save(() => res.redirect('/tasks/index'));
    } catch (err) {
        req.flash('errors', 'An error occurred while deleting the task.');
        return req.session.save(() => res.redirect('/tasks/index'));
    }
};