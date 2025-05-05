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
        clearForm();
        console.log(customer_db);
        loadCustomerDropdown();
        loadCustomerTableData();
        $('#selectCustomerId').append($('<option>').text(customerId));
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true

        })
    }
});
function loadCustomerDropdown() {
    $('#selectCustomerId').empty();
    $('#selectCustomerId').append(`<option>Select Customer ID</option>`);
    customer_db.forEach(customer => {
        $('#selectCustomerId').append(
            $('<option>', {
                value: customer.customerId,
            })
        );
    });
}




function loadCustomerTableData(){
             $('#customer-tbody').empty();
             customer_db.map((item, index) => {

                 let customerName = item.customerName;
                 let address = item.address;
                 let phoneNumber = item.phoneNumber;

                 let data = `<tr>
                     <td>${index + 1}</td>
                     <td>${customerName}</td>
                     <td>${address}</td>
                     <td>${phoneNumber}</td>
                 </tr>`

                 $('#customer-tbody').append(data);
             });
}
let selectedIndex = -1;
$('.cus-body').on('click', 'tr', function () {
     selectedIndex = $(this).index();
    let obj = customer_db[selectedIndex];

    let customerId = obj.customerId;
    let customerName = obj.customerName;
    let address = obj.address;
    let phoneNumber = obj.phoneNumber;

    $('#id').val(customerId);
    $('#name').val(customerName);
    $('#address').val(address);
    $('#number').val(phoneNumber);
})

const clearForm = () =>{
    $(`#id,#name,#address,#number`).val("");
}
$('#customer-clear').on('click', function () {
    clearForm();
});

$('#customer-update').on('click', function () {
    let customerId = $("#id").val();
    let customerName = $('#name').val();
    let address = $('#address').val();
    let number = $('#number').val();

    if(selectedIndex === -1){
        Swal.fire("Error", "Please select a customer to update", "error");
        return;
    }

    let updateCustomer = new CustomerModel(customerId, customerName, address, number);
    customer_db[selectedIndex] = updateCustomer;
    loadCustomerTableData();
    clearForm();

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!"
    });
})

$('#customer-delete').on('click', function () {
    let customerId = $('#id').val();

    const index = customer_db.findIndex(item => item.customerId === customerId);

    if (index === -1) {
        clearForm();

        Swal.fire({
            title: "Item Not Found",
            text: "No customer found with the given ID.",
            icon: "error",
            showCloseButton: true,
            confirmButtonText: "OK",
            customClass: {
                title: 'error-title',
                content: 'error-content'
            }
        });
        return;
    }



    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            customer_db.splice(index, 1);
            loadCustomerTableData();
            clearForm();
            loadCustomerDropdown();
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
    $('#id').val('');
})

