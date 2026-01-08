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
    mongoose.models.Group || mongoose.model("Group", groupSchema);



const DEFAULT_GROUPS = [
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
];

async function seedGroups() {
    const existing = await Group.find({}, { name: 1 }).lean();

    if (existing.length > 0) {
        console.log("[Group] ♻️ Groups already exist:");
        existing.forEach(g =>
            console.log(`   • ${g.name} → ${g._id}`)
        );
        return;
    }

    const created = await Group.insertMany(
        DEFAULT_GROUPS.map(name => ({ name }))
    );

    console.log("[Group] ✅ Default groups created:");
    created.forEach(g =>
        console.log(`   • ${g.name} → ${g._id}`)
    );
}


if (mongoose.connection.readyState === 1) {
    seedGroups();
} else {
    mongoose.connection.once("open", seedGroups);
}
