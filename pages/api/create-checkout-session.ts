import { stripe } from "../../utils/stripe";

import { getURL } from "../../utils/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createOrRetrieveCustomer } from "./webhooks";
import { createClient } from "@supabase/supabase-js";

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const supabaseAdmin = createServerSupabaseClient({ req, res });
    const supabaseServiceAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
    const {
      data: { session },
    } = await supabaseAdmin.auth.getSession();

    if (!session || !session.user) {
      return res.status(401).json({
        error: "not_authenticated",
        description:
          "The user does not have an active session or is not authenticated",
      });
    }

    // redirect user if necessary
    let { data: subscription, error: fetchSubscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("*)")
        .in("status", ["trialing", "active"])
        .eq("user_id", session?.user?.id)
        .single();

    if (subscription) {
      return res.status(406).json({
        message: "exists",
      });
    }

    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      const customer = await createOrRetrieveCustomer(
        {
          uuid: session?.user?.id || "",
          email: session?.user?.email || "",
        },
        supabaseServiceAdmin
      );

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer_update: { address: "auto", name: "auto" },
        customer,
        line_items: [
          {
            price: price,
            quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        subscription_data: {
          metadata,
        },
        success_url: `${getURL()}/account?subscribed=true`,
        cancel_url: `${getURL()}/account?subscribed=false`,
      });

      return res.status(200).json({ sessionId: stripeSession.id });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default createCheckoutSession;
