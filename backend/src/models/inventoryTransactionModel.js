import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    sku: { type: String }, 
    transactionType: { 
        type: String,
        enum: ['inbound', 'outbound', 'adjustment', 'return', 'damage', 'physical_count'],
        required: true
    },
    quantity: { 
        type: Number,
        required: true,
        min: 1
    },
    previousStock: { type: Number }, // Tồn kho trước giao dịch
    newStock: { type: Number },     // Tồn kho sau giao dịch
    source: { 
        type: String,
        enum: ['order', 'supplier', 'manual_adjustment', 'customer_return', 'damage_report', 'physical_inventory'],
        required: true
    },
    sourceId: { type: mongoose.Schema.Types.ObjectId }, 
    note: { type: String }, // Ghi chú thêm
    transactionDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

const InventoryTransaction = mongoose.models.InventoryTransaction || mongoose.model('InventoryTransaction', inventoryTransactionSchema);
export default InventoryTransaction;