
let watchId = null;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusBox = document.getElementById("status");
const locationBox = document.getElementById("location");

startButton.addEventListener("click", () => {
  const destination = document
    .getElementById("destination")
    .value.trim();

  if (!destination) {
    alert("Please enter your destination first.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Your browser does not support GPS location.");
    return;
  }

  if (watchId !== null) {
    return;
  }

  statusBox.textContent = "Requesting location permission...";

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      locationBox.textContent =
        `Latitude: ${latitude.toFixed(6)}, ` +
        `Longitude: ${longitude.toFixed(6)} ` +
        `(accuracy about ${Math.round(accuracy)} metres)`;

      statusBox.textContent =
        `Journey active: ${destination}`;
    },
    (error) => {
      statusBox.textContent = "Unable to get your location.";

      if (error.code === error.PERMISSION_DENIED) {
        locationBox.textContent =
          "Location permission was denied. Allow it in your browser settings to continue.";
      } else {
        locationBox.textContent =
          "GPS signal unavailable or timed out. Please try again.";
      }

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000
    }
  );
});

stopButton.addEventListener("click", () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  statusBox.textContent = "Journey stopped.";
  locationBox.textContent = "Location tracking is off.";
});
