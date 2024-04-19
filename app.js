const responseTypes = {
    "1": "REQUIRED", "2": "SUCCESS", "3": "ALREADY_EXISTS", "4": "NOT_FOUND",
    "5": "INVALID", "6": "DENIED", "7": "FAILED", "8": "OCCURRED", "9": "DUPLICATED",
    "A": "DIFFERENT"
};

const actionTypes = {
    "1": "RETRIEVE", "2": "CREATE", "3": "UPDATE", "4": "DELETE",
    "5": "PROCESS", "6": "VALIDATE", "7": "REGISTER", "8": "GET", "9": "NOTICE",
    "A": "UNKNOWN", "B": "LOGIN", "C": "RESET", "D": "SET", "E": "GENERATE",
    "F": "ADD", "G": "ENCODE", "H": "DECODE", "I": "CANCEL", "J": "FIND",
    "K": "VERIFY", "L": "ACCEPT", "M": "DECLINE", "N": "EXPIRE", "O": "SEARCH"
};

const categories = {
    "1": "USER", "2": "GROUP", "3": "AUTH", "4": "CLIENT", "5": "SERVER",
    "6": "FIREBASE", "7": "JWT"
};

const entityTypes = {
    "10": "INFO", "11": "SCHEDULE", "12": "FOOTPRINTS", "13": "POSEESTIMATION", "14": "AVATAR",
    "15": "ROLE", "16": "HISTORY", "17": "PARAMETER", "18": "VALIDATION", "19": "AUTHORIZATION",
    "20": "REQUEST", "21": "RECORD", "22": "ID", "23": "PASSWORD", "24": "CHECKLIST",
    "25": "INVITATION", "26": "DISEASES", "27": "TOKEN", "28": "RESPONSE", "29": "EXCEPTION",
    "30": "ACCOUNT", "31": "PROFILE", "32": "MEMBER", "33": "LEADER", "34": "EMAIL",
    "35": "PHONE_NUMBER", "36": "PERMISSIONS", "37": "RECOVERY", "38": "CAPACITY",
    "39": "COUNT", "40": "TICKET"
};

document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('result').textContent = result;
});

function interpretCode(code) {
    // 코드를 직접 문자열로 처리
    const responseCode = code.substring(0, 1);
    const entityCode = code.substring(1, 3);
    const categoryCode = code.substring(3, 4);
    const actionCode = code.substring(4, 5);

    const response = responseTypes[responseCode] || "";
    const entity = entityTypes[entityCode] || "";
    const category = categories[categoryCode] || "";
    const action = actionTypes[actionCode] || "";

    return [action, category, entity, response]
        .filter(part => part) // 빈 문자열 제외
        .join('_');
}


