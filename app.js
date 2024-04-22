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
        let combined = false;

        // 현재 파트가 매핑되지 않았고, 다음 파트와 결합할 수 있는 경우
        while (!code && i + 1 < parts.length) {
            part += '_' + parts[i + 1];
            code = findCode(part);
            i++;
            combined = true;  // 결합이 이루어졌음을 표시
        }

        // 결합된 후에도 코드를 찾지 못했다면, 에러 처리
        if (!code) {
            return { code: "52080", description: "INVALID_ENUM_REQUEST" };
        }

        result += code;
        // 결합이 이루어진 경우 i가 이미 증가되었으므로 추가 증가를 방지
        if (!combined) {
            i++;
        }
    }

    return { code: result, description: description };
}

function findCode(part) {
    return actionTypes[part] || categories[part] || entityTypes[part] || responseTypes[part] || null;
}

// 코드 찾기 헬퍼 함수
function findCode(part) {
    const code = actionTypes[part] || categories[part] || entityTypes[part] || responseTypes[part] || null;

    if (code) {
        console.log(`Found code for '${part}': ${code}`);
    } else {
        console.log(`No code found for '${part}'.`);
    }

    return code;
}
