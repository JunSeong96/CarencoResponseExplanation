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

