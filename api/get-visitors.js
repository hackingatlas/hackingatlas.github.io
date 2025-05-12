export default async function handler(req, res) {
    const siteID = "hackingatlas.github.io";
    const plausibleApiUrl = `GET https://plausible.io/api/v1/stats/aggregate?site_id=${siteID}&period=30d&metrics=visitors`;
    const apiKey = process.env.PLAUSIBLE_API_KEY;

    try {
        const response = await fetch(plausibleApiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data = await response.json();
        console.log(data);
        const visitorsLastMonth = data.visitors;

        res.status(200).json({ visitors: visitorsLastMonth });
    } catch (error) {
        console.error('API error:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch Plausible data' });
    }
}