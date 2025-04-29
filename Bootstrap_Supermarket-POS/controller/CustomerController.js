import {customer_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

$("#customer-save").on("click", function () {
    let id = $("#id").val();
    let name = $('#name').val();
    let address = $('#address').val();
    let number = $('#number').val();

    if(id === '' || name === '' || address === '' || number === '' || number === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }else {
        let customer_data = new CustomerModel(id, name, address, number, number);
        customer_db.push(customer_data);
        console.log(customer_db);
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true

        })
    }});