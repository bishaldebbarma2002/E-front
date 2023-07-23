import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Address } from "@/models/Address";

export default async function handle(req, res) {
  await mongooseConnect();
  try {
    const session = await getServerSession(req, res, authOptions);
    // console.log("Session:", session);
    if (!session || !session.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = session.user;
    // console.log("User:", user);

    if (req.method === "PUT") {
      const address = await Address.findOne({ userEmail: user.email });
      if (address) {
        res.json(await Address.findByIdAndUpdate(address._id, req.body));
      } else {
        res.json(await Address.create({ userEmail: user.email, ...req.body }));
      }
    }
    if (req.method === "GET") {
      const address = await Address.findOne({ userEmail: user.email });
      res.json(address);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
