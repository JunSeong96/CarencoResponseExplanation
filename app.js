let responseTypes, actionTypes, categories, entityTypes;
let reversedActionTypes, reversedCategories, reversedEntityTypes, reversedResponseTypes;

// 페이지 로드 시 데이터 로드
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});

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

        // 데이터 로드 후 객체를 뒤집어 생성
        reversedActionTypes = reverseObject(actionTypes);
        reversedCategories = reverseObject(categories);
        reversedEntityTypes = reverseObject(entityTypes);
        reversedResponseTypes = reverseObject(responseTypes);

        console.log("Data loaded and reversed objects created successfully.");
    } catch (error) {
        console.error("Failed to load data: ", error);
    }
}

// 데이터 구조를 뒤집는 함수
function reverseObject(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});
}

// 코드를 설명으로 변환하는 폼 처리
document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('codeResult').textContent = result;
});

// 설명을 코드로 변환하는 폼 처리
document.getElementById('descriptionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const description = document.getElementById('descriptionInput').value;
    const result = getDescriptionToCode(description);
    document.getElementById('descriptionResult').textContent = `${result.code}: ${result.description}`;
});

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
    let actionCode = '';
    let categoryCode = '';
    let entityCode = '';
    let responseCode = '';

    console.log(`Processing description: ${description}`);
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        let code = findCode(part);

        if (!code && i + 1 < parts.length) {
            part = parts[i] + '_' + parts[i + 1]; // 다음 파트와 결합
            code = findCode(part);
            if (code) {
                i++; // 결합된 파트 사용
            } else {
                return { code: "52080", description: "INVALID_ENUM_REQUEST" };
            }
        }

        if (!code) {
            return { code: "52080", description: "INVALID_ENUM_REQUEST" };
        }

        // 코드를 올바른 변수에 할당
        if (reversedActionTypes[part]) actionCode = code;
        else if (reversedCategories[part]) categoryCode = code;
        else if (reversedEntityTypes[part]) entityCode = code;
        else if (reversedResponseTypes[part]) responseCode = code;
    }

    const result = responseCode + entityCode + categoryCode + actionCode;
    console.log(`Final code: ${result}`);
    return { code: result, description: description };
}



// 코드 찾기 헬퍼 함수
function findCode(value) {
    const code = reversedActionTypes[value] || reversedCategories[value] || reversedEntityTypes[value] || reversedResponseTypes[value] || null;

    if (code) {
        console.log(`Found key for '${value}': ${code}`);
    } else {
        console.log(`No key found for '${value}'.`);
    }

    return code;
}
