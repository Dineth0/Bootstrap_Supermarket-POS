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
    let orderId = $('#orderId').val();
    let orderId = $('#orderId').val();
    let orderId = $('#orderId').val();
    let orderId = $('#orderId').val();
    let orderId = $('#orderId').val();
    let orderId = $('#orderId').val();


})
