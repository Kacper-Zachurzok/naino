import {
  type NextApiRequest,
  type NextApiResponse,
  type NextApiHandler,
} from "next";
import type { TypeOf, ZodType } from "zod";

interface ZodNextApi {
  <BodySchema extends ZodType, QuerySchema extends ZodType>(
    input: { body?: BodySchema; query?: QuerySchema },
    NextApi: (
      req: NextApiRequest,
      res: NextApiResponse,
      input: { body: TypeOf<BodySchema>; query: TypeOf<QuerySchema> }
    ) => void
  ): NextApiHandler;
}

const zodMiddleware: ZodNextApi = (
  { body: bodySchema, query: querySchema },
  NextApi
) => {
  const wrapper: NextApiHandler = async (req, res) => {
    const { query, body } = req;

    const bodyValidation = bodySchema?.safeParse(JSON.parse(body));
    if (bodyValidation && !bodyValidation.success)
      return res.status(400).json({ errors: bodyValidation.error.issues });

    const queryValidation = querySchema?.safeParse(query);
    if (queryValidation && !queryValidation.success)
      return res.status(400).json({ errors: queryValidation.error.issues });

    return NextApi(req, res, {
      body: bodyValidation?.data,
      query: queryValidation?.data,
    });
  };
  return wrapper;
};

export default zodMiddleware;
