import type { NextApiHandler } from "next";

type MethodsHelper =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH"
  | (string & Record<never, never>);

interface MethodNextApi {
  ({}: { [key in MethodsHelper]?: NextApiHandler }): NextApiHandler;
}

const methodMiddleware: MethodNextApi = (methods) => {
  const wrapper: NextApiHandler = async (req, res) => {
    const method = methods[req.method || "GET"];
    if (!method) return res.status(405).json({ methods: Object.keys(methods) });

    return method(req, res);
  };

  return wrapper;
};

export default methodMiddleware;
