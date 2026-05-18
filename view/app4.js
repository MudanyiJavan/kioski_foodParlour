''onst cart_value= documkjhhb ;opo0--0-0










cart_value.textContent=0;

//reload on screen when when user returns again.
function browserPageReload() {
    const savedCart = JSON.parse(localStorage.getItem("kioski")) || [];
    // Sum up all quantities: [2, 1, 5] => 8
    const totalQty = savedCart.reduce((acc, item) => acc + item.quantity, 0);
    cart_value.textContent = totalQty;
}
browserPageReload();

//executable code.
function cart(btn, name, price, img){
    let cart_box = parseInt(cart_value.textContent)||0
    cart_value.innerText= cart_box+1
    btn.innerHTML = `
        <button class="decrease">-</button>
        <span class="counter">1</span>]/\\\\\\\\\\\\\\\\////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        <button class="add">+</button>
    `
    btn.onclick =null;

    firstClick(name, price, 1, img)

    const nevbtn = btn.querySelector(".decrease");
    const dec = btn.querySelector(".counter")
    const posbtn = btn.querySelector(".add")
    nevbtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        const span_value = parseInt(dec.innerText)-1;
        dec.textContent= span_value;

        const current_cart_value= parseInt(cart_value.textContent)
        cart_value.innerText= current_cart_value-1
        
        browserStorageUpdate(name, price, span_value, img);

        if (span_value < 1) {
            btn.innerHTML = "cart";
            btn.onclick = () => cart(btn, name, price, img);
        }
    })
    posbtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        const span_value = parseInt(dec.innerText)+1;
        dec.textContent= span_value;
        const current_cart_value= parseInt(cart_value.textContent)
        cart_value.innerText= current_cart_value+1

        // Update storage with the new quantity
        browserStorageUpdate(name, price, span_value, img);
    })

    
}

function firstClick(name, price, quantity, img){
    let myKioskiCart = JSON.parse(localStorage.getItem("kioski")) || [];
    const itemIndex = myKioskiCart.findIndex(item => item.name === name);
    if (quantity > 0) {
        if (itemIndex > -1) {
            // Update existing item
            myKioskiCart[itemIndex].quantity = quantity;
        } else {
            // Add new item
            myKioskiCart.push({ name, price, quantity, img });
        }
    } else if (itemIndex > -1) {
        myKioskiCart.splice(itemIndex, 1);
    }
    // Save back to localStorage
    localStorage.setItem("kioski", JSON.stringify(myKioskiCart));
}

function browserStorageUpdate(name, price, quantity, img){
    let kiskicart=  JSON.parse(localStorage.getItem("kioski"))
    kiskicart.forEach((element, index) => {
        if(element.name===name){
            element.quantity= quantity
        }
    });
}