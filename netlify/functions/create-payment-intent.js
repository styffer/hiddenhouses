const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, date, city, vibe, aspects } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 7999, // $79.99 in cents
      currency: 'usd',
      metadata: { name, birthDate: date, birthCity: city, vibe, aspects },
      shipping: { name, address: { country: 'US' } },
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
