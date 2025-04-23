import { NextResponse } from 'next/server';
import PayOS from '@payos/node';

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
);

export async function POST(request: Request) {
  try {
    const { orderId, amount, description } = await request.json();

    const paymentLink = await payos.createPaymentLink({
      orderCode: orderId,
      amount: amount,
      description: description,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    });

    return NextResponse.json({ 
      qrCode: paymentLink.qrCode,
      paymentLink: paymentLink.checkoutUrl 
    });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    );
  }
} 