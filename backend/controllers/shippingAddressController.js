import ShippingModel from "../models/shippingAddressModel.js";

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

      isAddress.save();

      return res.status(201).send({
        success: true,
        message: "Addresses added successfully",
        address: isAddress,
      });
    } else {
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

//function to get shipping address
const getShippingAddress = async (req, res) => {
  try {
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

const editShippingAddress = async (req, res) => {
  try {
    const { user } = req.params;
    const { _id, fName, lName, address, city, state, pin, phone, landMark } =
      req.body;
    if (!user) {
      return res.status(400).send({
        message: "Please provide user",
        success: false,
        error: "Missing required field",
      });
    }
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

export { addShippingAddress, getShippingAddress, editShippingAddress };
