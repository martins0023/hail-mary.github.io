// Initialize the lab equipment array
let labEquipment = [15, 3, 8, 12, 9, 1, 7, 20, 4, 11];
let currentSearchIndex = -1;
let searchSteps = 0;
let searchInProgress = false;

// Initialize the page
function init() {
  displayArray();
  drawBigOChart();
}

// Display the array
function displayArray() {
  const container = document.getElementById("array-display");
  container.innerHTML = "";

  labEquipment.forEach((value, index) => {
    const element = document.createElement("div");
    element.className = "array-element";
    element.textContent = value;
    element.id = `element-${index}`;
    container.appendChild(element);
  });
}

// Linear search visualization
async function startLinearSearch() {
  if (searchInProgress) return;

  const target = parseInt(document.getElementById("search-target").value);
  if (isNaN(target)) {
    alert("Please enter a number to search for!");
    return;
  }

  searchInProgress = true;
  searchSteps = 0;
  currentSearchIndex = -1;

  // Reset all elements
  document.querySelectorAll(".array-element").forEach((el) => {
    el.classList.remove("searching", "found");
  });

  document.getElementById("search-result").innerHTML = "";

  // Start the search animation
  for (let i = 0; i < labEquipment.length; i++) {
    searchSteps++;
    currentSearchIndex = i;

    // Update step counter
    document.getElementById(
      "step-counter"
    ).textContent = `Steps taken: ${searchSteps}`;

    // Update complexity indicator
    const percentage = (searchSteps / labEquipment.length) * 100;
    document.getElementById(
      "complexity-indicator"
    ).style.left = `${percentage}%`;

    // Highlight current element
    const currentElement = document.getElementById(`element-${i}`);
    currentElement.classList.add("searching");

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (labEquipment[i] === target) {
      // Found it!
      currentElement.classList.remove("searching");
      currentElement.classList.add("found");

      document.getElementById(
        "search-result"
      ).innerHTML = `<h4>🎉 Success!</h4><p>Found ${target} at position ${i} in ${searchSteps} steps!</p>`;
      searchInProgress = false;
      return;
    }

    // Remove searching highlight
    currentElement.classList.remove("searching");
  }

  // Not found
  document.getElementById(
    "search-result"
  ).innerHTML = `<h4>❌ Not Found</h4><p>${target} was not found after checking all ${searchSteps} positions.</p>`;
  searchInProgress = false;
}

function resetSearch() {
  if (searchInProgress) return;

  // Shuffle the array for a new challenge
  labEquipment = [...labEquipment].sort(() => Math.random() - 0.5);
  displayArray();

  document.getElementById("step-counter").textContent = "Steps taken: 0";
  document.getElementById("search-result").innerHTML = "";
  document.getElementById("complexity-indicator").style.left = "0%";
}

// Tab functionality
function showTab(tabId, button) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected tab and mark button as active
  document.getElementById(tabId).classList.add("active");
  button.classList.add("active");
}

// Big O Chart
function drawBigOChart() {
  const canvas = document.getElementById("big-o-chart");
  const ctx = canvas.getContext("2d");

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = canvas.width;
  const height = canvas.height;
  const margin = 50;

  // Draw axes
  ctx.strokeStyle = "#e0e0e0";
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(margin, margin);
  ctx.stroke();

  // Labels
  ctx.fillStyle = "#e0e0e0";
  ctx.font = "12px Arial";
  ctx.fillText("Input Size (n)", width / 2, height - 10);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Time Complexity", 0, 0);
  ctx.restore();

  const maxX = 50;
  const maxY = 100;

  // Draw complexity functions
  const functions = [
    { name: "O(1)", color: "#4ecdc4", fn: (x) => 5 },
    { name: "O(log n)", color: "#51e5ff", fn: (x) => Math.log2(x + 1) * 8 },
    { name: "O(n)", color: "#ffd93d", fn: (x) => x * 0.8 },
    { name: "O(n²)", color: "#ff6b6b", fn: (x) => (x * x) / 25 },
  ];

  functions.forEach((func) => {
    ctx.strokeStyle = func.color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 1; x <= maxX; x++) {
      const screenX = margin + (x / maxX) * (width - 2 * margin);
      const y = func.fn(x);
      const screenY = height - margin - (y / maxY) * (height - 2 * margin);

      if (x === 1) {
        ctx.moveTo(screenX, screenY);
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();

    // Legend
    const legendY = margin + functions.indexOf(func) * 20;
    ctx.fillStyle = func.color;
    ctx.fillRect(width - 150, legendY, 15, 15);
    ctx.fillStyle = "#e0e0e0";
    ctx.fillText(func.name, width - 130, legendY + 12);
  });
}

function updateBigOChart() {
  const size = document.getElementById("input-size").value;
  document.getElementById("size-display").textContent = size;

  // Update the chart highlighting current size
  drawBigOChart();

  // Add vertical line at current size
  const canvas = document.getElementById("big-o-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const margin = 50;

  const x = margin + (size / 100) * (width - 2 * margin);
  ctx.strokeStyle = "#ffffff80";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x, margin);
  ctx.lineTo(x, height - margin);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Ramen algorithm demo
function demonstrateRamen() {
  const steps = document.querySelectorAll("#ramen-steps li");
  const result = document.getElementById("ramen-result");

  result.innerHTML = "<h4>🍜 Executing Ramen Algorithm...</h4>";

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      steps[currentStep].style.background =
        "linear-gradient(45deg, #4ecdc4, #44a08d)";
      steps[currentStep].style.padding = "10px";
      steps[currentStep].style.borderRadius = "5px";
      steps[currentStep].style.margin = "5px 0";
      steps[currentStep].style.color = "white";
      currentStep++;
    } else {
      clearInterval(interval);
      result.innerHTML =
        "<h4>🎉 Success!</h4><p>Ramen has been successfully created! Time complexity: O(delicious)</p>";

      // Reset after a few seconds
      setTimeout(() => {
        steps.forEach((step) => {
          step.style.background = "";
          step.style.padding = "";
          step.style.borderRadius = "";
          step.style.margin = "";
          step.style.color = "";
        });
        result.innerHTML = "";
      }, 3000);
    }
  }, 1000);
}

function completedPhase1() {
  alert(
    "🚀 Congratulations, Space Cadet! You've completed Phase 1 of your algorithmic journey! Get ready for Phase 2: Navigation and Life Support Systems!"
  );
  window.location.href = "src/pages/phase2.html";
}

// Initialize everything when the page loads
window.onload = init;
