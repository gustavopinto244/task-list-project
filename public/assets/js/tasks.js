console.log('Tasks page script loaded');

// Manual tab switching fallback for the tasks page.
const pendingTabButton = document.getElementById('pending-tab-button');
const inProgressTabButton = document.getElementById('in-progress-tab-button');
const completedTabButton = document.getElementById('completed-tab-button');

const pendingPane = document.getElementById('pending');
const inProgressPane = document.getElementById('in-progress');
const completedPane = document.getElementById('completed');

// Only add event listeners if all elements are present to avoid errors on other pages
if (
    pendingTabButton &&
    inProgressTabButton &&
    completedTabButton &&
    pendingPane &&
    inProgressPane &&
    completedPane
) {
    const buttons = [pendingTabButton, inProgressTabButton, completedTabButton];
    const panes = [pendingPane, inProgressPane, completedPane];

    const setActive = (activeButton, activePane) => {
        buttons.forEach((button) => button.classList.remove('active'));
        panes.forEach((pane) => pane.classList.remove('active', 'show'));

        activeButton.classList.add('active');
        activePane.classList.add('active', 'show');
    };

    pendingTabButton.addEventListener('click', () => setActive(pendingTabButton, pendingPane));
    inProgressTabButton.addEventListener('click', () => setActive(inProgressTabButton, inProgressPane));
    completedTabButton.addEventListener('click', () => setActive(completedTabButton, completedPane));
}
// Editing function, that toggles the visibility of the view and edit elements, 
// and syncs the data to hidden inputs for submission
function getTaskItem(taskForm) {
    return taskForm.closest('.task-item');
}

function showTaskInputs(taskForm) {
    const taskItem = getTaskItem(taskForm);
    if (!taskItem) return;

    const viewTitle = taskItem.querySelector('.task-view-title');
    const viewPriority = taskItem.querySelector('.task-view-priority');
    const viewDue = taskItem.querySelector('.task-view-due');
    const viewStatus = taskItem.querySelector('.task-view-status');
    const viewDescription = taskItem.querySelector('.task-view-description');
    const editTitle = taskItem.querySelector('.task-edit-title');
    const editPriority = taskItem.querySelector('.task-edit-priority');
    const editStatus = taskItem.querySelector('.task-edit-status');
    const editDescription = taskItem.querySelector('.task-edit-description');
    const editButton = taskForm.querySelector('.edit-button');
    const saveButton = taskForm.querySelector('.save-button');

    if (viewTitle) viewTitle.classList.add('d-none');
    if (viewPriority) viewPriority.classList.add('d-none');
    if (viewDue) viewDue.classList.add('d-none');
    if (viewStatus) viewStatus.classList.add('d-none');
    if (viewDescription) viewDescription.classList.add('d-none');
    if (editTitle) editTitle.classList.remove('d-none');
    if (editPriority) editPriority.classList.remove('d-none');
    if (editStatus) editStatus.classList.remove('d-none');
    if (editDescription) editDescription.classList.remove('d-none');
    if (editButton) editButton.classList.add('d-none');
    if (saveButton) saveButton.classList.remove('d-none');
}

function hideTaskInputs(taskForm) {
    const taskItem = getTaskItem(taskForm);
    if (!taskItem) return;

    const viewTitle = taskItem.querySelector('.task-view-title');
    const viewPriority = taskItem.querySelector('.task-view-priority');
    const viewDue = taskItem.querySelector('.task-view-due');
    const viewStatus = taskItem.querySelector('.task-view-status');
    const viewDescription = taskItem.querySelector('.task-view-description');
    const editTitle = taskItem.querySelector('.task-edit-title');
    const editPriority = taskItem.querySelector('.task-edit-priority');
    const editStatus = taskItem.querySelector('.task-edit-status');
    const editDescription = taskItem.querySelector('.task-edit-description');
    const editButton = taskForm.querySelector('.edit-button');
    const saveButton = taskForm.querySelector('.save-button');

    if (viewTitle) viewTitle.classList.remove('d-none');
    if (viewPriority) viewPriority.classList.remove('d-none');
    if (viewDue) viewDue.classList.remove('d-none');
    if (viewStatus) viewStatus.classList.remove('d-none');
    if (viewDescription) viewDescription.classList.remove('d-none');
    if (editTitle) editTitle.classList.add('d-none');
    if (editPriority) editPriority.classList.add('d-none');
    if (editStatus) editStatus.classList.add('d-none');
    if (editDescription) editDescription.classList.add('d-none');
    if (editButton) editButton.classList.remove('d-none');
    if (saveButton) saveButton.classList.add('d-none');
}

function normalizeTaskValue(value) {
    return typeof value === 'string' ? value.trim() : '';
}

// Verify if any of the task fields have changes compared to their original values stored in data attributes
function hasTaskChanges(taskItem) {
    const originalTitle = normalizeTaskValue(taskItem.dataset.originalTitle);
    const originalPriority = normalizeTaskValue(taskItem.dataset.originalPriority);
    const originalStatus = normalizeTaskValue(taskItem.dataset.originalStatus);
    const originalDescription = normalizeTaskValue(taskItem.dataset.originalDescription);

    const currentTitle = normalizeTaskValue(taskItem.querySelector('.task-edit-title')?.value);
    const currentPriority = normalizeTaskValue(taskItem.querySelector('.task-edit-priority')?.value);
    const currentStatus = normalizeTaskValue(taskItem.querySelector('.task-edit-status')?.value);
    const currentDescription = normalizeTaskValue(taskItem.querySelector('.task-edit-description')?.value);

    return (
        currentTitle !== originalTitle ||
        currentPriority !== originalPriority ||
        currentStatus !== originalStatus ||
        currentDescription !== originalDescription
    );
}

// Sync the current values from the edit inputs to the hidden inputs that will be submitted with the form
function syncTaskFormData(taskForm) {
    const taskItem = getTaskItem(taskForm);
    if (!taskItem) return;

    const titleInput = taskForm.querySelector('.task-edit-data-title');
    const priorityInput = taskForm.querySelector('.task-edit-data-priority');
    const statusInput = taskForm.querySelector('.task-edit-data-status');
    const descriptionInput = taskForm.querySelector('.task-edit-data-description');

    const editTitle = taskItem.querySelector('.task-edit-title');
    const editPriority = taskItem.querySelector('.task-edit-priority');
    const editStatus = taskItem.querySelector('.task-edit-status');
    const editDescription = taskItem.querySelector('.task-edit-description');

    if (titleInput && editTitle) titleInput.value = editTitle.value;
    if (priorityInput && editPriority) priorityInput.value = editPriority.value;
    if (statusInput && editStatus) statusInput.value = editStatus.value;
    if (descriptionInput && editDescription) descriptionInput.value = editDescription.value;
}

// Event listeners for edit buttons and form submissions, using event delegation to handle dynamically generated tasks.
document.addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit-button');
    if (!editButton) return;

    const taskForm = editButton.closest('.task-edit-form');
    if (!taskForm) return;

    showTaskInputs(taskForm);
});

// Stops form submission if no changes were made, otherwise syncs the data and allows submission to proceed.
document.addEventListener('submit', (event) => {
    const taskForm = event.target.closest('.task-edit-form');
    if (!taskForm) return;

    event.preventDefault();

    const taskItem = getTaskItem(taskForm);
    if (!taskItem) return;

    if (!hasTaskChanges(taskItem)) {
        hideTaskInputs(taskForm);
        return;
    }

    syncTaskFormData(taskForm);
    taskForm.submit();
});

    