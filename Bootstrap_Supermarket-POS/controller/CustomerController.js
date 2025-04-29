import {customer_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";




$('#customer-save').on("click", function () {
    let customerId = $("#id").val();
    let customerName = $('#name').val();
    let address = $('#address').val();
    let number = $('#number').val();

    if(customerId === '' || customerName === '' || address === '' || number === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }else {
        let customer_data = new CustomerModel(customerId, customerName, address, number);
        customer_db.push(customer_data);
        console.log(customer_db);
        loadCustomerTableData();
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true

        })
    }
});



function loadCustomerTableData(){
             $('#customer-tbody').empty();
             customer_db.map((item, index) => {
                 let customerId = item.customerId;
                 let customerName = item.customerName;
                 let address = item.address;
                 let phoneNumber = item.phoneNumber;

                 let data = `<tr>
                     <td>${customerId}</td>
                     <td>${customerName}</td>
                     <td>${address}</td>
                     <td>${phoneNumber}</td>
                 </tr>`

                 $('#customer-tbody').append(data);
             });
}

$('#customer-tbody').on('click', 'tr', function () {
    let id = $(this).index();
    let obj = customer_db[id];

    let customerId = obj.customerId;
    let customerName = obj.customerName;
    let address = obj.address;
    let phoneNumber = obj.phoneNumber;

    $('#id').val(customerId);
    $('#customerName').val(customerName);
    $('#address').val(address);
    $('#number').val(phoneNumber);
})

