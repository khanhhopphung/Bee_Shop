// Tải thư viện SweetAlert nếu cần
// <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Thêm sự kiện click cho các nút thêm vào danh sách yêu thích
    const addWishB2Buttons = document.querySelectorAll('.js-addwish-b2, .js-addwish-detail');
    
    addWishB2Buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });

    const wishB2Buttons = document.querySelectorAll('.js-addwish-b2');
    wishB2Buttons.forEach(button => {
        const nameProduct = button.closest('.parent-selector').querySelector('.js-name-b2').innerHTML; // Thay .parent-selector bằng selector cha thực tế

        button.addEventListener('click', function () {
            swal(nameProduct, "is added to wishlist!", "success");

            button.classList.add('js-addedwish-b2');
            button.removeEventListener('click', arguments.callee); // Xóa sự kiện sau khi đã click
        });
    });

    const wishDetailButtons = document.querySelectorAll('.js-addwish-detail');
    wishDetailButtons.forEach(button => {
        const nameProduct = button.closest('.parent-selector').querySelector('.js-name-detail').innerHTML; // Thay .parent-selector bằng selector cha thực tế

        button.addEventListener('click', function () {
            swal(nameProduct, "is added to wishlist!", "success");

            button.classList.add('js-addedwish-detail');
            button.removeEventListener('click', arguments.callee); // Xóa sự kiện sau khi đã click
        });
    });

    /*---------------------------------------------*/

    const addCartDetailButtons = document.querySelectorAll('.js-addcart-detail');
    addCartDetailButtons.forEach(button => {
        const nameProduct = button.closest('.parent-selector').querySelector('.js-name-detail').innerHTML; // Thay .parent-selector bằng selector cha thực tế

        button.addEventListener('click', function () {
            swal(nameProduct, "is added to cart!", "success");
        });
    });
});
