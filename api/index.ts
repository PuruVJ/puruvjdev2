import { NowRequest, NowResponse } from "@vercel/node";

export default async function (req: NowRequest, res: NowResponse) {
  res.send("Hello");
}
