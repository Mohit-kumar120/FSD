const express = require("express");
const mongoose = require("mongoose");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const router = express.Router();

// TRANSFER MONEY
router.post("/transfer", async (req, res) => {
    const { from, to, amount } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = await Account.findOne({ name: from }).session(session);
        const receiver = await Account.findOne({ name: to }).session(session);

        if (!sender || !receiver) {
            throw new Error("Account not found");
        }

        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Debit sender
        sender.balance -= amount;
        await sender.save({ session });

        // Credit receiver
        receiver.balance += amount;
        await receiver.save({ session });

        // Log transaction
        await Transaction.create([{
            from,
            to,
            amount,
            status: "SUCCESS"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Transaction successful" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        // Log failed transaction
        await Transaction.create({
            from,
            to,
            amount,
            status: "FAILED"
        });

        res.status(400).json({ message: error.message });
    }
});

module.exports = router;