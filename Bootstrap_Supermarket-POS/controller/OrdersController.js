import {orders_db,customer_db,item_db} from "../db/db.js";
import OrdersModel from "../model/OrdersModel.js";

$('#selectCustomerId').change(function () {
    var selectedValue = $(this).val();
    customer_db.map(function (Customer) {
        if (selectedValue.toString() === Customer.customerId.toString()) {
            $('#cusName').val(Customer.customerName);
            $('#cusAddress').val(Customer.address);
            $('#cusNumber').val(Customer.phoneNumber);
        }
    });
});



$('#selectItemCode').change(function () {
    var selectedValue = $(this).val();
    item_db.map(function (Item) {
        if (selectedValue.toString() === Item.itemCode.toString()) {
            $('#OrItemName').val(Item.itemName);
            $('#OrPrice').val(Item.price);
            $('#ItemQty').val(Item.qty);

        }
    })
})


let subTotal = 0;
let discountRate = 0;
let discount = 0;
let total = 0;
$('#card').on('click', function () {
    let orderId = $('#orderId').val();
    let date = $('#date').val();
    let customerId = $('#selectCustomerId').val();
    let customerName = $('#cusName').val();
    let itemCode = $('#selectItemCode').val();
    let itemName = $('#OrItemName').val();
    let price = parseFloat($('#OrPrice').val());
    let itemQty = parseInt($('#ItemQty').val());
    let OrQty = parseInt($('#OrQty').val());

    if(!orderId || !date || !customerId || !customerName || !itemCode || !itemName || !price || !itemQty || !OrQty) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please ensure all fields are filled out correctly.',
        });
    }
    if(OrQty > itemQty) {
            Swal.fire({
                icon: 'warning',
                title: 'Quantity Unavailable',
                text: "Not enough quantity available.",
            });
    }
    subTotal = price * OrQty;
    let order = new OrdersModel(orderId, date, customerId, customerName, itemCode, itemName, price, itemQty, OrQty,subTotal);
    orders_db.push(order);
    console.log(orders_db);


    for(let i = 0; i <item_db.length; i++) {
        if(item_db[i].itemCode === itemCode) {
            item_db[i].itemQty -= OrQty;
            break;
        }
    }
    loadCartData();
    Swal.fire({
        icon: 'success',
        title: 'Item Added',
        text: 'Item successfully added to cart.',
    });
})

const loadCartData = () => {
    $('#CartBody').empty();
    total = 0;
    let CartSubTotal = 0;

    orders_db.map(item => {
        CartSubTotal += item.subTotal;

        let itemCode = item.itemCode;
        let itemName = item.itemName;
        let price = item.price;
        let OrQty = item.OrQty;
        let subTotal = item.subTotal;

        let data = `<tr>
                            <td>${itemCode}</td>
                            <td>${itemName}</td>
                            <td>${price}</td>
                            <td>${OrQty}</td>
                            <td>${subTotal}</td>
                            </tr>`
        $('#CartBody').append(data);
    });


    discountRate = parseFloat($('#rate').val()) || 0;
    discount = (CartSubTotal * discountRate) / 100;
    total = CartSubTotal - discount;

    $('#subTotal').text(`Sub Total : ${CartSubTotal.toFixed(2)}`);
    $('#discount').text(`Discount : ${discount.toFixed(2)}`);
    $('#total').text(`Total : ${total.toFixed(2)}`);


    let cash = parseFloat($('#cash').val()) || 0;
    let balance = cash - total;
    $('#balance').text(`Balance : ${balance.toFixed(2)}`);




}
$('#rate').on('input', function (){
    loadCartData();
})
$('#cash').on('input', function (){
    loadCartData();
})




