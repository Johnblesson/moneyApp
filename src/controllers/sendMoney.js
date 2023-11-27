import SendMoney from "../models/sendMoney.js";
import session from "express-session";

export const transaction = async (req, res) => {
    // const { sender, recipient, amount, purpose } = req.body;
    // Simple in-memory storage for user sessions
    const sessions = {};
    try {
        const { sessionId, recipient, amount, purpose } = req.body;

        // Check if the session is valid
        const session = sessions[sessionId];
        if (!session) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        const { userId } = session;
    
        // Find sender and recipient users
        const senderUser = await User.findById(userId);
        const recipientUser = await User.findOne({ email: recipient });
    
        if (!senderUser || !recipientUser) {
          return res.status(404).json({ message: 'Sender or recipient not found' });
        }
    
        // Check if the sender has sufficient balance
        if (senderUser.accountBalance < amount) {
          return res.status(400).json({ message: 'Insufficient balance' });
        }
    
        // Debit the sender's account
        senderUser.accountBalance -= amount;
    
        // Credit the recipient's account
        recipientUser.accountBalance += amount;
    
        // Create a sendMoney transaction record
        const sendMoneyTransaction = new SendMoney({
          sender: senderUser.email,
          recipient,
          amount,
          purpose,
        });
    
        // Save changes to the database
        await senderUser.save();
        await recipientUser.save();
        const savedTransaction = await sendMoneyTransaction.save();
    
        res.status(200).json({
          message: 'Transaction successful',
          transaction: savedTransaction,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    };
  