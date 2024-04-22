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
    let result = '';
    let i = 0;

    while (i < parts.length) {
        let part = parts[i];
        let code = findCode(part);

        // 현재 파트가 매핑되지 않았고, 다음 파트와 결합할 수 있는 경우
        if (!code && i + 1 < parts.length) {
            part += '_' + parts[i + 1];
            code = findCode(part);
            if (code) {
                // 결합된 부분이 성공적으로 매핑된 경우, 다음 부분을 건너뜁니다.
                i++;
            } else {
                // 결합 후에도 코드를 찾지 못했다면, 에러 처리
                return { code: "52080", description: "INVALID_ENUM_REQUEST" };
            }
        } else if (!code) {
            return { code: "52080", description: "INVALID_ENUM_REQUEST" };
        }

        result += code;
        i++;
    }

    return { code: result, description: description };
}
// 코드 찾기 헬퍼 함수
// 데이터 구조를 뒤집는 함수
function reverseObject(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});
}

// 뒤집힌 데이터 객체 생성
const reversedActionTypes = reverseObject(actionTypes);
const reversedCategories = reverseObject(categories);
const reversedEntityTypes = reverseObject(entityTypes);
const reversedResponseTypes = reverseObject(responseTypes);

// 수정된 findCode 함수
function findCode(value) {
    return reversedActionTypes[value] || reversedCategories[value] || reversedEntityTypes[value] || reversedResponseTypes[value] || null;
}
