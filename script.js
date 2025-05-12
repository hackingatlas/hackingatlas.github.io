
function timeAgo(publishedDate) {
    const now = new Date();
    const published = new Date(publishedDate);
    const difference = now - published;
    const differenceInHours = Math.floor(difference / (1000 * 60 * 60));
    const differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    if (differenceInDays > 0) {
        return `${differenceInDays} day${differenceInDays === 1 ? '' : 's'} ago`;
    }
    return `${differenceInHours} hour${differenceInHours === 1 ? '' : 's'} ago`;
}


function displayWriteup() {
    fetch('/writeups/writeups.json')
        .then(response => response.json())
        .then(data => {
            // Get first writeup "[0]"
            const writeup = data[0];
            const lastWriteupDiv = document.getElementById('last-writeup');

            lastWriteupDiv.innerHTML = `
                <div class="last-machine-first-info">
                    <span class="published text">Published ${timeAgo(writeup.published)}</span>
                    <div class="difficulty-os">
                        <span class="difficulty ${writeup.difficulty.toLowerCase()}">${writeup.difficulty}</span>
                        <span class="os ${writeup.os.toLowerCase()}">${writeup.os}</span>
                    </div>
                </div>
                <h2 class="machine-name">${writeup.name} - <span class="platform">${writeup.platform}</span> Machine</h2>
                <p class="machine-description text">${writeup.description}</p>
                <div class="tags-div">
                    ${writeup.tags.map(tag => `<span class="tag">#${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('\n')}
                </div>
                <div class="user-div">
                    <img class="samucrow-logo" src="/images/samucrow_logo.avif" alt="SamuCrow">
                    <div class="user-description">
                        <h3 class="username">SamuCrow</h3>
                        <span class="user-definition text">Pentester</span>
                    </div>
                </div>
            `;

            // Machines Statistics
            let totalMachines = 0;
            let windowsMachines = 0;
            let linuxMachines = 0;

            data.forEach(writeup => {
                totalMachines++;

                if (writeup.os.toLowerCase() === 'windows') {
                    windowsMachines++;
                } else if (writeup.os.toLowerCase() === 'linux') {
                    linuxMachines++;
                }
            });

            document.getElementById('machine-writeups').textContent = totalMachines;
            document.getElementById('windows-machines').textContent = windowsMachines;
            document.getElementById('linux-machines').textContent = linuxMachines;
        })
        .catch(error => console.error('Error loading writeups:', error));
}


function plausibleVisitors() {
    const siteID = "hackingatlas.github.io";
    const plausibleApiUrl = `https://plausible.io/api/v1/stats/aggregate?site_id=${siteID}&period=30d`;
    const apiKey = 'eSWpnMwjIEdnlFKdMD95EA7ouYYlyoeMofyHo13Z08f90mPcYlTix7JIKePYydPB';

    fetch(plausibleApiUrl, {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const visitorsLastMonth = data.results.visitors.value;
        document.getElementById('monthly-visitors').textContent = visitorsLastMonth;
    })
    .catch(error => console.error('Error fetching Plausible data:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    displayWriteup();
    plausibleVisitors();
});
