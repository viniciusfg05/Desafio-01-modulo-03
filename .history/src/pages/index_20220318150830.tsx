import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}


interface Posttest {
  slug: string;
  title: string;
}

interface PostProps {
  posts: Posttest[];
}

export default function Home({posts}: PostProps) {
  

  return (

    

    <div className={styles.containerHome}>
      <div className={styles.contentHome}>

      { posts.map(post => (
        <p>{post.slug}</p>
      )) }


      </div>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['publication.title, publication.content']
  });

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.),
      }
  })

  console.log(JSON.stringify(postsResponse.results, null, 2))
  return {
    props: {
      posts
    }
  }
};
