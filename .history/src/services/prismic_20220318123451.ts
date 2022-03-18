import * as Prismic from '@prismicio/client'
import { DefaultClient } from '@prismicio/client/types/client';

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT, {
    req,
  });

  return prismic;
}
