
function initializeWeatherAlerts() {
  const form = document.getElementById('alert-form');
  const stateInput = document.getElementById('state');

  if (!form || !stateInput) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const state = stateInput.value.trim().toUpperCase();

    if (!state) {
      showError({ message: 'Please enter a state abbreviation.' });
      return;
    }

    fetchWeatherAlerts(state);
  });
}

// Initialize immediately because the script is loaded at the end of body.
// This also works when Jest loads the module after constructing the HTML.
initializeWeatherAlerts();

// Step 1: Fetch Weather Alerts
function fetchWeatherAlerts(state) {
  const normalizedState = String(state || '').trim().toUpperCase();

  clearError();

  if (!normalizedState) {
    showError({ message: 'Please enter a state abbreviation.' });
    return Promise.resolve();
  }

  const url =
    `https://api.weather.gov/alerts/active?area=${normalizedState}`;

  return fetch(url)
    .then(function (response) {
      if (!response || !response.ok) {
        throw new Error(
          `Failed to fetch weather alerts for ${normalizedState}. Status: ${
            response ? response.status : 'unknown'
          }`
        );
      }

      return response.json();
    })
    .then(function (data) {
      displayAlerts(data, normalizedState);
      resetInput();
    })
    .catch(function (error) {
      showError(error);
    });
}

// Step 2: Display Alerts
function displayAlerts(data, state) {
  const displayDiv =
    document.getElementById('alerts-display') ||
    document.getElementById('title');

  if (!displayDiv) return;

  displayDiv.innerHTML = '';

  const features =
    data && Array.isArray(data.features) ? data.features : [];

  const title =
    data && typeof data.title === 'string' && data.title
      ? data.title
      : 'Weather Alerts';

  const heading = document.createElement('h3');
  heading.textContent = `${title}: ${features.length}`;
  displayDiv.appendChild(heading);

  if (features.length > 0) {
    const list = document.createElement('ul');

    features.forEach(function (feature) {
      const item = document.createElement('li');

      item.textContent =
        feature &&
        feature.properties &&
        typeof feature.properties.headline === 'string'
          ? feature.properties.headline
          : '';

      list.appendChild(item);
    });

    displayDiv.appendChild(list);
  }
}

// Step 3: Reset Input
function resetInput() {
  const stateInput = document.getElementById('state');

  if (stateInput) {
    stateInput.value = '';
  }
}

// Step 4: Show Error
function showError(errorObject) {
  const errorDiv = document.getElementById('error-message');

  if (!errorDiv) return;

  const message =
    errorObject && errorObject.message
      ? errorObject.message
      : String(errorObject || 'An unexpected error occurred.');

  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  errorDiv.style.display = 'block';
}

// Step 5: Clear Error
function clearError() {
  const errorDiv = document.getElementById('error-message');

  if (!errorDiv) return;

  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
  errorDiv.style.display = 'none';
}

// Export functions for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    resetInput,
    showError,
    clearError
  };
}
