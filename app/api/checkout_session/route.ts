import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    const body = await req.json()
    // ⬇️ appointmentId রিসিভ করা হলো
    const { amount, serviceName, appointmentId } = body

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'bdt', 
            product_data: {
              name: serviceName || 'Premium Hair Cut',
            },
            unit_amount: Number(amount) * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: session?.user?.email || undefined,
      
      metadata: {
        userId: session?.user?.id || "", 
        appointmentId: appointmentId || "" // ⬇️ মেটাডেটাতে আইডি পাঠানো হলো
      },

      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/payment?canceled=true`,
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (err: any) {
    console.error("Stripe API Error:", err.message) 
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}