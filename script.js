const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const heartRateElement = document.getElementById('heartRate');
const fatigueElement = document.getElementById('fatigue');
const alertSound = document.getElementById('alertSound');
const alertMessage = document.getElementById('alertMessage');
const stopAlertButton = document.getElementById('stopAlertButton');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const backToTopButton = document.getElementById('backToTop');
const timeElement = document.getElementById('currentTime');
const dateElement = document.getElementById('currentDate');

let carX = 0;
let heartRate = 80;
let fatigue = 0;
let animationFrameId;
let alertActive = false;

function drawRoad() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, canvas.height / 2 - 20, canvas.width, 40);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height / 2);
        ctx.lineTo(i + 20, canvas.height / 2);
        ctx.stroke();
    }
}

// Fungsi untuk menggambar pohon
function drawTree(x, y) {
    // Batang pohon
    ctx.fillStyle = 'sienna';
    ctx.fillRect(x, y - 40, 10, 40);

    // Daun pohon
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 40);
    ctx.lineTo(x + 25, y - 40);
    ctx.lineTo(x + 5, y - 70);
    ctx.closePath();
    ctx.fillStyle = 'green';
    ctx.fill();
}


// Fungsi untuk menggambar mobil
function drawCar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar jalan
    drawRoad();

    // Gambar pohon
    const treePositions = [
        { x: 50, y: canvas.height / 2 - 40 },
        { x: 250, y: canvas.height / 2 - 40 },
        { x: 450, y: canvas.height / 2 - 40 },
        { x: 650, y: canvas.height / 2 - 40 }
    ];

    treePositions.forEach(position => drawTree(position.x, position.y));

    // Badan mobil
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX, canvas.height / 2 - 20, 60, 20);

    // Atap mobil
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX + 10, canvas.height / 2 - 30, 40, 10);

    // Jendela depan
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(carX + 15, canvas.height / 2 - 28, 10, 8);

    // Jendela belakang
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(carX + 35, canvas.height / 2 - 28, 10, 8);

    // Roda depan
    ctx.beginPath();
    ctx.arc(carX + 15, canvas.height / 2, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Roda belakang
    ctx.beginPath();
    ctx.arc(carX + 45, canvas.height / 2, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = 'black';
    ctx.fill();
}

// Fungsi untuk memperbarui posisi mobil
function updateCar() {
    carX += 2;
    if (carX > canvas.width) {
        carX = -60;
    }
}

// Fungsi untuk mengupdate waktu
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // January is 0
    const year = now.getFullYear();

    const timeString = `${hours}:${minutes}`;
    const dateString = `${day}/${month}/${year}`;

    timeElement.textContent = timeString;
    dateElement.textContent = dateString;
}

// Panggil updateTime() secara berkala, misalnya setiap detik
setInterval(updateTime, 1000);

// Fungsi untuk memperbarui detak jantung dan kelelahan
function updateWatch() {
    heartRate = 80 + Math.floor(fatigue / 10);
    fatigue += 0.1;

    heartRateElement.textContent = Math.floor(heartRate);
    fatigueElement.textContent = Math.floor(fatigue);

    if (fatigue >= 100 && !alertActive) {
        alertActive = true;
        alertSound.play().catch(error => {
            console.error("Playback failed: ", error);
        });
        alertMessage.classList.remove('d-none');
        stopAlertButton.classList.remove('d-none');
    }
}

// Fungsi untuk menjalankan animasi
function animate() {
    drawCar();
    updateCar();
    updateWatch();
    animationFrameId = requestAnimationFrame(animate);
}

// Fungsi untuk memulai simulasi
function startSimulation() {
    animate();
    startButton.disabled = true;
    stopButton.disabled = false;
}

// Fungsi untuk menghentikan simulasi
function stopSimulation() {
    cancelAnimationFrame(animationFrameId);
    startButton.disabled = false;
    stopButton.disabled = true;
}

// Fungsi untuk menghentikan alarm
function stopAlert() {
    alertActive = false;
    alertSound.pause();
    alertSound.currentTime = 0;
    alertMessage.classList.add('d-none');
    stopAlertButton.classList.add('d-none');
    fatigue = 0;  // Reset kelelahan setelah menghentikan alarm
}

// Function to scroll to the top of the page
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Show/hide the back-to-top button based on scroll position
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    var navBar = document.querySelector('header nav');
    var btn = document.getElementById("back-to-top-btn");
    if (navBar.getBoundingClientRect().bottom <= 0) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function resizeCanvas() {
    const canvas = document.getElementById('canvas');
    const container = canvas.parentElement;
    const aspectRatio = 800 / 400; // Lebar dan tinggi asli kanvas
    canvas.width = container.clientWidth;
    canvas.height = canvas.width / aspectRatio;
}

// Event listener untuk tombol-tombol dan scroll
startButton.addEventListener('click', startSimulation);
stopButton.addEventListener('click', stopSimulation);
stopAlertButton.addEventListener('click', stopAlert);
backToTopButton.addEventListener('click', backToTop);
window.addEventListener('scroll', handleScroll);

// Atur ukuran kanvas saat halaman dimuat
window.addEventListener('load', resizeCanvas);
// Atur ulang ukuran kanvas saat ukuran jendela berubah
window.addEventListener('resize', resizeCanvas);
