import type { NowRequest, NowResponse } from "@vercel/node";
import { admin } from "./_firebase";

const { firestore } = admin;

export default async function (req: NowRequest, res: NowResponse) {
  const { blogID } = req.query;

  try {
    const doc = firestore().doc(`data/${blogID}`);
    const docGet = await doc.get();

    if (!docGet.exists) {
      // Create doc
      doc.set({ love: 0, unicorn: 0, starry: 0 });
      return void res.json({ love: 0, unicorn: 0, starry: 0 });
    }

    const data = docGet.data();

    return void res.json(data);
  } catch (e) {
    console.log(e);
  }
}
