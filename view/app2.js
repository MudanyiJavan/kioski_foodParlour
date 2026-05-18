function bill(btn, price){
    if(btn.textContent === "cart"){
        const count= parseInt( document.getElementById("count").textContent)
        btn.innerHTML = `
            <button class="decrease" onclick="decrease(this, ${price})">-</button>
            <span class="qty">1</span>
            <button class="increase" onclick="increase(this)">+</button>
        `;
        count.innerHTML=count+1
    }
}

function increase(btn){
    const container = btn.parentElement;
    const qty = container.querySelector(".qty");
    qty.textContent = parseInt(qty.textContent) + 1;
}

function decrease(btn, price){
    const container = btn.parentElement;
    const qty = container.querySelector(".qty");
    let value = parseInt(qty.textContent) - 1;

    if(value === 0){
        // Go back to original cart button
        container.innerHTML = `cart`;
        container.setAttribute("onclick", `addToCart(this, ${price})`);
    } else {
        qty.textContent = value;
    }
}
``