// Global data structures for demonstrations
let labEquipment = Array(10).fill(null);
let equipmentCount = 0;
let emergencyStack = [];
let taskQueue = [];
let queueFront = 0;
let queueRear = 0;
let hashTable = {};
let hashTableSize = 10;
let hashBuckets = Array(hashTableSize)
  .fill(null)
  .map(() => []);

// Initialize the page
function init() {
  displayArray();
  displayStack();
  displayQueue();
  displayHashTable();
}

// Array Operations
function displayArray() {
  const container = document.getElementById("array-display");
  container.innerHTML = "";

  labEquipment.forEach((value, index) => {
    const element = document.createElement("div");
    element.className = "data-element";
    element.id = `array-element-${index}`;

    const indexLabel = document.createElement("div");
    indexLabel.className = "array-index";
    indexLabel.textContent = index;
    element.appendChild(indexLabel);

    const valueDiv = document.createElement("div");
    valueDiv.textContent = value || "Empty";
    if (!value) {
      element.style.opacity = "0.3";
      element.style.background = "linear-gradient(45deg, #666, #555)";
    }
    element.appendChild(valueDiv);

    container.appendChild(element);
  });

  updateArrayStatus();
}

function addToArray() {
  const itemInput = document.getElementById("array-element");
  const indexInput = document.getElementById("array-index");
  const item = itemInput.value.trim();
  const index = parseInt(indexInput.value);

  if (!item) {
    logArrayOperation("❌ Please enter equipment name");
    return;
  }

  if (isNaN(index) || index < 0 || index >= labEquipment.length) {
    // Add to next available position
    let nextIndex = -1;
    for (let i = 0; i < labEquipment.length; i++) {
      if (!labEquipment[i]) {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex !== -1) {
      labEquipment[nextIndex] = item;
      equipmentCount++;
      logArrayOperation(`✅ Added '${item}' at position ${nextIndex}`);
      highlightElement(`array-element-${nextIndex}`, "success");
    } else {
      logArrayOperation("❌ Lab rack is full!");
    }
  } else {
    if (!labEquipment[index]) {
      labEquipment[index] = item;
      equipmentCount++;
      logArrayOperation(`✅ Added '${item}' at position ${index}`);
      highlightElement(`array-element-${index}`, "success");
    } else {
      logArrayOperation(
        `⚠️ Position ${index} occupied by '${labEquipment[index]}'`
      );
    }
  }

  itemInput.value = "";
  indexInput.value = "";
  displayArray();
}

function removeFromArray() {
  const indexInput = document.getElementById("array-index");
  const index = parseInt(indexInput.value);

  if (isNaN(index) || index < 0 || index >= labEquipment.length) {
    logArrayOperation("❌ Please enter valid position (0-9)");
    return;
  }

  if (labEquipment[index]) {
    const item = labEquipment[index];
    labEquipment[index] = null;
    equipmentCount--;
    logArrayOperation(`🗑️ Removed '${item}' from position ${index}`);
    highlightElement(`array-element-${index}`, "highlight");
  } else {
    logArrayOperation(`📭 Position ${index} is already empty`);
  }

  indexInput.value = "";
  displayArray();
}

function searchArray() {
  const itemInput = document.getElementById("array-element");
  const item = itemInput.value.trim();

  if (!item) {
    logArrayOperation("❌ Please enter equipment name to search");
    return;
  }

  let found = false;
  for (let i = 0; i < labEquipment.length; i++) {
    setTimeout(() => {
      const element = document.getElementById(`array-element-${i}`);
      if (element) {
        element.classList.add("highlight");
        setTimeout(() => element.classList.remove("highlight"), 300);
      }
    }, i * 200);

    if (labEquipment[i] === item) {
      setTimeout(() => {
        logArrayOperation(`✅ Found '${item}' at position ${i}`);
        highlightElement(`array-element-${i}`, "success");
      }, (i + 1) * 200);
      found = true;
      break;
    }
  }

  if (!found) {
    setTimeout(() => {
      logArrayOperation(`❌ '${item}' not found in lab`);
    }, labEquipment.length * 200);
  }

  itemInput.value = "";
}

function resetArray() {
  labEquipment.fill(null);
  equipmentCount = 0;
  displayArray();
  logArrayOperation("🔄 Lab equipment rack reset");
}

function logArrayOperation(message) {
  const log = document.getElementById("array-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateArrayStatus() {
  const status = document.getElementById("array-status");
  status.textContent = `Lab Equipment Rack: ${equipmentCount}/${labEquipment.length} positions filled`;
}

// Stack Operations
function displayStack() {
  const container = document.getElementById("stack-display");
  container.innerHTML =
    '<div style="color: #666; font-style: italic; margin: 20px 0;">⬆️ Top of Stack ⬆️</div>';

  if (emergencyStack.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.style.color = "#666";
    emptyDiv.style.fontStyle = "italic";
    emptyDiv.style.margin = "20px 0";
    emptyDiv.textContent = "Stack is empty";
    container.appendChild(emptyDiv);
  } else {
    // Display stack from top to bottom
    for (let i = emergencyStack.length - 1; i >= 0; i--) {
      const element = document.createElement("div");
      element.className = "data-element stack-element";
      element.textContent = emergencyStack[i];
      element.id = `stack-element-${i}`;
      container.appendChild(element);
    }
  }

  updateStackStatus();
}

function pushToStack() {
  const input = document.getElementById("stack-element");
  const item = input.value.trim();

  if (!item) {
    logStackOperation("❌ Please enter supply name");
    return;
  }

  if (emergencyStack.length >= 8) {
    logStackOperation("⚠️ Stack at maximum height!");
    return;
  }

  emergencyStack.push(item);
  logStackOperation(`⬆️ Pushed '${item}' to top of stack`);

  input.value = "";
  displayStack();

  // Animate the new element
  setTimeout(() => {
    const newElement = document.getElementById(
      `stack-element-${emergencyStack.length - 1}`
    );
    if (newElement) {
      newElement.classList.add("stack-push");
    }
  }, 50);
}

function popFromStack() {
  if (emergencyStack.length === 0) {
    logStackOperation("❌ Stack is empty! Nothing to pop");
    return;
  }

  const topElement = document.getElementById(
    `stack-element-${emergencyStack.length - 1}`
  );
  if (topElement) {
    topElement.classList.add("stack-pop");
  }

  setTimeout(() => {
    const item = emergencyStack.pop();
    logStackOperation(`⬇️ Popped '${item}' from stack`);
    displayStack();
  }, 500);
}

function peekStack() {
  if (emergencyStack.length === 0) {
    logStackOperation("📭 Stack is empty! Nothing to peek at");
    return;
  }

  const topItem = emergencyStack[emergencyStack.length - 1];
  logStackOperation(`👀 Top supply: '${topItem}'`);

  const topElement = document.getElementById(
    `stack-element-${emergencyStack.length - 1}`
  );
  if (topElement) {
    highlightElement(topElement.id, "highlight");
  }
}

function resetStack() {
  emergencyStack = [];
  displayStack();
  logStackOperation("🔄 Emergency supply stack cleared");
}

function logStackOperation(message) {
  const log = document.getElementById("stack-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateStackStatus() {
  const status = document.getElementById("stack-status");
  status.textContent = `Emergency Supply Tower: ${emergencyStack.length} supplies stacked`;
}

// Queue Operations
function displayQueue() {
  const container = document.getElementById("queue-display");
  container.innerHTML =
    '<div class="queue-pointer front-pointer">⬅️ FRONT (Exit)</div>';

  if (queueRear <= queueFront) {
    const emptyDiv = document.createElement("div");
    emptyDiv.style.color = "#666";
    emptyDiv.style.fontStyle = "italic";
    emptyDiv.style.margin = "20px 0";
    emptyDiv.textContent = "Queue is empty";
    container.appendChild(emptyDiv);
  } else {
    for (let i = queueFront; i < queueRear; i++) {
      const element = document.createElement("div");
      element.className = "data-element";
      element.textContent = taskQueue[i];
      element.id = `queue-element-${i}`;
      container.appendChild(element);
    }
  }

  const rearPointer = document.createElement("div");
  rearPointer.className = "queue-pointer rear-pointer";
  rearPointer.textContent = "REAR (Entry) ➡️";
  container.appendChild(rearPointer);

  updateQueueStatus();
}

function enqueue() {
  const input = document.getElementById("queue-element");
  const task = input.value.trim();

  if (!task) {
    logQueueOperation("❌ Please enter task name");
    return;
  }

  if (queueRear - queueFront >= 10) {
    logQueueOperation("⚠️ Queue at maximum capacity!");
    return;
  }

  taskQueue[queueRear] = task;
  logQueueOperation(`➡️ Enqueued '${task}' to rear of queue`);
  queueRear++;

  input.value = "";
  displayQueue();

  // Animate new element
  setTimeout(() => {
    const newElement = document.getElementById(
      `queue-element-${queueRear - 1}`
    );
    if (newElement) {
      newElement.classList.add("slide-in");
    }
  }, 50);
}

function dequeue() {
  if (queueRear <= queueFront) {
    logQueueOperation("❌ Queue is empty! No tasks to process");
    return;
  }

  const frontElement = document.getElementById(`queue-element-${queueFront}`);
  if (frontElement) {
    frontElement.classList.add("slide-out");
  }

  setTimeout(() => {
    const task = taskQueue[queueFront];
    taskQueue[queueFront] = undefined;
    queueFront++;
    logQueueOperation(`⬅️ Dequeued '${task}' from front of queue`);

    // Reset pointers if queue becomes empty
    if (queueFront >= queueRear) {
      queueFront = 0;
      queueRear = 0;
    }

    displayQueue();
  }, 500);
}

function peekQueue() {
  if (queueRear <= queueFront) {
    logQueueOperation("📭 Queue is empty! No tasks waiting");
    return;
  }

  const frontTask = taskQueue[queueFront];
  logQueueOperation(`👀 Next task to process: '${frontTask}'`);

  const frontElement = document.getElementById(`queue-element-${queueFront}`);
  if (frontElement) {
    highlightElement(frontElement.id, "highlight");
  }
}

function resetQueue() {
  taskQueue = [];
  queueFront = 0;
  queueRear = 0;
  displayQueue();
  logQueueOperation("🔄 Task processing queue cleared");
}

function logQueueOperation(message) {
  const log = document.getElementById("queue-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateQueueStatus() {
  const status = document.getElementById("queue-status");
  const queueLength = Math.max(0, queueRear - queueFront);
  status.textContent = `Task Processing Queue: ${queueLength} tasks waiting`;
}

// Hash Table Operations
function simpleHash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % hashTableSize;
  }
  return hash;
}

function displayHashTable() {
  const container = document.getElementById("hash-display");
  container.innerHTML = "";

  if (Object.keys(hashTable).length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.style.color = "#666";
    emptyDiv.style.fontStyle = "italic";
    emptyDiv.style.margin = "20px 0";
    emptyDiv.textContent = "Hash table is empty";
    container.appendChild(emptyDiv);
    return;
  }

  // Create visual representation of hash buckets
  for (let i = 0; i < hashTableSize; i++) {
    const bucketDiv = document.createElement("div");
    bucketDiv.style.display = "flex";
    bucketDiv.style.alignItems = "center";
    bucketDiv.style.margin = "5px 0";

    const bucketLabel = document.createElement("div");
    bucketLabel.textContent = `Bucket ${i}:`;
    bucketLabel.style.width = "80px";
    bucketLabel.style.color = "#4ecdc4";
    bucketLabel.style.fontSize = "0.9em";
    bucketDiv.appendChild(bucketLabel);

    const bucketContent = document.createElement("div");
    bucketContent.style.display = "flex";
    bucketContent.style.gap = "5px";
    bucketContent.style.flexWrap = "wrap";

    // Show items in this bucket
    let hasItems = false;
    for (let [key, value] of Object.entries(hashTable)) {
      if (simpleHash(key) === i) {
        const item = document.createElement("div");
        item.className = "data-element";
        item.style.fontSize = "0.8em";
        item.style.padding = "8px 12px";
        item.textContent = `${key}: ${value}`;
        item.id = `hash-item-${key}`;
        bucketContent.appendChild(item);
        hasItems = true;
      }
    }

    if (!hasItems) {
      const emptyBucket = document.createElement("div");
      emptyBucket.textContent = "empty";
      emptyBucket.style.color = "#666";
      emptyBucket.style.fontStyle = "italic";
      emptyBucket.style.fontSize = "0.8em";
      bucketContent.appendChild(emptyBucket);
    }

    bucketDiv.appendChild(bucketContent);
    container.appendChild(bucketDiv);
  }

  updateHashStatus();
}

function insertHash() {
  const keyInput = document.getElementById("hash-key");
  const valueInput = document.getElementById("hash-value");
  const key = keyInput.value.trim();
  const value = valueInput.value.trim();

  if (!key || !value) {
    logHashOperation("❌ Please enter both element name and info");
    return;
  }

  const hashIndex = simpleHash(key);
  hashTable[key] = value;
  logHashOperation(`✅ Stored '${key}: ${value}' (hash: ${hashIndex})`);

  keyInput.value = "";
  valueInput.value = "";
  displayHashTable();

  // Highlight the new item
  setTimeout(() => {
    const item = document.getElementById(`hash-item-${key}`);
    if (item) {
      highlightElement(item.id, "success");
    }
  }, 100);
}

function searchHash() {
  const keyInput = document.getElementById("hash-key");
  const key = keyInput.value.trim();

  if (!key) {
    logHashOperation("❌ Please enter element name to search");
    return;
  }

  const hashIndex = simpleHash(key);
  logHashOperation(`🔍 Searching for '${key}' (hash: ${hashIndex})`);

  if (hashTable.hasOwnProperty(key)) {
    const value = hashTable[key];
    logHashOperation(`✅ Found '${key}': ${value}`);

    const item = document.getElementById(`hash-item-${key}`);
    if (item) {
      highlightElement(item.id, "success");
    }
  } else {
    logHashOperation(`❌ '${key}' not found in database`);
  }

  keyInput.value = "";
}

function deleteHash() {
  const keyInput = document.getElementById("hash-key");
  const key = keyInput.value.trim();

  if (!key) {
    logHashOperation("❌ Please enter element name to remove");
    return;
  }

  if (hashTable.hasOwnProperty(key)) {
    const value = hashTable[key];
    delete hashTable[key];
    logHashOperation(`🗑️ Removed '${key}': ${value}`);
    displayHashTable();
  } else {
    logHashOperation(`❌ '${key}' not found in database`);
  }

  keyInput.value = "";
}

function resetHash() {
  hashTable = {};
  displayHashTable();
  logHashOperation("🔄 Chemical element database cleared");
}

function logHashOperation(message) {
  const log = document.getElementById("hash-log");
  const entry = document.createElement("div");
  entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateHashStatus() {
  const status = document.getElementById("hash-status");
  const elementCount = Object.keys(hashTable).length;
  status.textContent = `Chemical Element Database: ${elementCount} elements stored`;
}

// Utility Functions
function highlightElement(elementId, type) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add(type);
    setTimeout(() => {
      element.classList.remove(type);
    }, 1500);
  }
}

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

function backtoPhase1() {
  window.location.href = "../../index.html";
}

function completedPhase2() {
  alert(
    "🚀 Outstanding work, Data Structure Engineer! You've mastered arrays, stacks, queues, and hash tables. Your next mission: Phase 3 - Advanced Algorithms where we'll tackle sorting, recursion, and dynamic programming!"
  );
  window.location.href = "phase3.html";
}

// Initialize everything when the page loads
window.onload = init;
