import mongoose from "mongoose";

const { Schema } = mongoose;

const BatchConsumedSchema = new Schema({

    idStockBatch: {
        type: Schema.Types.ObjectId,
        ref: "StockBatch",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    unitCost: {
        type: Number,
        required: true
    }

}, {
    _id: false
});

const SaleItemSchema = new Schema({

    idCompanySupplyVariant: {
        type: Schema.Types.ObjectId,
        ref: "CompanySupplyVariant",
        required: true
    },

    idSupplyVariant: {
        type: Schema.Types.ObjectId,
        ref: "SupplyVariant",
        required: true
    },

    idGlobalSupply: {
        type: Schema.Types.ObjectId,
        ref: "Supply",
        required: true
    },

    nameSupply: {
        type: String,
        required: true
    },

    variantName: {
        type: String,
        required: true
    },

    quantitySale: {
        type: Number,
        required: true
    },

    quantityReturned: {
        type: Number,
        default: 0
    },

    unitCost: {
        type: Number,
        required: true
    },

    priceSaleUnit: {
        type: Number,
        required: true
    },

    subtotal: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    surcharge: {
        type: Number,
        default: 0
    },

    profit: {
        type: Number,
        required: true
    },

    batchesConsumed: {
        type: [BatchConsumedSchema],
        default: []
    }

});

const SaleSupplySchema = new Schema({

    idCompany: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    numeSale: {
        type: String,
        required: true,
        unique: true
    },

    date: {
        type: Date,
        required: true
    },

    platformMethod: {
        type: String,
        default: null
    },

    paymentMethodEfectivo: {
        type: Number,
        default: 0
    },

    paymentMethodTarjeta: {
        type: Number,
        default: 0
    },

    paymentMethodTransferencia: {
        type: Number,
        default: 0
    },

    totalSale: {
        type: Number,
        required: true
    },

    totalCost: {
        type: Number,
        required: true
    },

    totalProfit: {
        type: Number,
        required: true
    },

    totalReturned: {
        type: Number,
        default: 0
    },

    items: {
        type: [SaleItemSchema],
        default: []
    },

    status: {
        type: String,
        enum: [
            "completed",
            "partially_returned",
            "returned",
            "cancelled"
        ],
        default: "completed"
    }

}, {
    timestamps: true
});

const SaleSupply = mongoose.model(
    "SaleSupply",
    SaleSupplySchema
);

export default SaleSupply;