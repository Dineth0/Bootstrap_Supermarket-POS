import {orders_db,customer_db,item_db,orderDetails_db} from "../db/db.js";
import OrdersModel from "../model/OrdersModel.js";
import OrderDetailsModel from "../model/OrderDetailsModel.js";

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


function generateOrderId(){
    let lastOrderId = $("#orderId").val();

    if (!lastOrderId) {
        lastOrderId = "OD001";
    }

    let number = parseInt(lastOrderId.substring(2)) + 1;
    let newOrderId = "OD" + number.toString().padStart(3, "0");

    $("#orderId").val(newOrderId);
}

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
            item_db[i].qty -= OrQty;
            updateItemTable();
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

    $('#subTotal').text(`${CartSubTotal.toFixed(2)}`);
    $('#discount').text(`${discount.toFixed(2)}`);
    $('#total').text(`${total.toFixed(2)}`);


    let cash = parseFloat($('#cash').val()) || 0;
    let balance = cash - total;
    $('#balance').text(`${balance.toFixed(2)}`);




}
$('#rate').on('input', function (){
    loadCartData();
})
$('#cash').on('input', function (){
    loadCartData();
})
const updateItemTable = () => {
    $('.item-tbody').empty();
    item_db.slice(0, 5).forEach((item) => {
        let data = `<tr>
                            <td>${item.itemCode}</td>
                            <td>${item.itemName}</td>
                            <td>${item.description}</td>
                            <td>${item.price}</td>
                            <td>${item.qty}</td>
                            </tr>`
        $('.item-tbody').append(data);
    })
}
$('#remove').on('click', function () {
    let orderId = $('#orderId').val();

    if (!orderId) {
        Swal.fire({
            icon: 'error',
            title: 'Order ID Missing',
            text: 'Please enter a valid Order ID to remove an item from the cart.',
        });
        return;
    }
    let removeFromIndex = orders_db.findIndex(item => item.orderId === orderId);

    if (removeFromIndex !== -1) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this item from the cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                let itemRemove = orders_db.splice(removeFromIndex, 1)[0];
                subTotal -= itemRemove.subTotal;

                $('#rate').val("");
                $('#discount').val("");
                $('#total').val("");

                for(let i = 0; i <item_db.length; i++) {
                    if(item_db[i].itemCode === itemRemove.itemCode) {
                        item_db[i].qty += itemRemove.OrQty;

                        break;
                    }
                }
                loadCartData();
                updateItemTable();

                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    text: 'Item successfully removed from the cart.',
                });
            }
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Order Not Found',
            text: 'The Order ID provided was not found in the cart.',
        });
    }
})
$('.purche').on('click', function () {

    let orderId = $('#orderId').val();
    let date = $('#date').val();
    let customerName = $('#cusName').val();
    let itemName = $('#OrItemName').val();
    let price = $('#OrPrice').val();
    let OrQty = $('#OrQty').val();
    let subTotal = $('#subTotal').text();
    let discountRate = $('#rate').val();
    let discount = $('#discount').text();
    let total = $('#total').text();


    if(!orderId || !date || !customerName || !itemName || !price || !OrQty  || !subTotal || !discountRate  || !discount || !total) {
        Swal.fire({
            icon: 'error',
            title: 'Incomplete Information',
            text: 'Please ensure all fields are filled out correctly before proceeding.',
        });
        return;
    }
    Swal.fire({
        title: 'Confirm Purchase',
        text: "Are you sure you want to complete this purchase?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, complete purchase',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            let OrderDetails = new  OrderDetailsModel(orderId, date, customerName, itemName, price, OrQty, subTotal, discountRate, discount, total);
            orderDetails_db.push(OrderDetails)
            Swal.fire({
                icon: 'success',
                title: 'Purchase Completed',
                text: 'The purchase was successfully completed!',
            });
            loadOrderDetailsData();
            clearItem();
            clearCustomer();
            $('#subTotal').val("");
            $('#rate').val("");
            $('#discount').val("");
            $('#total').val("");
            $('#cash').val("");
            $('#balance').val("");
            orders_db.length = 0;
            loadCartData();
            generateOrderId();
            $('#orderCount').text(orderDetails_db.length);


        }
    });
})

const loadOrderDetailsData = () => {
    $('#OrderDetails-tbody').empty();
    orderDetails_db.map((item, index) =>{
        let orderId = item.OrderId;
        let date = item.Date;
        let customerName = item.cusName;
        let itemName = item.ItemName;
        let price = item.Price;
        let OrQty = item.OrderQty;
        let subTotal = item.SubTotal;
        let discountRate = item.DiscountRate;
        let discount = item.Discount;
        let total = item.FinalTotal;

        let data = `<tr>
                     <td>${orderId}</td>
                     <td>${date}</td>
                     <td>${customerName}</td>
                     <td>${itemName}</td>
                     <td>${price}</td>
                     <td>${OrQty}</td>
                     <td>${subTotal}</td>
                     <td>${discountRate}</td>
                     <td>${discount}</td>
                     <td>${total}</td>
                     
                 </tr>`
        $('#OrderDetails-tbody').append(data);
    })
}
const clearItem = () =>{

    $('#date').val("");
    $("#selectItemCode").val("");
    $("#OrItemName").val("");
    $("#OrPrice").val("");
    $("#ItemQty").val("");
    $("#OrQty").val("");
}
const clearCustomer = () =>{
    $("#selectCustomerId").val("");
    $("#cusName").val("");
    $("#cusAddress").val("");
    $("#cusNumber").val("");

}
function isDuplicated(id){
    return orders_db.some(orders => orders.orderId() === id);
}
function checkEmptyInputFields01(checkOrderId, checkOrderQty) {
    if (checkOrderId && checkOrderQty) {
        $('#card').prop('disabled', false);
    } else {
        $('#card').prop('disabled', true);
    }
}
    function checkEmptyInputFields02(checkRate, checkCash) {
        if (checkRate && checkCash) {
            $('.purche').prop('disabled', false);
        } else {
            $('.purche').prop('disabled', true);
        }
    }

function Validation(){
    let checkOrderId = false;
    let checkOrderQty = false;
    let checkRate = false;
    let checkCash = false;


    $('#orderId').on('input', function(){
        let id = $('#orderId').val();
        if(isDuplicated(id)){
            $('.Oid').text('Duplicate ItemCode').show();
            $('#orderId').css({border:'1px solid red'});
            checkOrderId = false;
        }else if(/^OD\d{3,}$/.test(id)){
            $('#orderId').css({border:'1px solid green'});
            $('.Oid').text('Invalid itemCode Format. (Ex : OD001)').hide();
            checkOrderId = true;
        }else {
            $('.Oid').text('Invalid ItemCode Format. (Ex : OD001)').show();
            $('#orderId').css({border:'1px solid red'});
            checkOrderId = false;
        }
        checkEmptyInputFields01(checkOrderId, checkOrderQty);
    })

    $('#OrQty').on('input', function(){
        let qty = $('#OrQty').val();
        if(/^[1-9]\d*$/.test(qty)){
            $('#OrQty').css({border:'1px solid green'});
            $('.Oqty').text('Invalid QTY Format.').hide();
            checkOrderQty = true;
        }else {
            $('.Oqty').text('Invalid QTY Format.').show();
            $('#OrQty').css({border:'1px solid red'});
            checkOrderQty = false;
        }
        checkEmptyInputFields01(checkOrderId, checkOrderQty);
    })
    $('#rate').on('input', function(){
        let rate = $('#rate').val();
        if(/^[1-9]\d*$/.test(rate)){
            $('#rate').css({border:'1px solid green'});
            $('.txtRate').text('Invalid rate Format.. put between 0 and 100').hide();


            checkRate = true;
        }else {
            $('.txtRate').text('Invalid Price Format. put between 0 and 100').show();
            $('#rate').css({border:'1px solid red'});
            checkRate = false;
        }
        checkEmptyInputFields02(checkRate, checkCash);
    })
    $('#cash').on('input', function(){
        let price = $('#cash').val();
        if(/^\d+\.\d{2}$/.test(price)){
            $('#cash').css({border:'1px solid green'});
            $('.txtCash').text('Invalid Cash Format. (Ex : 000.00)').hide();
            checkCash = true;
        }else {
            $('.txtCash').text('Invalid Cash Format. (Ex : 000.00').show();
            $('#cash').css({border:'1px solid red'});
            checkCash = false;
        }
        checkEmptyInputFields02(checkRate, checkCash);
    })
}
Validation('#OrderId', '#OrQty', '#description', '#price', '#qty','#card', '.purche');

function searchOrders(keyword) {
    $('#OrderDetails-tbody').empty();
    let filteredOrders = orderDetails_db.filter(order => {
        return order.OrderId.includes(keyword) ||
            order.Date.includes(keyword) ||
            order.cusName.includes(keyword) ||
            order.ItemName.includes(keyword) ||
            order.Price.includes(keyword) ||
            order.OrderQty.includes(keyword) ||
            order.SubTotal.includes(keyword) ||
            order.DiscountRate.includes(keyword) ||
            order.Discount.includes(keyword) ||
            order.FinalTotal.includes(keyword)
    });

    if (filteredOrders.length === 0) {
        $('#OrderDetails-tbody').append(`<tr><td colspan="10" class="text-center text-danger">No results found</td></tr>`);
    } else {
        filteredOrders.forEach(item => {
            let data = `<tr>
                <td>${item.OrderId}</td>
                <td>${item.Date}</td>
                <td>${item.cusName}</td>
                <td>${item.ItemName}</td>
                <td>${item.Price}</td>
                <td>${item.OrderQty}</td>
                <td>${item.SubTotal}</td>
                <td>${item.DiscountRate}</td>
                <td>${item.Discount}</td>
                <td>${item.FinalTotal}</td>
            </tr>`;

            $('#OrderDetails-tbody').append(data);
        });
    }
}
$('#button-addonO').on('click', function () {
    let keyword = $('#orderSearch').val();
    searchOrders(keyword);
});
