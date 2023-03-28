import { stripe } from "../../utils/stripe";
import { getURL } from "../../utils/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createOrRetrieveCustomer } from "./webhooks";

const createPortalLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const supabaseAdmin = createServerSupabaseClient({ req, res });
    const {
      data: { session },
    } = await supabaseAdmin.auth.getSession();
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser();

    if (error)
      return res.status(401).json({
        error: "not_authenticated",
        description:
          "The user does not have an active session or is not authenticated",
      });

    try {
      if (!user) throw Error("Could not get user");
      const customer = await createOrRetrieveCustomer(
        {
          uuid: user.id || "",
          email: user.email || "",
        },
        supabaseAdmin
      );

      if (!customer) throw Error("Could not get customer");
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/account`,
      });

      return res.status(200).json({ url });
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

export default createPortalLink;
