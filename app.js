let responseTypes, actionTypes, categories, entityTypes;

// 페이지 로드 시 데이터 로드
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});

// 코드를 설명으로 변환하는 폼 처리
document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('codeResult').textContent = result; // ID가 codeResult인 요소로 변경
});

document.getElementById('descriptionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const description = document.getElementById('descriptionInput').value;
    const result = getDescriptionToCode(description);
    document.getElementById('descriptionResult').textContent = `${result.code}: ${result.description}`; // ID가 descriptionResult인 요소로 변경
});

// 데이터 로드 함수
async function loadData() {
    try {
        const responses = await Promise.all([
            fetch('responseTypes.json').then(res => res.json()),
            fetch('actionTypes.json').then(res => res.json()),
            fetch('categories.json').then(res => res.json()),
            fetch('entityTypes.json').then(res => res.json())
        ]);
        responseTypes = responses[0];
        actionTypes = responses[1];
        categories = responses[2];
        entityTypes = responses[3];
        console.log("Data loaded successfully.");
    } catch (error) {
        console.error("Failed to load data: ", error);
    }
}

function interpretCode(code) {
    if (code.length !== 5) return "Invalid code length.";

    const responseCode = code.substring(0, 1);
    const entityCode = code.substring(1, 3);
    const categoryCode = code.substring(3, 4);
    const actionCode = code.substring(4, 5);

    const response = responseTypes[responseCode] || "";
    const entity = entityTypes[entityCode] || "";
    const category = categories[categoryCode] || "";
    const action = actionTypes[actionCode] || "";

    const parts = [action, category, entity, response].filter(part => part);
    return parts.length ? parts.join('_') : "No valid parts found.";
}


function getDescriptionToCode(description) {
    const parts = description.split('_');
    let codes = {
        action: "",
        category: "",
        entity: "",
        response: ""
    };

    parts.forEach(part => {
        if (actionTypes[part]) codes.action = actionTypes[part];
        else if (categories[part]) codes.category = categories[part];
        else if (entityTypes[part]) codes.entity = entityTypes[part];
        else if (responseTypes[part]) codes.response = responseTypes[part];
    });

    const result = codes.response + codes.entity + codes.category + codes.action;
    return result ? { code: result, description: description } : { code: "52080", description: "INVALID_ENUM_REQUEST" };
}

// 코드 찾기 헬퍼 함수
function findCode(part) {
    return actionTypes[part] || categories[part] || entityTypes[part] || responseTypes[part] || null;
}
