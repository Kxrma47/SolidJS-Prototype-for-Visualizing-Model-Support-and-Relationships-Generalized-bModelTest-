export const exampleData = {
  models: [
    {
      id: "111111",
      support: 0.12,
      inHPD: true,
      label: "JC69"
    },
    {
      id: "121131",
      support: 0.28,
      inHPD: true,
      label: "TN93"
    },
    {
      id: "123456",
      support: 0.09,
      inHPD: false,
      label: "GTR"
    }
  ],
  links: [
    { source: "111111", target: "121131" },
    { source: "121131", target: "123456" }
  ]
};