const bacteriaList = [
  {
    id: "escherichia-coli",
    name: "Escherichia coli",
    scientificName: "Escherichia coli",
    image: require("../assets/images/bacteria/escherichia-coli.png"),
    description:
      "Escherichia coli (E. coli) is a type of bacteria that normally lives in the intestines of people and animals. While most strains are harmless, some can cause serious food poisoning and other infections.",
    type: "Gram-negative",
    shape: "Rod-shaped",
    transmission: [
      "Contaminated food or water",
      "Contact with infected animals",
      "Person-to-person contact",
      "Poor hygiene practices",
    ],
    symptoms: [
      "Severe stomach cramps",
      "Diarrhea (often bloody)",
      "Vomiting",
      "Fever (usually not very high)",
      "Dehydration",
      "Fatigue",
    ],
    prevention: [
      { icon: "wash", text: "Wash hands thoroughly with soap and water" },
      { icon: "cook", text: "Cook meat thoroughly to safe temperatures" },
      { icon: "clean", text: "Wash fruits and vegetables before eating" },
      { icon: "water", text: "Drink only pasteurized milk and juices" },
    ],
    treatment:
      "Most E. coli infections resolve on their own within 5-7 days. Treatment focuses on managing symptoms and preventing dehydration. Antibiotics are generally not recommended as they may increase the risk of complications. In severe cases, hospitalization may be required for intravenous fluids and supportive care.",
  },
  {
    id: "salmonella",
    name: "Salmonella",
    scientificName: "Salmonella enterica",
    image: require("../assets/images/bacteria/salmonella.png"),
    description:
      "Salmonella is a group of bacteria that can cause foodborne illness. There are many different types of Salmonella bacteria, and they can cause a range of illnesses from mild gastroenteritis to severe systemic infections.",
    type: "Gram-negative",
    shape: "Rod-shaped",
    transmission: [
      "Contaminated food (especially eggs, poultry, and dairy)",
      "Contact with infected animals",
      "Person-to-person contact",
      "Contaminated water",
    ],
    symptoms: [
      "Diarrhea",
      "Fever",
      "Abdominal cramps",
      "Nausea and vomiting",
      "Headache",
      "Dehydration",
    ],
    prevention: [
      { icon: "cook", text: "Cook poultry, eggs, and meat thoroughly" },
      { icon: "wash", text: "Wash hands after handling raw meat or eggs" },
      { icon: "clean", text: "Clean kitchen surfaces and utensils properly" },
      { icon: "store", text: "Refrigerate food promptly and properly" },
    ],
    treatment:
      "Most cases of Salmonella infection resolve on their own within 4-7 days. Treatment focuses on preventing dehydration by drinking plenty of fluids. In severe cases, antibiotics may be prescribed. Hospitalization may be necessary for severe cases or for people at high risk of complications.",
  },
  // ... Add other bacteria with similar structure ...
];

export default bacteriaList;
