import BrickBond from "/client/product/i1.png";
import GrayPlaster from "/client/product/i2.png";
import TileAdhesive from "/client/product/i3.png";
import WallPutty from "/client/product/i4.png";
import Clay1 from "/client/product/i5.png";
import Clay2 from "/client/product/i5.png";

export const productList = [
  {
    id: 1,
    name: "white plaster",
    image: BrickBond,
    price: 20,
    available: true,
    mixing:
      "Pour 4 liters of clean water into a bucket. Empty the entire 25 kg bag of “Harithaweli” Ready Mix Plaster mix into the same bucket and mix it well for 5 minutes with the help of a hand mixer.",
    method:
      "It is necessary to wet the surface of the wall before applying the “Harithaweli” Ready Mix Plaster mixture. It can be applied by using a wooden plaster blade on the surface of the wall, and by means of a smooth and fine finish can be achieved. After 24 hours of application of “Harithaweli” Ready Mix plaster, make sure to sprinkle an adequate amount of water (water curing) on the surface twice a day for a minimum of two days. In order to plaster a 20 square feet (approximately) area with a thickness of 10mm, you may use a 25 kg “Harithaweli” Ready Mix plaster bag. The overall thickness should be at least 5mm and depends on the overall surface area of the wall.",
    storage:
      "Avoid wet and humid conditions. Store in a more storage-appropriate dry environment.",
  },
  {
    id: 2,
    name: "Ready Mix Plaster",
    image: GrayPlaster,
    price: 10,
    available: false,
  },
  {
    id: 3,
    name: "Tile mortar",
    image: TileAdhesive,
    price: 90,
    available: true,
  },
  { id: 4, name: "clay putty", image: WallPutty, price: 30, available: false },
  { id: 5, name: "clay Plaster", image: Clay1, price: 40, available: true },
  { id: 6, name: "wall putty", image: Clay2, price: 50, available: true },
  {
    id: 7,
    name: "Tile adhesive",
    image: TileAdhesive,
    price: 60,
    available: false,
  },
  { id: 8, name: "brick bond", image: WallPutty, price: 70, available: true },
  {
    id: 9,
    name: "titanium plaster",
    image: WallPutty,
    price: 80,
    available: false,
  },
  { id: 10, name: "titanium", image: WallPutty, price: 100, available: true },
  {
    id: 11,
    name: "clay terrazo floor mix",
    image: WallPutty,
    price: 110,
    available: false,
  },
  {
    id: 12,
    name: "Waterproof Plaster",
    image: WallPutty,
    price: 120,
    available: true,
  },
];
