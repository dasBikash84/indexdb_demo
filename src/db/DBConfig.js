export const DBConfig = {
  name: "Bdtickets_web",
  version: 1,
  objectStoresMeta: [
    {
      store: "district",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "title", keypath: "title", options: { unique: true } },
        { name: "titleBn", keypath: "titleBn", options: { unique: true } },
        { name: "to", keypath: "to", options: { unique: false } },
      ],
    },
    {
      store: "station",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "title", keypath: "title", options: { unique: false } },
        { name: "titleBn", keypath: "titleBn", options: { unique: false } },
        { name: "shortCode", keypath: "shortCode", options: { unique: false } },
        {
          name: "travelModeName",
          keypath: "travelModeName",
          options: { unique: false },
        },
        {
          name: "districtId",
          keypath: "districtId",
          options: { unique: false },
        },
        { name: "district", keypath: "district", options: { unique: false } },
        { name: "to", keypath: "to", options: { unique: false } },
      ],
    },
  ],
};

/*
   District(
        int id, {
        String? title,
        String? titleBn,
        Set<int> to = const {},
      }
    )
    Station(
        int id, {
        String? title,
        String? titleBn,
        District? district,
        String? travelModeName,
        String? shortCode,
        Set<int> to = const {},
      }
    )
  */
