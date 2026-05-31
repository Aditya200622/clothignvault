import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      email,
      customerName,
      orderId,
      status,
    } = req.body;

    console.log("EMAIL REQUEST:", {
      email,
      customerName,
      orderId,
      status,
    });

    const subject =
      status === "Shipped"
        ? `🚚 Your Order ${orderId} Has Been Shipped`
        : status === "Delivered"
        ? `✅ Your Order ${orderId} Has Been Delivered`
        : status === "Cancelled"
        ? `❌ Your Order ${orderId} Was Cancelled`
        : status === "Processing"
        ? `📦 Your Order ${orderId} Is Processing`
        : `📦 Order Update`;

    const result = await resend.emails.send({
      from: "ClothingVault <orders@clothingvault.in>",
      to: [email],
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto">
          
          <h1 style="color:#7c3aed">
            ClothingVault
          </h1>

          <h2>
            Hello ${customerName},
          </h2>

          <p>
            Your order has been updated.
          </p>

          <div
            style="
              background:#f5f5f5;
              padding:15px;
              border-radius:10px;
              margin:20px 0;
            "
          >
            <p>
              <strong>Order ID:</strong>
              ${orderId}
            </p>

            <p>
              <strong>Status:</strong>
              ${status}
            </p>
          </div>

          <p>
            Thank you for shopping with
            <strong>ClothingVault</strong>.
          </p>

          <p>
            We appreciate your order ❤️
          </p>

        </div>
      `,
    });

    console.log(
  "EMAIL RESULT FULL:",
  JSON.stringify(result, null, 2)
);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
  console.error(
    "EMAIL ERROR FULL:",
    JSON.stringify(error, null, 2)
  );

  return res.status(500).json({
    success: false,
    error: error?.message,
  });
}
}