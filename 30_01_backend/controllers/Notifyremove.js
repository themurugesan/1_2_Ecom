const Userschemadb = require('../models/user');

async function NotifyRemove(req, res) {
  try {
    const { product } = req.body; // Extract product from request body
    console.log(product, 'Received product from frontend');

    const user = req.user;

    if (!user || !user.email) {
      return res.status(400).send({ message: 'User information is missing' });
    }

    const userRecord = await Userschemadb.findOne({ email: user.email });

    if (!userRecord) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Remove the product from the "notify" list
    const updatedNotify = await Userschemadb.updateOne(
      { email: user.email },
      { $pull: { checknotify: { _id: product._id } } } // Target the product by its ID
    );

    if (updatedNotify.modifiedCount > 0) {
      return res.status(200).send({ message: 'Product successfully removed from notify list' });
    } else {
      return res.status(400).send({ message: 'Product not found in notify list' });
    }
  } catch (error) {
    console.error('Error removing product from notify:', error);
    return res.status(500).send({ message: 'Error removing product from notify list', error });
  }
}

module.exports = { NotifyRemove };
