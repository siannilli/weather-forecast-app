export class Location {
  lat: string;
  lon: string;
}

export class City {
  name: string;
  region: string;
  country: string;
  location: Location;

  toString(): string {
    return `${this.name}, ${this.country} - ${this.region}`;
  }
}
