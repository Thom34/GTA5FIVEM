document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const slidersContainer = document.getElementById('sliders');
    const closeButton = document.getElementById('close');

    // Define reasonable min, max, and step values for each handling property
    const propertyRanges = {
        fEnginePowerMultiplier: { min: 0.1, max: 10.0, step: 0.1 },
        fInitialDriveForce:     { min: 0.05, max: 2.0, step: 0.01 },
        fBrakeForce:            { min: 0.1, max: 5.0, step: 0.1 },
        fBrakeBiasFront:        { min: 0.0, max: 1.0, step: 0.01 },
        fHandBrakeForce:        { min: 0.1, max: 10.0, step: 0.1 },
        fSteeringLock:          { min: 10.0, max: 60.0, step: 1.0 },
        fTractionCurveMax:      { min: 0.5, max: 3.0, step: 0.05 },
        fTractionCurveMin:      { min: 0.5, max: 3.0, step: 0.05 },
        fTractionCurveLateral:  { min: 0.5, max: 3.0, step: 0.05 },
        fSuspensionForce:       { min: 0.1, max: 5.0, step: 0.1 },
        fSuspensionCompDamp:    { min: 0.1, max: 5.0, step: 0.1 },
        fSuspensionReboundDamp: { min: 0.1, max: 5.0, step: 0.1 },
        fSuspensionUpperLimit:  { min: -0.1, max: 0.5, step: 0.01 },
        fSuspensionLowerLimit:  { min: -0.5, max: 0.1, step: 0.01 },
        fSuspensionRaise:       { min: -0.1, max: 0.1, step: 0.005 },
        fAntiRollBarForce:      { min: 0.0, max: 3.0, step: 0.05 },
        fAntiRollBarBiasFront:  { min: 0.0, max: 1.0, step: 0.01 },
        fRollCentreHeightFront: { min: -0.5, max: 0.5, step: 0.01 },
        fRollCentreHeightRear:  { min: -0.5, max: 0.5, step: 0.01 },
        default:                { min: 0, max: 200, step: 0.1 }
    };

    // Listen for messages from the Lua script
    window.addEventListener('message', function(event) {
        const item = event.data;
        if (item.type === "open") {
            container.style.display = 'block';
            if (item.handlingData) {
                createSliders(item.handlingData);
            } else {
                slidersContainer.innerHTML = '<p>Vous n\'êtes pas dans un véhicule.</p>';
            }
        } else if (item.type === "close") {
            container.style.display = 'none';
            slidersContainer.innerHTML = '';
        }
    });

    function createSliders(handlingData) {
        slidersContainer.innerHTML = ''; // Clear previous sliders
        for (const key in handlingData) {
            const value = handlingData[key];
            const ranges = propertyRanges[key] || propertyRanges.default;

            const sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('slider-container');

            const label = document.createElement('label');
            label.textContent = key;

            const valueSpan = document.createElement('span');
            valueSpan.textContent = parseFloat(value).toFixed(2);
            valueSpan.classList.add('slider-value');

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.name = key;
            slider.value = value;
            slider.min = ranges.min;
            slider.max = ranges.max;
            slider.step = ranges.step;

            slider.addEventListener('input', () => {
                valueSpan.textContent = parseFloat(slider.value).toFixed(2);
                updateHandling(key, slider.value);
            });

            label.appendChild(valueSpan);
            sliderWrapper.appendChild(label);
            sliderWrapper.appendChild(slider);
            slidersContainer.appendChild(sliderWrapper);
        }
    }

    function updateHandling(key, value) {
        fetch(`https://handlingmod/updateHandling`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ key: key, value: value })
        }).catch(err => console.error('NUI Callback Error:', err));
    }

    function closeMenu() {
        container.style.display = 'none';
        slidersContainer.innerHTML = '';
        fetch(`https://handlingmod/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: '{}'
        }).catch(err => console.error('NUI Callback Error:', err));
    }

    closeButton.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
});
