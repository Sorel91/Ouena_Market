import { NextResponse } from "next/server";

type CheckoutBody = { amount: number; orderId: string; returnUrl: string; cancelUrl: string };

export async function POST(request: Request) {
  const body = await request.json() as CheckoutBody;
  const clientId = process.env.ORANGE_MONEY_CLIENT_ID;
  const clientSecret = process.env.ORANGE_MONEY_CLIENT_SECRET;
  const paymentUrl = process.env.ORANGE_MONEY_PAYMENT_URL;
  const merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;

  if (!clientId || !clientSecret || !paymentUrl || !merchantKey) {
    return NextResponse.json({ error: "Orange Money n’est pas encore configuré." }, { status: 503 });
  }
  if (!Number.isInteger(body.amount) || body.amount <= 0 || !body.orderId) {
    return NextResponse.json({ error: "Commande invalide." }, { status: 400 });
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenResponse = await fetch(process.env.ORANGE_MONEY_OAUTH_URL || "https://api.orange.com/oauth/v3/token", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: "grant_type=client_credentials",
  });
  if (!tokenResponse.ok) return NextResponse.json({ error: "Authentification Orange Money indisponible." }, { status: 502 });
  const token = await tokenResponse.json() as { access_token: string };

  const paymentResponse = await fetch(paymentUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ merchant_key: merchantKey, currency: "XOF", order_id: body.orderId, amount: body.amount, return_url: body.returnUrl, cancel_url: body.cancelUrl }),
  });
  const result = await paymentResponse.json().catch(() => ({}));
  if (!paymentResponse.ok) return NextResponse.json({ error: "Création du paiement Orange Money refusée." }, { status: 502 });
  return NextResponse.json(result);
}
