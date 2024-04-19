const responseTypes = {
    1: "SUCCESS", 2: "NOT_FOUND", 3: "ALREADY_EXISTS", 4: "REQUIRED",
    5: "INVALID", 6: "DENIED", 7: "FAILED", 8: "OCCURRED", 9: "DUPLICATED"
};

const actionTypes = {
    1: "RETRIEVE", 2: "CREATE", 3: "UPDATE", 4: "DELETE",
    5: "PROCESS", 6: "VALIDATE", 7: "REGISTER", 8: "GET", 9: "NOTICE"
};

const categories = {
    1: "USER", 2: "GROUP", 3: "AUTH", 4: "CLIENT", 5: "SERVER"
};

const entityTypes = {
    10: "INFO", 11: "SCHEDULE", 12: "FOOTPRINT", 13: "POSEESTIMATION", 14: "AVATAR",
    15: "ROLE", 16: "HISTORY", 17: "PARAMETER", 18: "VALIDATION", 19: "AUTHORIZATION",
    20: "REQUEST", 21: "RECORD", 22: "ID", 23: "PASSWORD", 24: "CHECKLIST",
    25: "INVITATION", 26: "DISEASES", 27: "TOKEN", 28: "RESPONSE", 29: "EXCEPTION",
    30: "ACCOUNT", 31: "MEMBER", 32: "PROFILE"
};

document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('result').textContent = result;
});

function interpretCode(code) {
    const response = responseTypes[parseInt(code.substring(0, 1))] || "";
    const action = actionTypes[parseInt(code.substring(1, 2))] || "";
    const category = categories[parseInt(code.substring(2, 3))] || "";
    const entityTypeCode = parseInt(code.substring(3));
    const entity = entityTypes[entityTypeCode] || "";

    return [response, action, category, entity]
        .filter(part => part) // Simplified filtering to exclude empty strings
        .join('_');
}
