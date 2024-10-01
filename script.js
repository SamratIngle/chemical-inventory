const tableBody = document.getElementById('tableBody');
let chemicalData = [];

// Fetch data from JSON
async function fetchData() {
    const response = await fetch('data.json');
    chemicalData = await response.json();
    populateTable(chemicalData);
}

function populateTable(data) {
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });
        row.onclick = () => selectRow(row);
        tableBody.appendChild(row);
    });
}

let selectedRow = null;

function selectRow(row) {
    if (selectedRow) {
        selectedRow.classList.remove('selected');
    }
    selectedRow = row;
    selectedRow.classList.add('selected');
}

// Sort function
function sortTable(column, order) {
    chemicalData.sort((a, b) => {
        if (order === 'asc') {
            return a[column] > b[column] ? 1 : -1;
        } else {
            return a[column] < b[column] ? 1 : -1;
        }
    });
    populateTable(chemicalData);
}

// Event listeners for sorting
document.querySelectorAll('th').forEach(header => {
    header.addEventListener('click', () => {
        const column = header.getAttribute('data-sort');
        const currentOrder = header.dataset.order || 'asc';
        const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
        header.dataset.order = newOrder;
        sortTable(column, newOrder);
    });
});

// Add a new row
document.getElementById('addRow').addEventListener('click', () => {
    const newRow = {
        id: chemicalData.length + 1,
        name: "New Chemical",
        vendor: "New Vendor",
        density: 0,
        viscosity: 0,
        packaging: "New Packaging",
        packSize: "1L",
        unit: "L",
        quantity: 0
    };
    chemicalData.push(newRow);
    populateTable(chemicalData);
});

// Move selected row up
document.getElementById('moveUp').addEventListener('click', () => {
    if (selectedRow) {
        const index = Array.from(tableBody.children).indexOf(selectedRow);
        if (index > 0) {
            const temp = chemicalData[index];
            chemicalData[index] = chemicalData[index - 1];
            chemicalData[index - 1] = temp;
            populateTable(chemicalData);
            selectRow(tableBody.children[index - 1]);
        }
    }
});

// Move selected row down
document.getElementById('moveDown').addEventListener('click', () => {
    if (selectedRow) {
        const index = Array.from(tableBody.children).indexOf(selectedRow);
        if (index < chemicalData.length - 1) {
            const temp = chemicalData[index];
            chemicalData[index] = chemicalData[index + 1];
            chemicalData[index + 1] = temp;
            populateTable(chemicalData);
            selectRow(tableBody.children[index + 1]);
        }
    }
});

// Delete selected row
document.getElementById('deleteRow').addEventListener('click', () => {
    if (selectedRow) {
        const index = Array.from(tableBody.children).indexOf(selectedRow);
        chemicalData.splice(index, 1);
        selectedRow.remove();
        selectedRow = null;
        populateTable(chemicalData);
    }
});

// Refresh the data
document.getElementById('refresh').addEventListener('click', fetchData);

// Save data (placeholder)
document.getElementById('save').addEventListener('click', () => {
    alert("Save functionality is not implemented yet.");
});

// Initial fetch
fetchData();
