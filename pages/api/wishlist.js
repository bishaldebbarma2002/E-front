import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

export default async function handle(req, res) {
  try {
    console.log("Session:", req.session);
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user;

    if (!user) {
      const errorMessage = "You must be logged in to access the wishlist.";
      console.log("Error:", errorMessage);
      return res.status(401).json({ error: errorMessage });
    }

    if (req.method === "POST") {
      const { product } = req.body;
      const wishedDoc = await WishedProduct.findOne({
        userEmail: user.email,
        product,
      });
      if (wishedDoc) {
        await WishedProduct.findByIdAndDelete(wishedDoc._id);
        console.log("Wished product removed:", wishedDoc);
        res.json({ wishedDoc });
      } else {
        await WishedProduct.create({ userEmail: user.email, product });
        console.log("New wished product created:", product);
        res.json("created");
      }
    }

    if (req.method === "GET") {
      const wishedProducts = await WishedProduct.find({
        userEmail: user.email,
      }).populate("product");
      console.log("Wishlist items:", wishedProducts);
      res.json(wishedProducts);
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage = "You must be logged in to access the wishlist.";
      console.log("Error:", errorMessage);
      return res.status(401).json({ error: errorMessage });
    }
    console.error("Unhandled error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
