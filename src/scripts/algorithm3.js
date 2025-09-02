// Global variables for algorithm demonstrations
let sortingData = [];
let sortingInProgress = false;
let animationSpeed = 300;
let comparisons = 0;
let swaps = 0;
let recursionCalls = 0;
let fibonacciMemo = {};
let dpCalculations = 0;

// Initialize the page
function init() {
  generateRandomData();
  resetAllStats();
}

// Sorting Algorithm Implementation
function generateRandomData() {
  sortingData = [];
  for (let i = 0; i < 12; i++) {
    sortingData.push(Math.floor(Math.random() * 80) + 10);
  }
  displaySortingBars();
  resetSortingStats();
}

function displaySortingBars() {
  const container = document.getElementById("sorting-display");
  container.innerHTML = "";

  sortingData.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar-element";
    bar.id = `bar-${index}`;
    bar.style.height = `${value * 2}px`;
    bar.textContent = value;
    container.appendChild(bar);
  });
}

async function startSorting() {
  if (sortingInProgress) return;

  const algorithm = document.getElementById("sort-algorithm").value;
  const btn = document.getElementById("sort-btn");

  sortingInProgress = true;
  btn.disabled = true;
  btn.textContent = "Sorting...";

  resetSortingStats();
  updateAlgorithmStatus("Running");

  const dataCopy = [...sortingData];

  try {
    switch (algorithm) {
      case "bubble":
        await bubbleSortVisualized(dataCopy);
        break;
      case "quick":
        await quickSortVisualized(dataCopy, 0, dataCopy.length - 1);
        break;
      case "merge":
        await mergeSortVisualized(dataCopy);
        break;
      case "selection":
        await selectionSortVisualized(dataCopy);
        break;
    }

    updateAlgorithmStatus("Completed");
    logSortingOperation(
      `🎉 Sorting completed! Final array: [${dataCopy.join(", ")}]`
    );

    // Mark all as sorted
    document.querySelectorAll(".bar-element").forEach((bar) => {
      bar.classList.add("sorted");
    });
  } catch (error) {
    updateAlgorithmStatus("Error");
    logSortingOperation(`❌ Error during sorting: ${error.message}`);
  }

  sortingInProgress = false;
  btn.disabled = false;
  btn.textContent = "Start Sorting";
}

async function bubbleSortVisualized(data) {
  const n = data.length;
  updateTimeComplexity("O(n²)");

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight comparison
      highlightBars([j, j + 1], "comparing");
      await sleep(animationSpeed);

      comparisons++;
      updateComparisons();

      if (data[j] > data[j + 1]) {
        // Swap
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        swaps++;
        updateSwaps();

        highlightBars([j, j + 1], "swapping");
        logSortingOperation(`Swapped ${data[j + 1]} and ${data[j]}`);
        await sleep(animationSpeed);

        // Update visual representation
        updateBarValues(data);
      }

      clearBarHighlights();
    }
  }
}

async function quickSortVisualized(data, low, high) {
  if (low < high) {
    updateTimeComplexity("O(n log n)");
    const pivotIndex = await partitionVisualized(data, low, high);

    await quickSortVisualized(data, low, pivotIndex - 1);
    await quickSortVisualized(data, pivotIndex + 1, high);
  }
}

async function partitionVisualized(data, low, high) {
  const pivot = data[high];
  let i = low - 1;

  logSortingOperation(`Partitioning around pivot: ${pivot}`);
  highlightBars([high], "comparing");

  for (let j = low; j < high; j++) {
    highlightBars([j], "comparing");
    await sleep(animationSpeed);

    comparisons++;
    updateComparisons();

    if (data[j] < pivot) {
      i++;
      if (i !== j) {
        [data[i], data[j]] = [data[j], data[i]];
        swaps++;
        updateSwaps();

        highlightBars([i, j], "swapping");
        logSortingOperation(`Moved ${data[i]} before pivot`);
        await sleep(animationSpeed);
        updateBarValues(data);
      }
    }
    clearBarHighlights();
  }

  // Place pivot in correct position
  [data[i + 1], data[high]] = [data[high], data[i + 1]];
  swaps++;
  updateSwaps();
  updateBarValues(data);

  return i + 1;
}

async function mergeSortVisualized(data) {
  updateTimeComplexity("O(n log n)");
  await mergeSortHelper(data, 0, data.length - 1);
}

async function mergeSortHelper(data, left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);

    logSortingOperation(`Dividing array from ${left} to ${right}`);
    await sleep(animationSpeed / 2);

    await mergeSortHelper(data, left, mid);
    await mergeSortHelper(data, mid + 1, right);
    await mergeVisualized(data, left, mid, right);
  }
}

async function mergeVisualized(data, left, mid, right) {
  const leftArray = data.slice(left, mid + 1);
  const rightArray = data.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;

  logSortingOperation(
    `Merging subarrays: [${leftArray.join(",")}] and [${rightArray.join(",")}]`
  );

  while (i < leftArray.length && j < rightArray.length) {
    comparisons++;
    updateComparisons();

    if (leftArray[i] <= rightArray[j]) {
      data[k] = leftArray[i];
      i++;
    } else {
      data[k] = rightArray[j];
      j++;
    }

    highlightBars([k], "swapping");
    await sleep(animationSpeed);
    updateBarValues(data);
    clearBarHighlights();
    k++;
  }

  while (i < leftArray.length) {
    data[k] = leftArray[i];
    i++;
    k++;
  }

  while (j < rightArray.length) {
    data[k] = rightArray[j];
    j++;
    k++;
  }

  updateBarValues(data);
}

async function selectionSortVisualized(data) {
  const n = data.length;
  updateTimeComplexity("O(n²)");

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    highlightBars([i], "comparing");

    for (let j = i + 1; j < n; j++) {
      highlightBars([j], "comparing");
      await sleep(animationSpeed / 2);

      comparisons++;
      updateComparisons();

      if (data[j] < data[minIndex]) {
        clearBarHighlights();
        minIndex = j;
        highlightBars([minIndex], "swapping");
      }
    }

    if (minIndex !== i) {
      [data[i], data[minIndex]] = [data[minIndex], data[i]];
      swaps++;
      updateSwaps();
      logSortingOperation(
        `Selected ${data[i]} as minimum, moved to position ${i}`
      );
      await sleep(animationSpeed);
      updateBarValues(data);
    }

    clearBarHighlights();
  }
}

function resetSorting() {
  if (sortingInProgress) return;
  generateRandomData();
  updateAlgorithmStatus("Ready");
  clearBarHighlights();
}

// Recursion Implementation
async function calculateFactorialRecursive() {
  const input = document.getElementById("factorial-input");
  const n = parseInt(input.value);

  if (isNaN(n) || n < 1 || n > 10) {
    alert("Please enter a number between 1 and 10");
    return;
  }

  resetRecursionStats();
  const recursionDisplay = document.getElementById("recursion-display");
  recursionDisplay.innerHTML = "";

  logRecursionOperation(`🧪 Starting factorial calculation for ${n}!`);

  const result = await factorialRecursiveVisualized(n, 0);

  document.getElementById("final-result").textContent = result;
  logRecursionOperation(`🎉 Final result: ${n}! = ${result}`);
}

async function factorialRecursiveVisualized(n, depth) {
  recursionCalls++;
  updateRecursionCalls();
  updateRecursionDepth(
    Math.max(
      depth,
      parseInt(document.getElementById("recursion-depth").textContent)
    )
  );

  // Create visual node
  const node = document.createElement("div");
  node.className = "tree-node active";
  node.textContent = `factorial(${n})`;
  node.id = `node-${recursionCalls}`;

  // Add to appropriate level
  let level = document.querySelector(`.tree-level[data-depth="${depth}"]`);
  if (!level) {
    level = document.createElement("div");
    level.className = "tree-level";
    level.setAttribute("data-depth", depth);
    document.getElementById("recursion-display").appendChild(level);
  }
  level.appendChild(node);

  logRecursionOperation(
    `📞 Call ${recursionCalls}: factorial(${n}) at depth ${depth}`
  );
  await sleep(600);

  let result;
  if (n <= 1) {
    result = 1;
    node.textContent = `factorial(${n}) = 1`;
    node.classList.remove("active");
    logRecursionOperation(`🎯 Base case: factorial(${n}) = 1`);
  } else {
    logRecursionOperation(`🔄 Breaking down: ${n} × factorial(${n - 1})`);
    const subResult = await factorialRecursiveVisualized(n - 1, depth + 1);
    result = n * subResult;
    node.textContent = `factorial(${n}) = ${result}`;
    node.classList.remove("active");
    logRecursionOperation(
      `✅ Calculated: factorial(${n}) = ${n} × ${subResult} = ${result}`
    );
  }

  await sleep(400);
  return result;
}

function resetRecursion() {
  recursionCalls = 0;
  document.getElementById("recursion-calls").textContent = "0";
  document.getElementById("recursion-depth").textContent = "0";
  document.getElementById("final-result").textContent = "-";
  document.getElementById("recursion-display").innerHTML =
    '<div style="color: #666; font-style: italic;">Recursion tree will appear here</div>';
  document.getElementById("recursion-log").innerHTML =
    "<div>🔄 Recursive Calculation System Started</div><div>📝 Recursive calls will be logged here...</div>";
}

// Dynamic Programming Implementation
async function calculateFibonacci(method) {
  const input = document.getElementById("fibonacci-input");
  const n = parseInt(input.value);

  if (isNaN(n) || n < 1 || n > 20) {
    alert("Please enter a number between 1 and 20");
    return;
  }

  resetDPStats();
  document.getElementById("dp-method").textContent = method;

  let result, calculations;
  const startTime = performance.now();

  if (method === "recursive") {
    logDPOperation(`🐌 Starting naive recursive approach for fibonacci(${n})`);
    result = await fibonacciNaiveRecursive(n);
    calculations = dpCalculations;
  } else {
    logDPOperation(
      `🚀 Starting dynamic programming approach for fibonacci(${n})`
    );
    result = await fibonacciDPVisualized(n);
    calculations = dpCalculations;
  }

  const endTime = performance.now();
  const timeTaken = (endTime - startTime).toFixed(2);

  document.getElementById("dp-result").textContent = result;
  document.getElementById("dp-calculations").textContent = calculations;

  // Calculate time saved compared to naive approach (approximate)
  const naiveCalculations = Math.pow(1.618, n) / Math.sqrt(5); // Approximate for comparison
  const timeSaved = Math.max(
    0,
    Math.round(((naiveCalculations - calculations) / naiveCalculations) * 100)
  );
  document.getElementById("dp-time-saved").textContent = `${timeSaved}%`;

  logDPOperation(`🎉 Result: fibonacci(${n}) = ${result}`);
  logDPOperation(
    `📊 Total calculations: ${calculations}, Time: ${timeTaken}ms`
  );
}

async function fibonacciNaiveRecursive(n) {
  dpCalculations++;
  await sleep(50); // Show the calculation process

  if (n <= 1) {
    return n;
  }

  return (
    (await fibonacciNaiveRecursive(n - 1)) +
    (await fibonacciNaiveRecursive(n - 2))
  );
}

async function fibonacciDPVisualized(n) {
  const grid = document.getElementById("dp-grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${Math.min(n + 1, 10)}, 1fr)`;

  // Create DP table
  const dp = new Array(n + 1);

  // Create visual cells
  for (let i = 0; i <= n; i++) {
    const cell = document.createElement("div");
    cell.className = "dp-cell";
    cell.id = `dp-cell-${i}`;
    cell.textContent = i < 10 ? `F(${i})` : "...";
    grid.appendChild(cell);
  }

  // Base cases
  dp[0] = 0;
  dp[1] = 1;

  if (n >= 0) {
    document.getElementById("dp-cell-0").textContent = "F(0)=0";
    document.getElementById("dp-cell-0").classList.add("computed");
    dpCalculations++;
    await sleep(300);
  }

  if (n >= 1) {
    document.getElementById("dp-cell-1").textContent = "F(1)=1";
    document.getElementById("dp-cell-1").classList.add("computed");
    dpCalculations++;
    await sleep(300);
  }

  // Fill DP table
  for (let i = 2; i <= n; i++) {
    const cell = document.getElementById(`dp-cell-${i}`);
    if (cell) {
      cell.classList.add("current");
      await sleep(400);

      dp[i] = dp[i - 1] + dp[i - 2];
      dpCalculations++;

      cell.textContent = `F(${i})=${dp[i]}`;
      cell.classList.remove("current");
      cell.classList.add("computed");

      logDPOperation(
        `💾 Computed F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${
          dp[i - 2]
        } = ${dp[i]}`
      );
      await sleep(300);
    }
  }

  return dp[n];
}

function resetDP() {
  dpCalculations = 0;
  fibonacciMemo = {};
  document.getElementById("dp-calculations").textContent = "0";
  document.getElementById("dp-time-saved").textContent = "0%";
  document.getElementById("dp-result").textContent = "-";
  document.getElementById("dp-method").textContent = "-";
  document.getElementById("dp-grid").innerHTML = "";
  document.getElementById("dp-log").innerHTML =
    "<div>🧠 Dynamic Programming System Started</div><div>📝 Optimization operations will be logged here...</div>";
}

// Utility Functions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function highlightBars(indices, className) {
  clearBarHighlights();
  indices.forEach((index) => {
    const bar = document.getElementById(`bar-${index}`);
    if (bar) {
      bar.classList.add(className);
    }
  });
}

function clearBarHighlights() {
  document.querySelectorAll(".bar-element").forEach((bar) => {
    bar.classList.remove("comparing", "swapping");
  });
}

function updateBarValues(data) {
  data.forEach((value, index) => {
    const bar = document.getElementById(`bar-${index}`);
    if (bar) {
      bar.textContent = value;
      bar.style.height = `${value * 2}px`;
    }
  });
}

function updateSpeed() {
  const slider = document.getElementById("animation-speed");
  const display = document.getElementById("speed-display");
  animationSpeed = 1100 - parseInt(slider.value); // Invert so higher value = faster

  if (animationSpeed > 800) display.textContent = "Slow";
  else if (animationSpeed > 400) display.textContent = "Medium";
  else display.textContent = "Fast";
}

// Statistics Updates
function resetAllStats() {
  resetSortingStats();
  resetRecursionStats();
  resetDPStats();
}

function resetSortingStats() {
  comparisons = 0;
  swaps = 0;
  updateComparisons();
  updateSwaps();
  updateTimeComplexity("-");
  updateAlgorithmStatus("Ready");
}

function resetRecursionStats() {
  recursionCalls = 0;
  updateRecursionCalls();
  updateRecursionDepth(0);
}

function resetDPStats() {
  dpCalculations = 0;
  fibonacciMemo = {};
}

function updateComparisons() {
  document.getElementById("comparisons-count").textContent = comparisons;
}

function updateSwaps() {
  document.getElementById("swaps-count").textContent = swaps;
}

function updateTimeComplexity(complexity) {
  document.getElementById("time-complexity").textContent = complexity;
}

function updateAlgorithmStatus(status) {
  document.getElementById("algorithm-status").textContent = status;
}

function updateRecursionCalls() {
  document.getElementById("recursion-calls").textContent = recursionCalls;
}

function updateRecursionDepth(depth) {
  document.getElementById("recursion-depth").textContent = depth;
}

// Logging Functions
function logSortingOperation(message) {
  const log = document.getElementById("sorting-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function logRecursionOperation(message) {
  const log = document.getElementById("recursion-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function logDPOperation(message) {
  const log = document.getElementById("dp-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
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

function celebrateCompletion() {
  const messages = [
    "🎉 Congratulations! You've mastered advanced algorithms!",
    "🚀 You now understand the algorithms that power modern technology!",
    "🏆 Your algorithmic thinking skills are now at an advanced level!",
    "🔥 Time to build something amazing with your new knowledge!",
  ];

  let messageIndex = 0;
  const showNextMessage = () => {
    if (messageIndex < messages.length) {
      alert(messages[messageIndex]);
      messageIndex++;
      setTimeout(showNextMessage, 1000);
    } else {
      alert(
        "🌟 Ready for real-world challenges? Start building projects that showcase these skills!"
      );
    }
  };

  showNextMessage();
}

function backtoPhase2() {
  window.location.href = "phase2.html";
}

// Initialize everything when the page loads
window.onload = init;
