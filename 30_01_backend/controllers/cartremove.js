const Userschemadb = require('../models/user');

// Update user cart
async function CartPut(req, res) {
  try {
    const updatedCartItem = req.body;
    const user = req.user;

    if (!user || !user.email) {
      return res.status(400).send({ message: 'User information is missing' });
    }

    const userRecord = await Userschemadb.findOne({ email: user.email });
    if (!userRecord) {
      return res.status(404).send({ message: 'User not found' });
    }

    const cartItem = userRecord.cart.find(item => item._id === updatedCartItem.id);
    if (!cartItem) {
      return res.status(404).send({ message: 'Item not found in your cart' });
    }

    // If item is found, move to the notify list
    if (updatedCartItem.notify) {
      await Userschemadb.updateOne(
        { email: user.email },
        { $push: { notify: cartItem } }
      );
    }

    // Remove from cart
    await Userschemadb.updateOne(
      { email: user.email },
      { $pull: { cart: { _id: updatedCartItem.id } } }
    );

    return res.status(200).send({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).send({ message: 'Error updating cart', error });
  }
}



module.exports = { CartPut };
