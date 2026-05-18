const containerdiv = document.getElementById("products");

window.onload = function() {
    let savedCart = JSON.parse(localStorage.getItem("kioski")) || [];
    let totalQty = 0; // To track the total count for the header

    savedCart.forEach(item => {
        // 1. Create all elements
        const div = document.createElement("div");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const productImage = document.createElement("img"); // Create img element
        
        const counterWrapper = document.createElement("div"); 
        const btnMinus = document.createElement("button");
        const spanQty = document.createElement("span");
        const btnPlus = document.createElement("button");

        // 2. Set content from localStorage
        p1.textContent = item.name;
        p2.textContent = `Ksh.${item.price}`;
        
        // Handle the Image
        productImage.src = item.img; // Use the image URL saved in storage
        productImage.style.width = "100px"; // Give it a size so it's visible
        productImage.alt = item.name;

        btnMinus.textContent = "-";
        spanQty.textContent = item.quantity;
        btnPlus.textContent = "+";

        totalQty += item.quantity;

        // 3. Add Functionality to the Minus Button
        btnMinus.onclick = () => {
            let newVal = parseInt(spanQty.textContent) - 1;
            spanQty.textContent = newVal;
            cart_value.innerText = parseInt(cart_value.textContent) - 1;
            webStorage(item.name, item.price, newVal, item.img);
            if (newVal < 1) div.remove(); // Remove item from screen if 0
        };

        // 4. Add Functionality to the Plus Button
        btnPlus.onclick = () => {
            let newVal = parseInt(spanQty.textContent) + 1;
            spanQty.textContent = newVal;
            cart_value.innerText = parseInt(cart_value.textContent) + 1;
            webStorage(item.name, item.price, newVal, item.img);
        };

        // 5. Assemble and Display
        counterWrapper.append(btnMinus, spanQty, btnPlus);
        div.append(productImage, p1, p2, counterWrapper); // Add image to the div
        containerdiv.appendChild(div);
    });

    // Sync the header cart count
    if(cart_value) cart_value.innerText = totalQty;
};