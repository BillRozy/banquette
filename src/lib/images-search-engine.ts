import { load } from "cheerio";
import { writeFile } from "fs/promises";

const IMAGES_URI = "https://www.bing.com/images/search";

type ImageItem = {
  image: string | undefined;
  title: string;
};
type BingImgProps = {
  murl: string;
  t: string;
};
export default class ImagesSearchEngine {
  constructor() {}
  private static getRandomUserAgent() {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    ];
    const randomNumber = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomNumber];
  }
  private get defaultQueryParams(): URLSearchParams {
    return new URLSearchParams({
      sp: "-1",
      lq: "0",
      udm: "2",
      qft: "+filterui:aspect-square+filterui:imagesize-medium",
      orm: "IRFLTR",
    });
  }
  public async search(
    query: string,
    location: string,
    width: number = 600,
    height: number = 600
  ): Promise<ImageItem[]> {
    const params = this.defaultQueryParams;
    params.append("q", query);
    const response = await fetch(new URL(`?${params}`, IMAGES_URI), {
      method: "GET",
      headers: {
        "User-Agent": ImagesSearchEngine.getRandomUserAgent(),
      },
    });
    const body = await response.text();
    await writeFile("./document.html", body);
    const $ = load(body);
    const imagesResults: ImageItem[] = [];

    $(".imgpt a").each(function (i, el) {
      const itemPropsStr = $(this).attr("m");
      if (itemPropsStr) {
        const itemProps = JSON.parse(itemPropsStr ?? "") as BingImgProps;
        imagesResults.push({
          image: itemProps.murl,
          title: itemProps.t ?? "",
        });
      }
    });
    return imagesResults;
  }
}
