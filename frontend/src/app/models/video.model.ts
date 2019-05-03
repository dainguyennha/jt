export class Video {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public author: string,
    public duration: Float32Array
  ) {}
}
