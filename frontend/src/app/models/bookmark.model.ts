export class Bookmark {
  constructor(
    public id :string,
    public video: {
      id: string;
      title: string;
    },
    public item: {
      id: string;
      title: string;
      descriptrion:string;
      subtitle:string;
    },
    public location: Number,
    public user: string,
    public created: Date,
    public thumbnail: string
  ) {}
}
