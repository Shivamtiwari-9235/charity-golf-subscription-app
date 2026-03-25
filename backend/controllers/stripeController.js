const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId } = req.body;
  const user = req.user;
  if (!user) { res.status(401); throw new Error('Authentication required'); }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`
  });
  res.json({ url: session.url });
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || !user.subscription?.stripeSubscriptionId) {
    res.status(400);
    throw new Error('No active subscription found');
  }

  await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
    cancel_at_period_end: true
  });

  user.subscription.status = 'cancelled';
  await user.save();

  res.json({ message: 'Subscription cancelled successfully' });
});

const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const session = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed':
      const email = session.customer_email;
      const user = await User.findOne({ email });
      if (user) {
        user.subscription = {
          plan: session.display_items?.[0]?.plan?.interval || 'monthly',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription
        };
        await user.save();
      }
      break;

    case 'invoice.payment_succeeded':
      // Handle successful payment
      const customerId = session.customer;
      const paidUser = await User.findOne({ 'subscription.stripeCustomerId': customerId });
      if (paidUser) {
        paidUser.subscription.status = 'active';
        paidUser.subscription.endDate = new Date(session.lines.data[0].period.end * 1000);
        await paidUser.save();
      }
      break;

    case 'invoice.payment_failed':
      // Handle failed payment
      const failedCustomerId = session.customer;
      const failedUser = await User.findOne({ 'subscription.stripeCustomerId': failedCustomerId });
      if (failedUser) {
        failedUser.subscription.status = 'expired';
        await failedUser.save();
      }
      break;

    case 'customer.subscription.updated':
      // Handle subscription updates
      const updatedCustomerId = session.customer;
      const updatedUser = await User.findOne({ 'subscription.stripeCustomerId': updatedCustomerId });
      if (updatedUser) {
        updatedUser.subscription.status = session.status;
        updatedUser.subscription.endDate = new Date(session.current_period_end * 1000);
        await updatedUser.save();
      }
      break;

    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const deletedCustomerId = session.customer;
      const deletedUser = await User.findOne({ 'subscription.stripeCustomerId': deletedCustomerId });
      if (deletedUser) {
        deletedUser.subscription.status = 'cancelled';
        await deletedUser.save();
      }
      break;
  }

  res.json({ received: true });
});

module.exports = { createCheckoutSession, cancelSubscription, handleWebhook };
