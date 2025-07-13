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
  {
    id: "enterococcus-faecalis",
    name: "Enterococcus faecalis",
    scientificName: "Enterococcus faecalis",
    image: require("../assets/images/bacteria/enterococcus-faecalis.png"),
    description:
      "Enterococcus faecalis is a Gram-positive bacterium that is part of the normal intestinal flora in humans and animals. While generally harmless in healthy individuals, it can cause serious infections, particularly in hospital settings and in immunocompromised patients.",
    type: "Gram-positive",
    shape: "Cocci (spherical)",
    transmission: [
      "Person-to-person contact",
      "Contaminated medical devices",
      "Hospital-acquired infections",
      "Fecal-oral transmission",
      "Contaminated food or water",
    ],
    symptoms: [
      "Urinary tract infections",
      "Bacteremia (bloodstream infections)",
      "Endocarditis (heart valve infections)",
      "Intra-abdominal infections",
      "Wound infections",
      "Meningitis (rare)",
    ],
    prevention: [
      {
        icon: "wash",
        text: "Practice good hand hygiene, especially in healthcare settings",
      },
      { icon: "clean", text: "Proper sterilization of medical equipment" },
      { icon: "isolation", text: "Isolation protocols for infected patients" },
      {
        icon: "antibiotics",
        text: "Judicious use of antibiotics to prevent resistance",
      },
    ],
    treatment:
      "Treatment of Enterococcus faecalis infections can be challenging due to increasing antibiotic resistance. Vancomycin-resistant Enterococcus (VRE) is a major concern. Treatment typically involves combination antibiotic therapy, and the choice of antibiotics depends on susceptibility testing. In severe cases, surgical intervention may be required for abscess drainage or infected device removal.",
  },
  {
    id: "staphylococcus-saprophyticus",
    name: "Staphylococcus saprophyticus",
    scientificName: "Staphylococcus saprophyticus",
    image: require("../assets/images/bacteria/staphylococcus-saprophyticus.png"),
    description:
      "Staphylococcus saprophyticus is a Gram-positive bacterium that is a common cause of urinary tract infections, particularly in young sexually active women. It is part of the normal skin flora and is generally less pathogenic than other staphylococcal species.",
    type: "Gram-positive",
    shape: "Cocci (spherical)",
    transmission: [
      "Sexual activity",
      "Poor personal hygiene",
      "Contaminated surfaces",
      "Skin-to-skin contact",
      "Fecal contamination",
    ],
    symptoms: [
      "Frequent urination",
      "Burning sensation during urination",
      "Urgency to urinate",
      "Cloudy or bloody urine",
      "Lower abdominal pain",
      "Fever (in some cases)",
    ],
    prevention: [
      {
        icon: "wash",
        text: "Maintain good personal hygiene, especially after sexual activity",
      },
      { icon: "water", text: "Stay well-hydrated and urinate frequently" },
      {
        icon: "clean",
        text: "Wipe from front to back after using the bathroom",
      },
      {
        icon: "clothing",
        text: "Wear cotton underwear and avoid tight-fitting clothing",
      },
    ],
    treatment:
      "Staphylococcus saprophyticus is generally susceptible to common antibiotics used for urinary tract infections. Treatment typically involves a short course of antibiotics (3-7 days). However, antibiotic resistance is increasing, so susceptibility testing may be recommended. Drinking plenty of fluids and maintaining good hygiene practices are also important for recovery.",
  },
  {
    id: "staphylococcus-aureus",
    name: "Staphylococcus aureus",
    scientificName: "Staphylococcus aureus",
    image: require("../assets/images/bacteria/staphylococcus-aureus.png"),
    description:
      "Staphylococcus aureus is a Gram-positive bacterium that can cause a wide range of infections, from minor skin infections to life-threatening conditions. It is known for its ability to develop resistance to antibiotics, particularly methicillin-resistant S. aureus (MRSA).",
    type: "Gram-positive",
    shape: "Cocci (spherical)",
    transmission: [
      "Direct skin-to-skin contact",
      "Contaminated surfaces and objects",
      "Droplet transmission (coughing, sneezing)",
      "Healthcare settings (HA-MRSA)",
      "Community settings (CA-MRSA)",
    ],
    symptoms: [
      "Skin infections (boils, abscesses, cellulitis)",
      "Pneumonia",
      "Bloodstream infections (sepsis)",
      "Bone and joint infections",
      "Endocarditis (heart valve infections)",
      "Toxic shock syndrome",
    ],
    prevention: [
      { icon: "wash", text: "Frequent hand washing with soap and water" },
      { icon: "clean", text: "Keep wounds clean and covered until healed" },
      {
        icon: "personal",
        text: "Avoid sharing personal items (towels, razors)",
      },
      { icon: "antibiotics", text: "Complete prescribed antibiotic courses" },
    ],
    treatment:
      "Treatment depends on the type and severity of infection. Methicillin-susceptible S. aureus (MSSA) can be treated with beta-lactam antibiotics. MRSA requires alternative antibiotics like vancomycin, daptomycin, or linezolid. Severe infections may require surgical drainage and intravenous antibiotics. Prevention of resistance through proper antibiotic stewardship is crucial.",
  },
  {
    id: "enterobacter-hormaechei",
    name: "Enterobacter hormaechei",
    scientificName: "Enterobacter hormaechei",
    image: require("../assets/images/bacteria/enterobacter-hormaechei.png"),
    description:
      "Enterobacter hormaechei is a Gram-negative bacterium that belongs to the Enterobacteriaceae family. It is an emerging opportunistic pathogen that can cause various infections, particularly in healthcare settings and immunocompromised patients.",
    type: "Gram-negative",
    shape: "Rod-shaped",
    transmission: [
      "Person-to-person contact",
      "Contaminated medical devices",
      "Hospital-acquired infections",
      "Contaminated surfaces",
      "Fecal-oral transmission",
    ],
    symptoms: [
      "Urinary tract infections",
      "Bloodstream infections (sepsis)",
      "Respiratory tract infections",
      "Wound infections",
      "Intra-abdominal infections",
      "Meningitis (rare)",
    ],
    prevention: [
      { icon: "wash", text: "Strict hand hygiene in healthcare settings" },
      { icon: "clean", text: "Proper sterilization of medical equipment" },
      { icon: "isolation", text: "Contact precautions for infected patients" },
      {
        icon: "antibiotics",
        text: "Antibiotic stewardship to prevent resistance",
      },
    ],
    treatment:
      "Treatment of Enterobacter hormaechei infections can be challenging due to intrinsic and acquired antibiotic resistance. The bacterium is naturally resistant to ampicillin and first-generation cephalosporins. Treatment requires susceptibility testing and often involves carbapenems or newer beta-lactam/beta-lactamase inhibitor combinations. In severe cases, combination therapy may be necessary.",
  },
  {
    id: "klebsiella-pneumoniae",
    name: "Klebsiella pneumoniae",
    scientificName: "Klebsiella pneumoniae",
    image: require("../assets/images/bacteria/klebsiella-pneumoniae.png"),
    description:
      "Klebsiella pneumoniae is a Gram-negative bacterium that can cause various infections, particularly in healthcare settings. It is known for its ability to develop resistance to multiple antibiotics, making it a significant concern in modern medicine.",
    type: "Gram-negative",
    shape: "Rod-shaped",
    transmission: [
      "Person-to-person contact",
      "Contaminated medical equipment",
      "Hospital-acquired infections",
      "Respiratory droplets",
      "Contaminated surfaces",
    ],
    symptoms: [
      "Pneumonia (cough, fever, difficulty breathing)",
      "Urinary tract infections",
      "Bloodstream infections (sepsis)",
      "Wound infections",
      "Meningitis",
      "Liver abscesses",
    ],
    prevention: [
      {
        icon: "wash",
        text: "Strict hand hygiene protocols in healthcare settings",
      },
      { icon: "isolation", text: "Contact precautions for infected patients" },
      { icon: "clean", text: "Proper disinfection of medical equipment" },
      {
        icon: "antibiotics",
        text: "Antibiotic stewardship to prevent resistance",
      },
    ],
    treatment:
      "Treatment of Klebsiella pneumoniae infections is challenging due to high rates of antibiotic resistance, including carbapenem-resistant strains (CRKP). Treatment requires susceptibility testing and often involves combination therapy with newer antibiotics. In severe cases, surgical intervention may be necessary for abscess drainage or infected tissue removal.",
  },
  {
    id: "pseudomonas-aeruginosa",
    name: "Pseudomonas aeruginosa",
    scientificName: "Pseudomonas aeruginosa",
    image: require("../assets/images/bacteria/pseudomonas-aeruginosa.png"),
    description:
      "Pseudomonas aeruginosa is a Gram-negative bacterium that is a major opportunistic pathogen, particularly dangerous for immunocompromised patients. It is known for its remarkable ability to develop resistance to multiple antibiotics and its ability to survive in diverse environments.",
    type: "Gram-negative",
    shape: "Rod-shaped",
    transmission: [
      "Contaminated medical equipment",
      "Hospital-acquired infections",
      "Contaminated water sources",
      "Person-to-person contact",
      "Environmental exposure",
    ],
    symptoms: [
      "Pneumonia (especially in cystic fibrosis patients)",
      "Bloodstream infections (sepsis)",
      "Urinary tract infections",
      "Wound infections",
      "Ear infections (swimmer's ear)",
      "Eye infections",
    ],
    prevention: [
      {
        icon: "wash",
        text: "Strict hand hygiene and infection control protocols",
      },
      { icon: "clean", text: "Proper sterilization of medical equipment" },
      { icon: "water", text: "Avoid contaminated water sources" },
      { icon: "isolation", text: "Contact precautions for infected patients" },
    ],
    treatment:
      "Treatment of Pseudomonas aeruginosa infections is extremely challenging due to its intrinsic and acquired resistance to many antibiotics. It often requires combination therapy with agents like piperacillin-tazobactam, ceftazidime, or carbapenems. The bacterium can develop resistance during treatment, making susceptibility testing crucial. In severe cases, newer antibiotics like ceftolozane-tazobactam or ceftazidime-avibactam may be necessary.",
  },
  {
    id: "proteus-mirabilis",
    name: "Proteus mirabilis",
    scientificName: "Proteus mirabilis",
    image: require("../assets/images/bacteria/proteus-mirabilis.png"),
    description:
      "Proteus mirabilis is a Gram-negative bacterium that is a common cause of urinary tract infections and can form urinary stones. It is known for its characteristic swarming motility and its ability to produce urease, which can lead to the formation of struvite stones in the urinary tract.",
    type: "Gram-negative",
    shape: "Rod-shaped",
    transmission: [
      "Fecal-oral transmission",
      "Contaminated medical devices",
      "Hospital-acquired infections",
      "Person-to-person contact",
      "Contaminated surfaces",
    ],
    symptoms: [
      "Urinary tract infections",
      "Kidney stones (struvite stones)",
      "Bloodstream infections (sepsis)",
      "Wound infections",
      "Pneumonia",
      "Abdominal pain and discomfort",
    ],
    prevention: [
      { icon: "wash", text: "Maintain good personal hygiene" },
      { icon: "water", text: "Stay well-hydrated to prevent urinary stasis" },
      { icon: "clean", text: "Proper sterilization of urinary catheters" },
      { icon: "antibiotics", text: "Complete prescribed antibiotic courses" },
    ],
    treatment:
      "Treatment of Proteus mirabilis infections typically involves antibiotics such as cephalosporins, fluoroquinolones, or aminoglycosides. However, the bacterium can develop resistance to multiple antibiotics. For urinary stones caused by P. mirabilis, treatment may require surgical intervention in addition to antibiotics. Prevention of stone formation through adequate hydration and prompt treatment of UTIs is important.",
  },
];

export default bacteriaList;
