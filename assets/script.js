// Scroll-triggered animations 
document.addEventListener("scroll", () => {
    document.querySelectorAll(".scroll-effect").forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add("scroll-visible");
        }
    });
});

// Store the previous total cost for comparison
let previousTotalCost = 0;

// Ticket cost calculator
function calculateCost() {
    const ticketType = parseFloat(document.getElementById("ticket-type").value) || 0;
    const quantity = parseInt(document.getElementById("quantity").value) || 0;
    const totalCost = ticketType * quantity;

    // Format total cost as AUD
    const formattedCost = `AU$${totalCost.toFixed(2)}`; // Explicit AU$ prefix
    const totalCostElement = document.getElementById("total-cost");

    // Check if the total cost has changed
    if (totalCost !== previousTotalCost) {
        totalCostElement.textContent = `Total Cost: ${formattedCost}`;
        
        // Trigger the pop-up animation only if the cost has changed
        triggerPopUpAnimation(document.getElementById("result-box"));
    }

    // Update the previous total cost
    previousTotalCost = totalCost;
}

// Event listener for cost calculation
document.querySelectorAll("#ticket-type, #quantity").forEach((element) => {
    element.addEventListener("input", calculateCost);
});

// Calculate total cost for multiple ticket groups
function calculateTotalCost() {
    let totalCost = 0;

    // Iterate through each ticket input group
    document.querySelectorAll(".ticket-group input").forEach((input) => {
        const quantity = parseInt(input.value) || 0;
        const price = parseInt(input.dataset.price) || 0;
        totalCost += quantity * price;
    });

    // Format total cost as AUD with explicit AU$ prefix
    const formattedCost = `AU$${totalCost.toFixed(2)}`;
    const totalCostElement = document.getElementById("total-cost");

    // Check if the total cost has changed
    if (totalCost !== previousTotalCost) {
        totalCostElement.textContent = `Total Cost: ${formattedCost}`;
        
        // Trigger the pop-up animation only if the cost has changed
        triggerPopUpAnimation(document.getElementById("result-box"));
    }

    // Update the previous total cost
    previousTotalCost = totalCost;
}

// Function to trigger the pop-up animation
function triggerPopUpAnimation(element) {
    // Remove and re-add the "popup" class to trigger animation
    element.classList.remove("popup"); // Remove the class
    void element.offsetWidth; // Trigger a reflow (this is necessary to reset the animation)
    element.classList.add("popup"); // Re-add the class to trigger the animation
}

// Attach event listener for dynamic total cost calculation
document.querySelectorAll(".ticket-group input").forEach((input) => {
    input.addEventListener("input", calculateTotalCost);
});

// AJAX form submission for contact form
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const formData = new FormData(form);

    fetch("process_contact.php", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const responseDiv = document.getElementById("form-response");
            responseDiv.textContent = data.message;
            responseDiv.style.color = data.status === "success" ? "green" : "red";

            if (data.status === "success") {
                form.reset(); // Reset form on success
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            const responseDiv = document.getElementById("form-response");
            responseDiv.textContent = "An error occurred. Please try again.";
            responseDiv.style.color = "red";
        });
});
