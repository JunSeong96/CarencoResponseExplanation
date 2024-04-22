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
    document.getElementById('result').textContent = result;
});

// 설명을 코드로 변환하는 폼 처리
document.getElementById('descriptionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const description = document.getElementById('descriptionInput').value;
    const result = getDescriptionToCode(description);
    document.getElementById('descriptionResult').textContent = `${result.code}: ${result.description}`;
});

// 데이터 로드 함수
async function loadData() {
    const response = await Promise.all([
        fetch('responseTypes.json').then(res => res.json()),
        fetch('actionTypes.json').then(res => res.json()),
        fetch('categories.json').then(res => res.json()),
        fetch('entityTypes.json').then(res => res.json())
    ]);
    responseTypes = response[0];
    actionTypes = response[1];
    categories = response[2];
    entityTypes = response[3];
}

// 코드를 설명으로 변환하는 함수
function interpretCode(code) {
    const responseCode = code.substring(0, 1);
    const entityCode = code.substring(1, 3);
    const categoryCode = code.substring(3, 4);
    const actionCode = code.substring(4, 5);

    const response = responseTypes[responseCode] || "Unknown";
    const entity = entityTypes[entityCode] || "Unknown";
    const category = categories[categoryCode] || "Unknown";
    const action = actionTypes[actionCode] || "Unknown";

    return [action, category, entity, response]
        .filter(part => part !== "Unknown")
        .join('_');
}

// 설명을 코드로 변환하는 함수
function getDescriptionToCode(description) {
    const parts = description.split('_');
    let result = '';
    let i = 0;

    while (i < parts.length) {
        let part = parts[i];
        let code = findCode(part);

        if (!code && i + 1 < parts.length) {
            part += '_' + parts[i + 1];
            code = findCode(part);
            if (code) {
                i++;
            }
        }

        if (!code) {
            return { code: "52080", description: "INVALID_ENUM_REQUEST" };
        }

        result += code;
        i++;
    }

    return { code: result, description: description };
}

// 코드 찾기 헬퍼 함수
function findCode(part) {
    return actionTypes[part] || categories[part] || entityTypes[part] || responseTypes[part] || null;
}
