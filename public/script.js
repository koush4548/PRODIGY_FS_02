const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");

// Add Employee
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const employee = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        salary: document.getElementById("salary").value
    };

    try {
        const response = await fetch("/addEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });

        const message = await response.text();
        alert(message);

        form.reset();
        loadEmployees();

    } catch (error) {
        console.error(error);
        alert("Failed to add employee");
    }
});

// Load Employees
async function loadEmployees() {
    try {
        const response = await fetch("/employees");
        const employees = await response.json();

        table.innerHTML = "";

        if (employees.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="5">No Employees Found</td>
                </tr>
            `;
            return;
        }

        employees.forEach((emp) => {
            table.innerHTML += `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>₹${Number(emp.salary).toLocaleString()}</td>
                    <td>
                        <button 
                            class="delete-btn"
                            onclick="deleteEmployee('${emp._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

// Delete Employee
async function deleteEmployee(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
        await fetch(`/employee/${id}`, {
            method: "DELETE"
        });

        loadEmployees();

    } catch (error) {
        console.error(error);
        alert("Failed to delete employee");
    }
}

// Initial Load
loadEmployees();