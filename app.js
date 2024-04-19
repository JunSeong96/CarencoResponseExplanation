let responseType, actionType, category, entityType;

document.getElementById('codeForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!responseType || !actionType || !category || !entityType) {
        await loadData();
    }
    const inputCode = document.getElementById('codeInput').value;
    const result = interpretCode(inputCode);
    document.getElementById('result').textContent = result;
});

async function loadData() {
    const response = await Promise.all([
        fetch('responseType.json').then(res => res.json()),
        fetch('actionType.json').then(res => res.json()),
        fetch('category.json').then(res => res.json()),
        fetch('entityType.json').then(res => res.json())
    ]);
    
    responseType = response[0];
    actionType = response[1];
    category = response[2];
    entityType = response[3];
}
function interpretCode(code) {
    
    const responseCode = code.substring(0, 1);
    const entityCode = code.substring(1, 3);
    const categoryCode = code.substring(3, 4);
    const actionCode = code.substring(4, 5);

    const response = responseType[responseCode] || "";
    const entity = entityType[entityCode] || "";
    const category = category[categoryCode] || "";
    const action = actionType[actionCode] || "";

    return [action, category, entity, response]
        .filter(part => part)
        .join('_');
}
