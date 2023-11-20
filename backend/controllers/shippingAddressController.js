// Import necessary model for shipping address management
import ShippingModel from "../models/shippingAddressModel.js";

/**
 * Controller function to add a new shipping address for a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const addShippingAddress = async (req, res) => {
  try {
    //get shipping address details from request body
    const {
      fName,
      lName,
      phone,
      address,
      landMark,
      state,
      pin,
      city,
      isPrimary,
    } = req.body;

    //get user id from params
    const user = req.params.user;

    //check if user already added address
    const isAddress = await ShippingModel.findOne({ user });

    if (isAddress) {
      // If the new address is set as primary, update existing primary address to false
      if (isPrimary === true) {
        const findPrimary = await ShippingModel.updateMany(
          { user, "addresses.isPrimary": true },
          { $set: { "addresses.$[item].isPrimary": false } },
          { arrayFilters: [{ "item.isPrimary": true }] }
        );
      }

      // Add the new address to the existing addresses
      isAddress.addresses.push({
        fName,
        lName,
        phone,
        address,
        landMark,
        state,
        pin,
        city,
        isPrimary,
      });

      // Save the updated document
      isAddress.save();

      return res.status(201).send({
        success: true,
        message: "Addresses added successfully",
        address: isAddress,
      });
    } else {
      // If no existing address, create a new document
      const newAddress = await new ShippingModel({
        user,
        addresses: {
          fName,
          lName,
          phone,
          address,
          landMark,
          state,
          pin,
          city,
          isPrimary,
        },
      });

      //save new shipping address to database
      await newAddress.save();

      return res.status(200).send({
        message: "Address saved successfully",
        success: true,
        address: newAddress,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Couldn't add shipping address",
      error,
    });
  }
};

/**
 * Function to get shipping addresses for a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getShippingAddress = async (req, res) => {
  try {
    // Get user id from params
    const { user } = req.params;

    //get shipping address from database
    const address = await ShippingModel.findOne({ user });
    // console.log(address);
    if (address) {
      return res.status(200).send({
        message: "Shipping address",
        success: true,
        address: address.addresses,
      });
    } else {
      return res.status(404).send({
        message: "Shipping address not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/**
 * Controller function to edit a shipping address for a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const editShippingAddress = async (req, res) => {
  try {
    //get user id from params
    const { user } = req.params;

    // Destructure updated address details from request body
    const {
      _id,
      fName,
      lName,
      address,
      city,
      state,
      pin,
      phone,
      landMark,
      isPrimary,
    } = req.body;

    // Check if user id is provided
    if (!user) {
      return res.status(400).send({
        message: "Please provide user",
        success: false,
        error: "Missing required field",
      });
    }
    // If the updated address is set as primary, update existing primary address to false
    if (isPrimary === true) {
      const findPrimary = await ShippingModel.updateMany(
        { user, "addresses.isPrimary": true },
        { $set: { "addresses.$[item].isPrimary": false } },
        { arrayFilters: [{ "item.isPrimary": true }] }
      );
    }

    // Update the shipping address
    const updatedAddress = await ShippingModel.findOneAndUpdate(
      { user, "addresses._id": _id },
      {
        $set: {
          "addresses.$.fName": fName,
          "addresses.$.lName": lName,
          "addresses.$.address": address,
          "addresses.$.city": city,
          "addresses.$.state": state,
          "addresses.$.pin": pin,
          "addresses.$.phone": phone,
          "addresses.$.landMark": landMark,
          "addresses.$.isPrimary": isPrimary,
        },
      },
      { new: true }
    );
    return res.status(201).send({
      message: "Address updated successfully",
      success: true,
      addresses: updatedAddress.addresses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// Export the functions for use in routes
export { addShippingAddress, getShippingAddress, editShippingAddress };
