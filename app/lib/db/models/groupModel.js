import mongoose from "mongoose";
const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

groupSchema.index({ name: 1 });

export const Group =
    mongoose.models.Group || mongoose.model('Group', groupSchema);




const seedGroups = async () => {
    const existing = await Group.find({}, { name: 1 }).lean();
    if (existing.length > 0) {
        console.log("[Group] ♻️ Groups already exist:");
        return;
    }
    await Group.insertMany([
        "Sundry Debtors",
        "Sundry Creditors",
        "Weavers",
        "Yarn Suppliers",
        "Cash",
        "Bank",
        "Expenses",
        "Indirect Expenses",
        "Income",
        "Capital Account",
    ].map(name => ({ name })));
}
if (mongoose.connection.readyState === 1) {
    seedGroups();
} else {
    mongoose.connection.once("open", seedGroups);
}
