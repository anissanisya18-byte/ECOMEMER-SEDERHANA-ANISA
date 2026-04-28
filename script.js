// script.js - JavaScript untuk E-Commerce Maison de Sucre

// Fungsi untuk mendapatkan keranjang dari localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fungsi untuk menambah produk ke keranjang
function addToCart(productName, price, imageSrc) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parseInt(price.replace(/[^\d]/g, '')), // Hapus 'Rp' dan titik
            image: imageSrc,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    alert(`${productName} ditambahkan ke keranjang!`);
}

// Fungsi untuk menghapus produk dari keranjang
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartCount();
}

// Fungsi untuk mengupdate jumlah item di keranjang di navigasi
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLinks = document.querySelectorAll('a[href*="keranjang"]');
    cartLinks.forEach(link => {
        link.textContent = `Keranjang (${totalItems})`;
    });
}

// Fungsi untuk menampilkan keranjang di halaman keranjang
function displayCart() {
    const cart = getCart();
    const cartContainer = document.querySelector('.cart');
    const checkoutBtn = document.querySelector('.btn-checkout');

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-item">
                <div>
                    <h3>Keranjang masih kosong</h3>
                    <p>Tambahkan produk di halaman Produk untuk melihatnya di sini.</p>
                </div>
            </div>
            <div class="checkout">
                <button class="btn-checkout">Lanjutkan ke Pembayaran</button>
            </div>
        `;
        return;
    }

    let cartHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 20px;">
                <div style="flex: 1;">
                    <h3>${item.name}</h3>
                    <p>Harga: Rp ${item.price.toLocaleString()}</p>
                    <p>Jumlah: ${item.quantity}</p>
                    <p>Total: Rp ${itemTotal.toLocaleString()}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Hapus</button>
            </div>
        `;
    });

    cartHTML += `
        <div class="checkout">
            <h3>Total: Rp ${totalPrice.toLocaleString()}</h3>
            <button class="btn-checkout">Lanjutkan ke Pembayaran</button>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Tambahkan event listener untuk tombol "Tambah" di halaman produk
    const addButtons = document.querySelectorAll('.btn-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const image = card.querySelector('img').src;
            addToCart(name, price, image);
        });
    });

    // Jika di halaman keranjang, tampilkan keranjang
    if (document.querySelector('.cart')) {
        displayCart();
    }
});
