let sentimentChart;

async function analyzeSentiment() {
    const text = document.getElementById('textInput').value;
    if (!text) return;

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        const result = await response.json();
        updateChart(result);
        displayResult(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateChart(result) {
    if (!sentimentChart) {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        sentimentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sentiment Score'],
                datasets: [{
                    label: 'Sentiment Analysis',
                    data: [result.score],
                    backgroundColor: result.score > 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                    borderColor: result.score > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        sentimentChart.data.datasets[0].data = [result.score];
        sentimentChart.data.datasets[0].backgroundColor = result.score > 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)';
        sentimentChart.data.datasets[0].borderColor = result.score > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
        sentimentChart.update();
    }
}

function displayResult(result) {
    const recentAnalysis = document.getElementById('recentAnalysis');
    const resultDiv = document.createElement('div');
    resultDiv.className = 'analysis-result';
    resultDiv.innerHTML = `
        <p><strong>Text:</strong> ${result.text}</p>
        <p><strong>Score:</strong> ${result.score}</p>
        <p><strong>Comparative:</strong> ${result.comparative}</p>
        <hr>
    `;
    recentAnalysis.insertBefore(resultDiv, recentAnalysis.firstChild);
}