import { db } from "../database/database.connection.js";
import { ObjectId } from "mongodb";

export async function addToCart(req, res) {
  const { name, picture, price } = req.body;
  const { id } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const meteorite = db.collection("products").findOne({_id: new ObjectId(id)});
    if(!meteorite) return res.sendStatus(409);

    const meteoriteCart = await db.collection("cart").findOne({name: name, token: token});
    if(meteoriteCart) return res.status(409).send("This item is already in your cart.");

    await db.collection("cart").insertOne({name, picture, price, id, token});
    return res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.response);
  }
};

export async function deleteItemFromCart(req, res) {
  const { name } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    await db.collection("cart").deleteOne({name: name, token: token})
    res.status(200).send("Item deleted successfully")
  } catch (err) {
    res.status(500).send(err.response)
  }
}