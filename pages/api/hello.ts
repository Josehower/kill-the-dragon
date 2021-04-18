import { NextApiRequest, NextApiResponse } from 'next';

export default function myApi(req: NextApiRequest, res: NextApiResponse) {
  return res.send('hello');
}
