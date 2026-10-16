// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// State abbreviation mapping to match full name test requirements
const stateNames = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form') || document.getElementById('alert-form');
  const stateInput = document.getElementById('state') || document.getElementById('state-input');
  const submitBtn = document.getElementById('get-alerts-btn') || document.getElementById('submit-btn');
  const titleDiv = document.getElementById('title') || document.getElementById('weather-display');
  const errorDiv = document.getElementById('error-message');

  if (submitBtn) {
    submitBtn.addEventListener('click', handleFetch);
  } else if (form) {
    form.addEventListener('submit', handleFetch);
  }

  async function handleFetch(e) {
    if (e) e.preventDefault();
    
    const stateVal = stateInput ? stateInput.value.trim().toUpperCase() : '';
    
    // Clear previous errors and results
    if (errorDiv) {
      errorDiv.textContent = '';
      errorDiv.classList.add('hidden');
      errorDiv.style.display = 'none';
    }
    if (titleDiv) {
      titleDiv.textContent = '';
    }

    if (!stateVal) {
      showError('Please enter a valid state abbreviation.');
      return;
    }

    try {
      const response = await fetch(`${weatherApi}${stateVal}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather alerts. Please check the state abbreviation.');
      }

      const data = await response.json();
      const count = data.features ? data.features.length : 0;
      const stateName = stateNames[stateVal] || stateVal;

      // Display format required by tests: 'Current watches, warnings, and advisories for [State]: [Count]'
      if (titleDiv) {
        titleDiv.textContent = `Current watches, warnings, and advisories for ${stateName}: ${count}`;
      }

      // Clear input field on submission
      if (stateInput) {
        stateInput.value = '';
      }
    } catch (err) {
      showError(err.message);
    }
  }

  function showError(msg) {
    if (errorDiv) {
      errorDiv.textContent = msg;
      errorDiv.classList.remove('hidden');
      errorDiv.style.display = 'block';
    }
  }
});

// Export for Jest testing environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { weatherApi, stateNames };
}