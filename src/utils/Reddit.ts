import axios from "axios";
import { PostDbRow, RedditPost } from "../interfaces";

class Reddit {

  static getHot = async (subreddit: string, limit: number = 50) => {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    const response = await axios.get(url);
    const filtered = response.data.data.children.filter(
      (post: any) => post.data.domain === "i.redd.it" && !post.data.url.includes('gif')
    );
    return filtered.map((post: any) => {
      return {
        id: post.data.id,
        author: post.data.author,
        title: post.data.title,
        imgUrl: post.data.url
      } as RedditPost;
    }) as RedditPost[];
  }

  static getFresh = (posts: RedditPost[], prevPosts: PostDbRow[]) => {
    for(let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const prevPost = prevPosts.find(prevPost => prevPost.id === post.id);
      if(!prevPost) {
        return post;
      }
    }
    return null;
  }

}

export default Reddit;