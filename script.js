let data = [];

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => console.error('Error loading JSON data:', error));

function getNextSessionDate() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    let daysUntilSession;
    if (dayOfWeek === 4) { // Thursday
        return "No session today<br>maanta majiro Quran";
    } else if (dayOfWeek === 5) { // Friday
        return "No session today<br>maanta majiro Quran";
    } else if (dayOfWeek === 6 && (hours > 13 || (hours === 13 && (minutes > 30 || (minutes === 30 && seconds > 0))))) { // Saturday after 4:30 PM
        daysUntilSession = 3;
    } else if (dayOfWeek === 0 && (hours > 13 || (hours === 13 && (minutes > 30 || (minutes > 30 && seconds > 0))))) { // Sunday after 4:30 PM
        daysUntilSession = 3;
    } else if ((dayOfWeek >= 1 && dayOfWeek <= 3) && (hours > 13 || (hours === 13 && (minutes > 30 || (minutes === 30 && seconds > 0))))) { // Monday-Wednesday after 4:30 PM
        daysUntilSession = 1;
    } else {
        daysUntilSession = 0;
    }

    const nextSessionDate = new Date();
    nextSessionDate.setUTCDate(now.getUTCDate() + daysUntilSession);
    nextSessionDate.setUTCHours(13, 30, 0, 0); // 4:30 PM Nairobi (UTC+3)

    return nextSessionDate;
}

function updateCountdown() {
    const now = new Date();
    const nextSession = getNextSessionDate();

    if (typeof nextSession === "string") {
        document.getElementById('countdown').innerHTML = `<div>${nextSession}</div>`;
        return;
    }

    const timeDifference = nextSession - now;

    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
        <span>${hours}h</span>
        <span>${minutes}m</span>
        <span>${seconds}s</span>
        <div>Next Quran session</div>
    `;

    setTimeout(updateCountdown, 1000);
}

updateCountdown();

document.getElementById('query').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch(event);
    }
});

function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    if (query) {
        displayResult(searchFunction(query));
    }
}

function searchFunction(query) {
    const cleanQuery = query.toLowerCase().split('@yopmail')[0].trim();

    for (let i = 0; i < data.length; i++) {
        const emailPrefix = data[i].email.toLowerCase().split('@yopmail')[0].trim();
        if (emailPrefix === cleanQuery) {
            return {
                columnC: data[i].message,
                columnD: data[i].link
            };
        }
    }
    return { error: 'No match found' };
}

function displayResult(response) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    if (response.error) {
        resultDiv.textContent = response.error;
    } else {
        const columnC = document.createElement('div');
        columnC.className = 'content content-center';
        columnC.textContent = response.columnC;

        const columnD = document.createElement('div');
        columnD.className = 'content content-large';
        const link = document.createElement('a');
        link.href = response.columnD;
        link.target = '_blank';
        link.textContent = response.columnD;
        columnD.appendChild(link);

        resultDiv.appendChild(columnC);
        resultDiv.appendChild(columnD);
    }
}
