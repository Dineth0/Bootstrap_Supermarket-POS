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

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});