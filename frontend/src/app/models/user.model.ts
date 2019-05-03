export class User {
  public id: string;
  public name: string;
  public role: string;
  public email: string;
  public provider: string;

  constructor() {
    this.id = "";
    this.name = "";
    this.role = "reader";
    this.email = "";
    this.provider = "";
  }
  toString() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      role: this.role
    });
  }
  getDisplayName() {
    return this.name != null ? this.name : this.email;
  }
}
