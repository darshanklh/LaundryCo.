document.addEventListener("DOMContentLoaded", () => {
    
    // --- Get Elements ---
    const serviceItems = document.querySelectorAll(".service-item");
    const cartItemsBody = document.getElementById("cart-items-body");
    const totalAmountValue = document.getElementById("total-amount-value");
    const bookingForm = document.getElementById("booking-form");


    // ... (your other variables)

    // --- ADD THIS NEW NAVBAR LOGIC ---
    const menuToggle = document.getElementById("mobile-menu");
    const navLinksList = document.getElementById("nav-links-list");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinksList.classList.toggle("active");
            menuToggle.classList.toggle("is-active"); // Optional: for styling the 'X'
        });
    }
    // --- END OF NEW NAVBAR LOGIC ---

    // This cart will hold one of each service type
    let cart = []; 

    // --- 1. Function to Update Cart (Right Side) ---
    // --- 1. Function to Update Cart (Right Side) ---
    function updateCart() {
        // Clear the current cart display
        cartItemsBody.innerHTML = ""; // Clear the table body
        let total = 0;

        // Check if cart is empty
        if (cart.length === 0) {
            cartItemsBody.innerHTML = `
                <tr>
                    <td colspan="3" class="no-items">No Items Added</td>
                </tr>
            `;
            totalAmountValue.textContent = "0.00";
            return;
        }

        // Loop through each item in the cart
        cart.forEach((item, index) => {
            // Create a new table row
            const tr = document.createElement("tr");
            
            // Set the content for the table row
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
            `;
            
            // Add the new row to the table body
            cartItemsBody.appendChild(tr);
            
            // Add to the total
            total += item.price;
        });

        // Update the total amount display
        totalAmountValue.textContent = total.toFixed(2);
    }

    // --- 2. Function to Update Service Buttons (Left Side) ---
    function updateServiceButtons() {
        serviceItems.forEach(item => {
            const serviceName = item.dataset.name;
            const button = item.querySelector("button"); // Find the button
            
            // Check if this service is in the cart
            const isInCart = cart.some(cartItem => cartItem.name === serviceName);

            if (isInCart) {
                // Item is in cart: show "Remove" state
                button.textContent = "Remove Item";
                button.classList.add("remove");
                button.classList.remove("add");
            } else {
                // Item is NOT in cart: show "Add" state
                button.textContent = "Add Item";
                button.classList.add("add");
                button.classList.remove("remove");
            }
        });
    }

    // --- 3. Add Click Listeners to Service Buttons ---
    serviceItems.forEach(item => {
        const button = item.querySelector("button");
        const serviceName = item.dataset.name;
        const servicePrice = parseFloat(item.dataset.price);

        // Add the initial 'add' class
        button.classList.add("btn-service", "add"); 

        button.addEventListener("click", () => {
            // Check if item is already in cart
            const existingItemIndex = cart.findIndex(cartItem => cartItem.name === serviceName);

            if (existingItemIndex > -1) {
                // Item is in cart, so REMOVE it
                cart.splice(existingItemIndex, 1);
            } else {
                // Item is not in cart, so ADD it
                cart.push({ name: serviceName, price: servicePrice });
            }
            
            // Update both the cart and the buttons
            updateCart();
            updateServiceButtons();
        });
    });

    // --- 4. EMAIL.JS LOGIC ---
    
    // !!!!!!!!! IMPORTANT !!!!!!!!!
    // Replace with your actual Email.js keys
    emailjs.init("ZXEIRuNAq_-QNjDtq"); 

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const bookNowBtn = e.target.querySelector(".btn-book-now");
        const successMsg = document.getElementById("booking-success-msg");
        const errorMsg = document.getElementById("booking-error-msg"); // Get the new error element
        

        // 1. Check if cart is empty
        if (cart.length === 0) {
            errorMsg.textContent = "Please add at least one service to your cart before booking.";
            errorMsg.style.display = "block"; // Show the error message
            successMsg.style.display = "none"; // Hide success message
            return; // Stop the function
        }

        // 2. If cart is NOT empty, proceed
        bookNowBtn.textContent = "Booking...";
        bookNowBtn.disabled = true;
        errorMsg.style.display = "none"; // Hide error message
        successMsg.style.display = "none"; // Hide success message

        const itemsListString = cart.map(item => `${item.name} - ₹${item.price.toFixed(2)}`).join("\n");
        const totalAmountString = `₹${totalAmountValue.textContent}`;

        e.target.elements.item_list.value = itemsListString || "No items selected";
        e.target.elements.total_amount.value = totalAmountString;

        emailjs.sendForm("service_836q7c4", "template_jv2k6tm", e.target)
            .then(() => {
                // 3. On SUCCESS
                successMsg.style.display = "block"; // Show success
                errorMsg.style.display = "none";    // Hide error
                cart = []; 
                updateCart(); 
                updateServiceButtons();
                bookingForm.reset(); 
            }, (error) => {
                // 4. On FAILURE
                console.error("FAILED...", error);
                errorMsg.textContent = "Failed to send booking. Please try again.";
                errorMsg.style.display = "block"; // Show error
                successMsg.style.display = "none"; // Hide success
            })
            .finally(() => {
                // 5. Always re-enable the button
                bookNowBtn.textContent = "Book Now";
                bookNowBtn.disabled = false;
            });
    });

    // Initialize the buttons on page load
    updateServiceButtons();
    // --- 5. NEWSLETTER FORM LOGIC (NEW CODE) ---

    // --- 5. NEWSLETTER FORM LOGIC (CORRECTED) ---

    const newsletterForm = document.getElementById("newsletter-form");
    const subscribeBtn = document.getElementById("subscribe-btn");
    const subscribeSuccessMsg = document.getElementById("subscribe-success-msg");
    const subscribeErrorMsg = document.getElementById("subscribe-error-msg");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Change button state
            subscribeBtn.textContent = "Subscribing...";
            subscribeBtn.disabled = true;

            // Hide messages
            subscribeSuccessMsg.style.display = "none";
            subscribeErrorMsg.style.display = "none";

            // These are your correct Email.js variables
            const NEWSLETTER_TEMPLATE_ID = "template_tp8zy1m"; 
            const EMAILJS_SERVICE_ID = "service_836q7c4";

            // --- ISSUE 1 REMOVED ---
            // I have removed the "if" check that was causing the
            // "Configuration error. Please try again later." message.
            // That check is no longer needed since you added your template ID.

            // --- ISSUE 2 FIXED ---
            // Send the form using your Service ID and new Template ID
            // The code below now correctly uses the *variable names*
            // (EMAILJS_SERVICE_ID and NEWSLETTER_TEMPLATE_ID) instead of their text.
            emailjs.sendForm(EMAILJS_SERVICE_ID, NEWSLETTER_TEMPLATE_ID, e.target)
                .then(() => {
                    // On SUCCESS
                    subscribeSuccessMsg.style.display = "block";
                    newsletterForm.reset();
                }, (error) => {
                    // On FAILURE
                    console.error("Newsletter Subscription FAILED...", error);
                    subscribeErrorMsg.textContent = "Failed to subscribe. Please try again.";
                    subscribeErrorMsg.style.display = "block";
                })
                .finally(() => {
                    // ALWAYS re-enable the button
                    subscribeBtn.textContent = "Subscribe";
                    subscribeBtn.disabled = false;
                });
        });
    }
});