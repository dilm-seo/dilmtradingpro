export interface RSSFeed {
  rss: {
    channel: {
      item: NewsItem[];
      title: string;
      description: string;
      lastBuildDate: string;
      link: string;
    };
  };
}