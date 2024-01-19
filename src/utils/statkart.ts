export type IMapTile = {
  name: string;
  url: string;
  attr: string;
};

export const maps: IMapTile[] = [
  {
    name: "Topografisk kart",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
    attr: '<a href="http://www.kartverket.no/">Kartverket</a>',
  },
  {
    name: "Grunnkart",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}",
    attr: '<a href="http://www.kartverket.no/">Kartverket</a>',
  },
  {
    name: "Terrengmodell",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=terreng_norgeskart&zoom={z}&x={x}&y={y}",
    attr: '<a href="http://www.kartverket.no/">Kartverket</a>',
  },
  {
    name: "Grått kart",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}",
    attr: '<a href="http://www.kartverket.no/">Kartverket</a>',
  },
  {
    name: "Enkelt kart",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=egk&zoom={z}&x={x}&y={y}'",
    attr: '<a href="http://www.kartverket.no/">Kartverket</a>',
  },
];
