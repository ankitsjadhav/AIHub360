// pexels-api.d.ts
declare module 'pexels-api' {
  class PexelsApi {
    constructor(apiKey: string);
    searchPhotos(prompt: string, options: { per_page: number; size: string }): Promise<any>;
  }

  export = PexelsApi;
}