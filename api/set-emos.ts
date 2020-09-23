import type { NowRequest, NowResponse } from "@vercel/node";
import { admin } from "./_firebase";

const { firestore } = admin;

export default async function (req: NowRequest, res: NowResponse) {
  let { blogID, love, unicorn, starry } = req.body;

  // @ts-ignore
  [love, unicorn, starry] = [+love, +unicorn, +starry];

  try {
    const doc = firestore().doc(`data/${blogID}`);

    await doc.set(
      {
        love,
        unicorn,
        starry,
      },
      { merge: true }
    );

    res.send("success");
    return;
  } catch (e) {
    console.log(e);
    res.send("fail");
  }
}
