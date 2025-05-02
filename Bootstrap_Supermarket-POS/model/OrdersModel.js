export default class OrdersModel {
    constructor(orderId, date, cusId,cusName,cusAddress,cusNumber,OrItemCode,OrItemName,OrPrice,ItemQty,OrQty ) {
        this.orderId = orderId;
        this.date = date;
        this.cusId = cusId;
        this.cusName = cusName;
        this.cusAddress = cusAddress;
        this.cusNumber = cusNumber;
        this.OrItemCode = OrItemCode;
        this.OrItemName = OrItemName;
        this.OrPrice = OrPrice;
        this.ItemQty = ItemQty;
        this.OrQty = OrQty;

    }
}