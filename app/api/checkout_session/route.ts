import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth' // ⬅️ আপনার Better Auth এর instance (ফাইল পাথ চেক করে নিন)

export async function POST(req: Request) {
  try {
    // ১. Better Auth থেকে সেশন নেওয়া (try ব্লকের ভেতরে)
    const session = await auth.api.getSession({
      headers: await headers()
    })

    // ২. ফ্রন্টএন্ড থেকে ডেটা নেওয়া
    const body = await req.json()
    const { amount, serviceName } = body

    // ৩. Stripe Checkout Session তৈরি
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
      // ⬇️ ইউজারের ইমেইল এখানে বসানো হলো (যদি সেশন থাকে)
      customer_email: session?.user?.email || undefined,
      
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment?canceled=true`,
    });

    // ৪. URL রিটার্ন করা
    return NextResponse.json({ url: stripeSession.url });

  } catch (err: any) {
    console.error("Stripe API Error:", err.message) 
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}