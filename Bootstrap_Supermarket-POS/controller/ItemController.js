import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";


$('#item-save').on('click', function(){
    let  itemCode = $('#itemCode').val();
    let  itemName = $('#itemName').val();
    let  description = $('#description').val();
    let  price = $('#price').val();
    let  qty = $('#qty').val();

    if(itemCode === '' || itemName === '' || description === '' || price === '' || qty === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }else {
        let item_data = new ItemModel(itemCode, itemName, description, price, qty);
        item_db.push(item_data);
        clearForm();
        console.log(item_db);
        loadItemDropdown();
        loadItemTableData();
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

function loadItemDropdown() {
    $('#selectItemCode').empty();
    $('#selectItemCode').append(`<option>Select Item ID</option>`);
    item_db.forEach(item => {
        $('#selectItemCode').append(
            $('<option>', {
                value: item.itemCode,
                text: item.itemCode
            })
        );
    });
}

function loadItemTableData(){
    $('.item-tbody').empty();
    item_db.map((item, index) => {
        let itemCode = item.itemCode;
        let itemName = item.itemName;
        let description = item.description;
        let price = item.price;
        let qty = item.qty;

        let data = `<tr>
             <td>${itemCode}</td>
             <td>${itemName}</td>
             <td>${description}</td>
             <td>${price}</td>
             <td>${qty}</td>
         </tr>`

        $('.item-tbody').append(data);
    });

}

let selectedIndex = -1;
$('.item-tbody').on('click', 'tr', function () {
     selectedIndex = $(this).index();
    let obj = item_db[selectedIndex];

    let itemCode = obj.itemCode;
    let itemName = obj.itemName;
    let description = obj.description;
    let price = obj.price;
    let qty = obj.qty;

    $('#itemCode').val(itemCode);
    $('#itemName').val(itemName);
    $('#description').val(description);
    $('#price').val(price);
    $('#qty').val(qty);
});

const clearForm = () =>{
    $(`#itemCode,#itemName,#description,#price,#qty`).val("");
}

$('#item-clear').on('click', function(){
    clearForm();
    });
$('#item-update').on('click', function () {
    let  itemCode = $('#itemCode').val();
    let  itemName = $('#itemName').val();
    let  description = $('#description').val();
    let  price = $('#price').val();
    let  qty = $('#qty').val();

    if(selectedIndex === -1){
        Swal.fire("Error", "Please select a customer to update", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "You want to update this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let updatedItem = new ItemModel(itemCode, itemName, description, price, qty);
            item_db[selectedIndex] = updatedItem;
            loadItemTableData();
            loadItemDropdown();
            clearForm();
            Swal.fire("Updated!", "Item has been updated successfully.", "success");
        }
    });
})
$('#item-delete').on('click', function () {
    let itemCode = $('#itemCode').val();

    const index = item_db.findIndex(item => item.itemCode === itemCode);

    if (index === -1) {
        clearForm();

        Swal.fire({
            title: "Item Not Found",
            text: "No Item found with the given ID.",
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

            item_db.splice(index, 1);
            loadItemTableData();
            clearForm();
            loadItemDropdown();
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
    $('#itemCode').val('');
})


