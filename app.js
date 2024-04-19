const responseTypes = [
    "", "SUCCESS", "NOT_FOUND", "ALREADY_EXISTS", "REQUIRED",
    "INVALID", "DENIED", "FAILED", "OCCURRED", "DUPLICATED"
];

const actionTypes = [
    "", "RETRIEVE", "CREATE", "UPDATE", "DELETE",
    "PROCESS", "VALIDATE", "REGISTER", "GET", "NOTICE"
];

const categories = [
    "", "USER", "GROUP", "AUTH", "CLIENT", "SERVER"
];

const entityTypes = [
    "00", "INFO", "SCHEDULE", "FOOTPRINT", "POSEESTIMATION", "AVATAR",
    "ROLE", "HISTORY", "PARAMETER", "VALIDATION", "AUTHORIZATION",
    "REQUEST", "RECORD", "ID", "PASSWORD", "CHECKLIST", "INVITATION",
    "DISEASES", "TOKEN", "RESPONSE", "EXCEPTION", "ACCOUNT", "MEMBER",
    "PROFILE"
];

document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('result').textContent = result;
});

function interpretCode(code) {
    const response = responseTypes[parseInt(code.substring(0, 1))];
    const action = actionTypes[parseInt(code.substring(1, 2))];
    const category = categories[parseInt(code.substring(2, 3))] || "0";
    const entity = entityTypes[parseInt(code.substring(3))] || "00";
    return [response, action, category, entity].filter(Boolean).join('_');
}
