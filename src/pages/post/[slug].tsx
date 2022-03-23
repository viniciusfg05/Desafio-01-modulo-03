import Prismic from '@prismicio/client'
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { useState } from 'react';

import { getPrismicClient } from '../../services/prismic';

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  results: Post[];
}

  export default function Post( resultsPosts:PostProps ) {
    const formattedPost = resultsPosts.results.map(post => {
      // const readTime = getReadTime(post);
  
      return {
        ...post,
        data: {
          ...post.data,
        },
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
      };
    })

    const [ posts, setPosts ] = useState<Post[]>(formattedPost)

    return (
      <div>
        {posts.map(post => (
          <p>{post.first_publication_date}</p>
        ))}
      </div>
    )
  }

  export const getStaticPaths: GetStaticPaths = async () => {
    const prismic = getPrismicClient();
    const posts = await prismic.query([
      Prismic.Predicates.at('document.type', 'posts'),
    ]);
  
    const paths = posts.results.map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    });
  
    return {
      paths,
      fallback: true,
    };
  };

  export async function getStaticProps({ params, previewData }) {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {})


  const posts = {
    first_publication_date: response.first_publication_date,
    data: {
      title:  response.data.title,
      banner: {
        url: response.data.banner,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: RichText.asText(content.body),
        };
      }),
    }
  }

  return {  
    props: { resultsPosts: posts },
  }
};
