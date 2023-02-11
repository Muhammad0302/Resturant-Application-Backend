require("dotenv").config();
const db = require("../models");
const stripe = require("stripe")(process.env.CLIENT_STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

exports.getStripeAccount = async function (req, res) {
  try {
    const { id, email } = req.body;
    let user = await db.users.findOne({ where: { id: id } });
    if (!user.accountId) {
      const stripeAccount = await createStripeProviderAccount(
        user.id,
        email,
        res
      );
      console.log("stripe account", stripeAccount);
      await db.users.update(
        { accountId: stripeAccount.id },
        { where: { id: id } }
      );
      user = await db.users.findOne({ where: { id: id } });
    }
    const link = await createStripeProviderAccountLink(user.accountId, res);
    if (link) {
      res.status(200).send({ url: link.url });
    }
  } catch (err) {
    res.status(503).send({ success: false, message: "Server Error." });
  }
};

const createStripeProviderAccount = async (providerId, email, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US" || undefined,
      email: email || undefined,
      business_type: "individual",
      individual: {
        first_name: "mark" || undefined,
        last_name: "Joe" || undefined,
      },
      metadata: { providerId },
    });
    return account;
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};


const createStripeProviderAccountLink = async (accountId, res) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: `http://www.rezzlist.com/RefreshPage`,
      return_url: `http://www.rezzlist.com/ReturnPage`,
    });
    console.log("accountLink", accountLink);
    return accountLink;
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};


exports.createTransfer = async (userAccount,price) => {
    try{
      const transfer = await stripe.transfers.create({
        amount: price*100,
        currency: "usd",
        destination: userAccount,
        transfer_group: "{ORDER11}",
      });
      if (transfer) {
       return({
            success: true,
            message: "amount credited to Connected Account",
            transfer: transfer,
          });
      } else
       return({ success: false, message: "amount cannot be credited" });
    }catch(e){
      return({ success: false, message:e.message});
    }
    
  };
