import  {item_db} from "../db/db.js";
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
        console.log(item_db);
        loadItemTableData();
        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

function loadItemTableData(){
    $('#item-tbody').empty();
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

        $('#item-tbody').append(data);
    });

}