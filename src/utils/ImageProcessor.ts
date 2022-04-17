import axios from 'axios';
import sharp from 'sharp'

class ImageProcessor {

  static downloadImg = async (url: string) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  }
  
  static resizeImg = async (imgIn: Buffer) => {
    const img = sharp(imgIn);
    img.resize({
      width: 1080,
      height: 1350,
      fit: 'contain',
      background: 'rgb(21, 29, 38, 1)'
    });
    img.toFormat('jpg');
    return await img.toBuffer();
  }

}

export default ImageProcessor;