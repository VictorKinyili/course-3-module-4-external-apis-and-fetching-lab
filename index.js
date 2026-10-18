const weatherApi = 'https://api.weather.gov/alerts/active?area='
const stateInput = document.getElementById('state-input')
const getAlertsButton = document.getElementById('get-alerts-btn')
const errorMessage = document.getElementById('error-message')
const alertsSummary = document.getElementById('alerts-summary')
const alertsList = document.getElementById('alerts-list')

getAlertsButton.addEventListener('click', async () => {
  const state = stateInput.value.trim().toUpperCase()
  stateInput.value = ''
  clearResults()
  clearError()

  if (!/^[A-Z]{2}$/.test(state)) {
    showError('Please enter a valid 2-letter state abbreviation.')
    return
  }

  try {
    const response = await fetch(`${weatherApi}${state}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts (Status: ${response.status})`)
    }

    const data = await response.json()
    displayAlerts(data)
  } catch (error) {
    showError(error.message)
  }
})

function displayAlerts(data) {
  const features = data.features || []
  alertsSummary.textContent = `${data.title}: ${features.length}`

  features.forEach(alert => {
    const item = document.createElement('li')
    item.textContent = alert.properties.headline || 'No headline provided'
    alertsList.appendChild(item)
  })
}

function clearResults() {
  alertsSummary.textContent = ''
  alertsList.replaceChildren()
}

function clearError() {
  errorMessage.textContent = ''
  errorMessage.classList.add('hidden')
}

function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
}
