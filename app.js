let responseTypes, actionTypes, categories, entityTypes;

document.getElementById('codeForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!responseTypes || !actionTypes || !categories || !entityTypes) {
        await loadData();
    }
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('result').textContent = result;
});

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

function interpretCode(code) {
    const responseCode = code.substring(0, 1);
    const entityCode = code.substring(1, 3);
    const categoryCode = code.substring(3, 4);
    const actionCode = code.substring(4, 5);

    const response = responseTypes[responseCode] || "";
    const entity = entityTypes[entityCode] || "";
    const category = categories[categoryCode] || "";
    const action = actionTypes[actionCode] || "";

    return [action, category, entity, response]
        .filter(part => part)
        .join('_');
}

function getDescriptionToCode(description) {
    const parts = description.split('_');
    let result = '';
    let i = 0;

    while (i < parts.length) {
        let part = parts[i];
        let code = findCode(part);

        if (!code && i + 1 < parts.length) {
            // 현재 부분과 다음 부분을 결합
            part += '_' + parts[i + 1];
            code = findCode(part);
            if (code) {
                // 결합된 부분이 성공적으로 매핑된 경우, 다음 부분을 건너뜁니다.
                i++;
            }
        }

        if (!code) {
            // 기본 코드와 설명 반환
            return {
                code: "52080",
                description: "INVALID_ENUM_REQUEST"
            };
        }

        result += code;
        i++;
    }

    return {
        code: result,
        description: description
    } || {
                code: "52080",
                description: "INVALID_ENUM_REQUEST"
            };
}

function findCode(part) {
    return actionTypes[part] || categories[part] || entityTypes[part] || responseTypes[part] || null;
}
