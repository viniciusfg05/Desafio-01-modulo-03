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



export default function Home({posts}) {
  console.log(posts)
  return (
    <div className={styles.containerHome}>
      <div className={styles.contentHome}>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero fugit, inventore accusamus maiores eum commodi, perspiciatis, repellendus officia similique saepe iste labore odit distinctio illo fugiat totam ex vel a.
        </p>
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
      title: RichText.asText(post.data.title),
      author: RichText.asText(post.data.author),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '', 
      first_publication_date: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      })
  }
}

  // console.log(JSON.stringify(postsResponse, null, 2))
  return {
    props: {
      posts
    }
  }
};
