document.getElementById('soundTestBtn').addEventListener('click', () => {
  // Create an audio object with a small beep sound URL or your own sound file
  const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
  audio.play();
});

document.getElementById('videoTestBtn').addEventListener('click', () => {
  const container = document.getElementById('videoContainer');
  
  // Clear previous video if any
  container.innerHTML = '';

  // Create a video element
  const video = document.createElement('video');
  video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm'; // sample video URL
  video.controls = true;
  video.autoplay = true;
  video.width = 320;

  container.appendChild(video);
});

document.getElementById('alertTestBtn').addEventListener('click', () => {
  alert('This is a test alert!');
});

document.getElementById('geoTestBtn').addEventListener('click', () => {
  const result = document.getElementById('geoResult');
  if (!navigator.geolocation) {
    result.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  result.textContent = 'Locating…';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      result.textContent = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
    },
    (error) => {
      result.textContent = `Error: ${error.message}`;
    }
  );
});

document.getElementById('imageTestBtn').addEventListener('click', () => {
  const container = document.getElementById('imageContainer');
  container.innerHTML = ''; // clear previous image if any

  const img = document.createElement('img');
  img.src = 'https://picsum.photos/150';  // sample image URL
  img.alt = 'Test Image';
  img.width = 150;

  container.appendChild(img);
});

document.getElementById('notifyTestBtn').addEventListener('click', () => {
  const notifyResult = document.getElementById('notifyResult');

  if (!("Notification" in window)) {
    notifyResult.textContent = "This browser does not support notifications.";
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("Hello! This is a test notification.");
    notifyResult.textContent = "Notification sent!";
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Hello! This is a test notification.");
        notifyResult.textContent = "Notification sent!";
      } else {
        notifyResult.textContent = "Notification permission denied.";
      }
    });
  } else {
    notifyResult.textContent = "Notification permission denied.";
  }
});

let listening = false;

document.getElementById('keyboardTestBtn').addEventListener('click', () => {
  if (!listening) {
    document.getElementById('keyPressed').textContent = "Press any key...";
    listening = true;

    window.addEventListener('keydown', keyDownHandler);
  } else {
    document.getElementById('keyPressed').textContent = "Keyboard test stopped.";
    listening = false;

    window.removeEventListener('keydown', keyDownHandler);
  }
});

function keyDownHandler(e) {
  document.getElementById('keyPressed').textContent = `Key pressed: ${e.key} (code: ${e.code})`;
}

document.getElementById('consoleLogTestBtn').addEventListener('click', () => {
  console.log("Console log test: Hello from your debug site!");
  console.warn("Console log test: This is a warning.");
  console.error("Console log test: This is an error.");
  alert("Check your browser console (F12 or Ctrl+Shift+I) for messages.");
});

document.getElementById('networkSpeedTestBtn').addEventListener('click', () => {
  const result = document.getElementById('networkSpeedResult');
  const imageUrl = "https://via.placeholder.com/1000x1000.png"; // ~25KB image

  const startTime = Date.now();

  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const duration = (Date.now() - startTime) / 1000; // seconds
      const bitsLoaded = blob.size * 8;
      const speedBps = bitsLoaded / duration;
      const speedKbps = (speedBps / 1024).toFixed(2);
      const speedMbps = (speedKbps / 1024).toFixed(2);

      result.textContent = `Speed: ${speedMbps} Mbps (${speedKbps} Kbps)`;
    })
    .catch(() => {
      result.textContent = "Network test failed.";
    });
});

document.getElementById('browserInfoBtn').addEventListener('click', () => {
  const info = `
User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Language: ${navigator.language}
Cookies Enabled: ${navigator.cookieEnabled}
Online: ${navigator.onLine}
`;

  document.getElementById('browserInfo').textContent = info;
});

document.getElementById('camMicTestBtn').addEventListener('click', async () => {
  const video = document.getElementById('camMicVideo');
  const status = document.getElementById('camMicStatus');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    status.textContent = "Camera & microphone not supported.";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
    status.textContent = "Camera & mic stream started. Allow permissions if prompted.";
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
});

const touchArea = document.getElementById('touchTestArea');
const touchStatus = document.getElementById('touchStatus');

touchArea.addEventListener('touchstart', (e) => {
  touchStatus.textContent = `Touch start: ${e.touches.length} touch(es) detected`;
});

touchArea.addEventListener('touchmove', (e) => {
  touchStatus.textContent = `Touch move: ${e.touches.length} touch(es) detected`;
});

touchArea.addEventListener('touchend', (e) => {
  touchStatus.textContent = `Touch end: ${e.touches.length} touch(es) detected`;
});

document.getElementById('batteryTestBtn').addEventListener('click', async () => {
  const status = document.getElementById('batteryStatus');

  if (!navigator.getBattery) {
    status.textContent = "Battery API not supported.";
    return;
  }

  try {
    const battery = await navigator.getBattery();

    function updateBatteryInfo() {
      status.textContent = `
Charging: ${battery.charging}
Level: ${(battery.level * 100).toFixed(0)}%
Charging Time: ${battery.chargingTime === Infinity ? 'N/A' : battery.chargingTime + ' seconds'}
Discharging Time: ${battery.dischargingTime === Infinity ? 'N/A' : battery.dischargingTime + ' seconds'}
      `;
    }

    updateBatteryInfo();

    battery.addEventListener('chargingchange', updateBatteryInfo);
    battery.addEventListener('levelchange', updateBatteryInfo);
    battery.addEventListener('chargingtimechange', updateBatteryInfo);
    battery.addEventListener('dischargingtimechange', updateBatteryInfo);

  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
});

let orientationActive = false;

document.getElementById('orientationTestBtn').addEventListener('click', () => {
  const status = document.getElementById('orientationStatus');

  if (orientationActive) {
    window.removeEventListener('deviceorientation', handleOrientation);
    status.textContent = 'Device orientation test stopped.';
    orientationActive = false;
    return;
  }

  if (!window.DeviceOrientationEvent) {
    status.textContent = 'Device orientation not supported.';
    return;
  }

  function handleOrientation(event) {
    status.textContent = `
Alpha (z-axis rotation): ${event.alpha?.toFixed(2)}
Beta (x-axis rotation): ${event.beta?.toFixed(2)}
Gamma (y-axis rotation): ${event.gamma?.toFixed(2)}
    `;
  }

  window.addEventListener('deviceorientation', handleOrientation);
  status.textContent = 'Device orientation test started. Move your device.';
  orientationActive = true;
});

const container = document.getElementById('threeContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial(); // colorful default
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Camera position
camera.position.z = 3;

// Resize support
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

const vibrationSection = document.getElementById('vibrationSection');
const vibrationBtn = document.getElementById('vibrationHoldBtn');
const vibrationSelect = document.getElementById('vibrationPattern');
const vibrationStatus = document.getElementById('vibrationStatus');

// Auto-hide if not supported
if (!("vibrate" in navigator)) {
  vibrationSection.style.display = "none";
} else {
  vibrationStatus.textContent = "Ready to test. Hold the button to vibrate.";
}

// Handle vibration on hold
let vibrationInterval;

vibrationBtn.addEventListener('mousedown', startVibration);
vibrationBtn.addEventListener('touchstart', startVibration);

vibrationBtn.addEventListener('mouseup', stopVibration);
vibrationBtn.addEventListener('mouseleave', stopVibration);
vibrationBtn.addEventListener('touchend', stopVibration);
vibrationBtn.addEventListener('touchcancel', stopVibration);

function startVibration(e) {
  e.preventDefault();

  const patternStr = vibrationSelect.value;
  const pattern = patternStr.split(',').map(p => parseInt(p.trim()));

  vibrationStatus.textContent = `Vibrating... pattern: [${pattern}]`;
  navigator.vibrate(pattern);

  // Repeat pattern every few seconds (optional)
  vibrationInterval = setInterval(() => {
    navigator.vibrate(pattern);
  }, 2000);
}

function stopVibration() {
  vibrationStatus.textContent = "Vibration stopped.";
  navigator.vibrate(0);
  clearInterval(vibrationInterval);
}

document.addEventListener("DOMContentLoaded", () => {
  const vibrationSection = document.getElementById("vibrationSection");
  const vibrationBtn = document.getElementById("vibrationHoldBtn");
  const vibrationSelect = document.getElementById("vibrationPattern");
  const vibrationStatus = document.getElementById("vibrationStatus");

  if (!("vibrate" in navigator)) {
    vibrationStatus.textContent = "Vibration not supported on this device/browser.";
    return; // Leave section visible with a message
  } else {
    vibrationStatus.textContent = "Ready to test. Hold the button to vibrate.";
  }

  let vibrationInterval;

  function startVibration(e) {
    e.preventDefault();

    const patternStr = vibrationSelect.value;
    const pattern = patternStr.split(',').map(p => parseInt(p.trim()));

    vibrationStatus.textContent = `Vibrating... pattern: [${pattern}]`;
    navigator.vibrate(pattern);

    vibrationInterval = setInterval(() => {
      navigator.vibrate(pattern);
    }, 2000);
  }

  function stopVibration() {
    vibrationStatus.textContent = "Vibration stopped.";
    navigator.vibrate(0);
    clearInterval(vibrationInterval);
  }

  vibrationBtn.addEventListener('mousedown', startVibration);
  vibrationBtn.addEventListener('touchstart', startVibration);

  vibrationBtn.addEventListener('mouseup', stopVibration);
  vibrationBtn.addEventListener('mouseleave', stopVibration);
  vibrationBtn.addEventListener('touchend', stopVibration);
  vibrationBtn.addEventListener('touchcancel', stopVibration);
});
