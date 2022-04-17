import { AccountRepositoryLoginResponseLogged_in_user, IgApiClient } from "instagram-private-api";
import { RedditPost, UserTag } from "../interfaces";


class Instagram {

  client: IgApiClient;

  user: string;
  password: string;

  account: AccountRepositoryLoginResponseLogged_in_user | null = null;

  static constantHash = "#memes #dank #funnymemes #comedy #dankmemes #edgymeme #reddit #triggered";

  static freshHashtags = [
    `#dankmemedaily #dailydankmemes #dankmemez #dankmemes420 #funnymemez #dankmemesunited ${this.constantHash}`,
    `#legendarymemes #memethatcurecancer #underratedmemes #mirrormemez #hillariousmemes ${this.constantHash}`,
    `#freshmemess #freshmemesyoulike #edgymemez #freshmemedaily #memeworld #memelords ${this.constantHash}`,
  ]

  static coderHashtags = [
    `#sysadmin #developer #coder #nerd #programmer #engineer #gamer #entrepreneur #devops #developers_team #developersteam #geek #tech #software #developers #helloworld`,
    `#programming #coding #programmer #developer #code #technology #codinglife #softwaredeveloper #linux #programmers #developers #bhfyp`,
    `#coder #python #javascript #java #computerscience #webdeveloper #tech #html #software #webdevelopment #css`
  ]

  static promoUsers: UserTag[] = [
    {
      user_id: 29896860359,
      position: [0.3, 0.5]
    },
    {
      user_id: 30482059719,
      position: [0.7, 0.5]
    }
  ];

  static contadorHashtag = 0;

  constructor(user: string, pass: string) {
    this.client = new IgApiClient()
    this.user = user;
    this.password = pass;
  }

  init = async () => {
    this.client.state.generateDevice(this.user);
    await this.client.simulate.preLoginFlow();
    this.account = await this.client.account.login(this.user, this.password); 
  }

  generateCaption = (meme: RedditPost) => {
    if (this.user === process.env.USER_fresh) {
      Instagram.contadorHashtag++;
      return `${meme.title}
  Follow: @${this.user}
  Follow: @${this.user}
  .
  .
  Credit: /u/${meme.author}
  .
  .
  ${Instagram.freshHashtags[Instagram.contadorHashtag % Instagram.freshHashtags.length]}`;
    } else if (this.user === process.env.USER_coder) {
      Instagram.contadorHashtag++;
      return `${meme.title}
  Follow: @${this.user}
  Follow: @${this.user}
  .
  .
  Credit: /u/${meme.author}
  .
  .
  ${Instagram.coderHashtags[Instagram.contadorHashtag % Instagram.coderHashtags.length]}`;
    } else {
      return `${meme.title}
  Follow: @${this.user}
  Follow: @${this.user}
  .
  .
  Credit: /u/${meme.author}
  .
  .`;
    }
    
  }


  publish = async (imgPath: Buffer, caption: string) => {
    try {
      await this.client.publish.photo({
        file: imgPath,
        caption: caption,
        usertags: {
          in: Instagram.promoUsers
        }
      });
      console.log(`✅[publish]: Successfully published ${caption}`);
    } 
    catch (e) {
      console.log(e);
    }
  }


}

export default Instagram;