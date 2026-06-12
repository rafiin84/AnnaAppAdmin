export interface Squad {
  id: string
  name: string
  leader: string
  members: number
  missions: number
}

export interface Cluster {
  id: string
  name: string
  locality: string
  leader: string
  squads: Squad[]
  supporters: number
  missions: number
  peopleHelped: number
}

export interface Constituency {
  id: string
  name: string
  districtId: string
  supporters: number
  leaders: number
  missionsCompleted: number
  peopleHelped: number
  sevaiPoints: number
  growthPercentage: number
  clusters: Cluster[]
}

export interface District {
  id: string
  name: string
  constituencies: Constituency[]
  supporters: number
  leaders: number
  missions: number
  peopleHelped: number
  growth: number
}

function makeSquads(prefix: string, count: number): Squad[] {
  const leaders = ['Murugan','Selvam','Krishnan','Rajan','Kumar','Vijay','Balan','Senthil','Arun','Mani','Durai','Siva']
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-sq-${i + 1}`,
    name: `Squad ${i + 1}`,
    leader: leaders[i % leaders.length] + ' ' + ['R','K','S','M','V','P'][i % 6] + '.',
    members: 8 + Math.floor(Math.random() * 12),
    missions: 2 + Math.floor(Math.random() * 8),
  }))
}

function makeClusters(prefix: string, localities: string[]): Cluster[] {
  return localities.map((loc, i) => ({
    id: `${prefix}-cl-${i + 1}`,
    name: `${loc} Cluster`,
    locality: loc,
    leader: ['Annamalai','Thangavel','Periyasamy','Govindaraj','Subramanian','Natarajan','Palaniswamy','Veerasamy'][i % 8] + ' ' + ['K','S','P','R','V','M'][i % 6] + '.',
    squads: makeSquads(`${prefix}-cl-${i + 1}`, 4 + Math.floor(Math.random() * 3)),
    supporters: 200 + Math.floor(Math.random() * 800),
    missions: 5 + Math.floor(Math.random() * 20),
    peopleHelped: 50 + Math.floor(Math.random() * 500),
  }))
}

function makeConstituency(id: string, name: string, districtId: string, localities: string[]): Constituency {
  const supporters = 3000 + Math.floor(Math.random() * 12000)
  const clusters = makeClusters(id, localities)
  return {
    id,
    name,
    districtId,
    supporters,
    leaders: 20 + Math.floor(Math.random() * 80),
    missionsCompleted: 15 + Math.floor(Math.random() * 85),
    peopleHelped: 500 + Math.floor(Math.random() * 5000),
    sevaiPoints: supporters * (50 + Math.floor(Math.random() * 150)),
    growthPercentage: parseFloat((2 + Math.random() * 28).toFixed(1)),
    clusters,
  }
}

// ─── DISTRICTS + CONSTITUENCIES ──────────────────────────────────────────────

const rawData: Array<{ id: string; name: string; constituencies: Array<{ id: string; name: string; localities: string[] }> }> = [
  {
    id: 'CHE',
    name: 'Chennai',
    constituencies: [
      { id: 'CHE-001', name: 'Harbour', localities: ['Royapuram','Tondiarpet','Tiruvottiyur North','Basin Bridge','Kasimedu'] },
      { id: 'CHE-002', name: 'Chepauk-Thiruvallikeni', localities: ['Chepauk','Triplicane','Thiruvallikeni','Ice House','Presidency College Area'] },
      { id: 'CHE-003', name: 'Royapuram', localities: ['Royapuram Market','Flower Bazaar','Park Town','George Town','Broadway'] },
      { id: 'CHE-004', name: 'Tiruvottiyur', localities: ['Tiruvottiyur','Kathivakkam','Ennore','Manali New Town','Wimco Nagar'] },
      { id: 'CHE-005', name: 'Dr Radhakrishnan Nagar', localities: ['Thiruvotriyur North','Madhavaram','Periyar Nagar','Kolathur North','Redhills'] },
      { id: 'CHE-006', name: 'Perambur', localities: ['Perambur','Purasawalkam','Kellys','Aminjikarai','Chetpet'] },
      { id: 'CHE-007', name: 'Kolathur', localities: ['Kolathur','Villivakkam North','Madhavaram South','Puzhal','Manali'] },
      { id: 'CHE-008', name: 'Villivakkam', localities: ['Villivakkam','Perambur North','Shenoy Nagar','Ayyavoo Naidu Colony','Flower Bazaar'] },
      { id: 'CHE-009', name: 'Thiru Vi Ka Nagar', localities: ['Thiru Vi Ka Nagar','Otteri','Vepery','Kilpauk','Chetpet'] },
      { id: 'CHE-010', name: 'Egmore', localities: ['Egmore','Nungambakkam','Thousand Lights West','Vepery','Park Town'] },
      { id: 'CHE-011', name: 'Thousand Lights', localities: ['Thousand Lights','Nungambakkam South','Greams Road','Gemini','Anna Salai'] },
      { id: 'CHE-012', name: 'Anna Nagar', localities: ['Anna Nagar East','Anna Nagar West','Anna Nagar Tower','Kilpauk Garden','Arumbakkam'] },
      { id: 'CHE-013', name: 'Virugambakkam', localities: ['Virugambakkam','Vadapalani','Kodambakkam','Saligramam','Ashok Nagar'] },
      { id: 'CHE-014', name: 'Saidapet', localities: ['Saidapet','Guindy','K.K.Nagar','Ashok Nagar South','St Thomas Mount'] },
      { id: 'CHE-015', name: 'Velachery', localities: ['Velachery North','Velachery South','Medavakkam','Perumbakkam','Sholinganallur'] },
      { id: 'CHE-016', name: 'Mylapore', localities: ['Mylapore Tank Area','Mandaveli','R.A.Puram','Abhiramapuram','Alwarpet'] },
    ],
  },
  {
    id: 'COI',
    name: 'Coimbatore',
    constituencies: [
      { id: 'COI-001', name: 'Pollachi', localities: ['Pollachi North','Pollachi South','Anaimalai','Valparai','Udumalaipettai'] },
      { id: 'COI-002', name: 'Coimbatore North', localities: ['Peelamedu','Gandhipuram','Town Hall','Ukkadam','Kavundampalayam'] },
      { id: 'COI-003', name: 'Thondamuthur', localities: ['Thondamuthur','Madukkarai','Vellalore','Kovilpalayam','Irugur'] },
      { id: 'COI-004', name: 'Coimbatore South', localities: ['RS Puram','Saibaba Colony','Ramnagar','Ramanathapuram','Peelamedu South'] },
      { id: 'COI-005', name: 'Singanallur', localities: ['Singanallur','Nehru Nagar','Kurichi','Ondipudur','Eachanari'] },
      { id: 'COI-006', name: 'Kinathukadavu', localities: ['Kinathukadavu','Palladam','Tirupur East','Avinashi','Komattipalayam'] },
      { id: 'COI-007', name: 'Mettupalayam', localities: ['Mettupalayam','Karamadai','Talavadi','Coonoor','Gudalur'] },
      { id: 'COI-008', name: 'Sulur', localities: ['Sulur','Malumichampatti','Chettipalayam','Annur','Alandurai'] },
      { id: 'COI-009', name: 'Kavundampalayam', localities: ['Kavundampalayam','Coimbatore North East','Vadavalli','Velandipalayam','Saravanampatty'] },
      { id: 'COI-010', name: 'Kuniyamuthur', localities: ['Kuniyamuthur','Podanur','Perur','Kalveerampalayam','Thudiyalur'] },
    ],
  },
  {
    id: 'MAD',
    name: 'Madurai',
    constituencies: [
      { id: 'MAD-001', name: 'Sholavandan', localities: ['Sholavandan','Vadipatti','Usilampatti','T Kallupatti','Chellampatti'] },
      { id: 'MAD-002', name: 'Thirparankundram', localities: ['Thiruparankundram','Palamedu','Madurai South','Anaiyur','Tiruvedagam'] },
      { id: 'MAD-003', name: 'Madurai East', localities: ['Mattuthavani','Goripalayam','Tallakulam','Renganathapuram','Bibikulam'] },
      { id: 'MAD-004', name: 'Madurai Central', localities: ['Town Hall','Kamarajar Salai','Anna Nagar Madurai','Arapalayam','Bibikulam'] },
      { id: 'MAD-005', name: 'Madurai North', localities: ['KK Nagar Madurai','Vilangudi','Nagamalai Pudukottai','Simmakkal','Arappalayam'] },
      { id: 'MAD-006', name: 'Madurai South', localities: ['Paravai','Arasaradi','Koodal Nagar','Narimedu','Alagar Kovil Road'] },
      { id: 'MAD-007', name: 'Madurai West', localities: ['Iyer Bungalow','Kochadai','Marungapuri','Thirunagar','Meenakshi Nagar'] },
      { id: 'MAD-008', name: 'Melur', localities: ['Melur','Manamadurai','Alaganallur','Thiruvedagam','Sirugudi'] },
      { id: 'MAD-009', name: 'Vathalagundu', localities: ['Vathalagundu','Dindigul East','Nilakottai','Natham','Oddanchatram'] },
    ],
  },
  {
    id: 'SAL',
    name: 'Salem',
    constituencies: [
      { id: 'SAL-001', name: 'Omalur', localities: ['Omalur','Mecheri','Mettur','Edappadi','Sankari'] },
      { id: 'SAL-002', name: 'Salem West', localities: ['Hasthampatti','Shevapet','Salem Junction','Ammapet','Kondalampatti'] },
      { id: 'SAL-003', name: 'Salem North', localities: ['Alagapuram','Steel Plant Area','Mettur Dam','Rasipuram','Tiruchengode'] },
      { id: 'SAL-004', name: 'Salem South', localities: ['Swarnapuri','Suramangalam','Kitchipalayam','Karuppur','Elampillai'] },
      { id: 'SAL-005', name: 'Attur', localities: ['Attur','Gangavalli','Yercaud','Thalaivasal','Vazhapadi'] },
      { id: 'SAL-006', name: 'Veerapandi', localities: ['Veerapandi','Sengattupatti','Thalaivasal','Kolli Hills','Namagiripettai'] },
      { id: 'SAL-007', name: 'Rasipuram', localities: ['Rasipuram','Paramathi Velur','Mohanur','Tiruchengode South','Vennandur'] },
      { id: 'SAL-008', name: 'Tiruchengode', localities: ['Tiruchengode','Namakkal','Komarapalayam','Erode East','Bhavani'] },
    ],
  },
  {
    id: 'TRI',
    name: 'Tiruchirappalli',
    constituencies: [
      { id: 'TRI-001', name: 'Srirangam', localities: ['Srirangam','Thiruvanaikaval','Uraiyur','Ariyamangalam','Kottapattu'] },
      { id: 'TRI-002', name: 'Tiruchirappalli West', localities: ['Bharathidasan University Area','Palpannai','Woraiyur','Tennur','Thillai Nagar'] },
      { id: 'TRI-003', name: 'Tiruchirappalli East', localities: ['Puthur','Cantonment','Teppakulam','Ariyamangalam','Crawford'] },
      { id: 'TRI-004', name: 'Thiruverumbur', localities: ['Thiruverumbur','BHEL Nagar','Samayapuram','Manikandam','Kaithavalam'] },
      { id: 'TRI-005', name: 'Lalgudi', localities: ['Lalgudi','Musiri','Thottiyam','Kulithalai','Uppiliapuram'] },
      { id: 'TRI-006', name: 'Manapparai', localities: ['Manapparai','Marungapuri','Pullambadi','Vaiyampatti','Thottiyam'] },
      { id: 'TRI-007', name: 'Peravurani', localities: ['Peravurani','Pattukkottai','Aranthangi','Gandarakottai','Mimisal'] },
      { id: 'TRI-008', name: 'Musiri', localities: ['Musiri','Thuraiyur','Sendurai','Ariyalur','Andimadam'] },
    ],
  },
  {
    id: 'VEL',
    name: 'Vellore',
    constituencies: [
      { id: 'VEL-001', name: 'Katpadi', localities: ['Katpadi','Ranipet','Arcot','Arakkonam','Sholingur'] },
      { id: 'VEL-002', name: 'Vellore', localities: ['Vellore Fort','Gandhi Nagar Vellore','Sathuvachari','Bagayam','Alamelumangapuram'] },
      { id: 'VEL-003', name: 'Anaikattu', localities: ['Anaikattu','Gudiyatham','Jolarpet','Ambur','Vaniyambadi'] },
      { id: 'VEL-004', name: 'Kilvaithinankuppam', localities: ['Kilvaithinankuppam','Pallikonda','Melalathur','Natrampalli','Tirupathur'] },
      { id: 'VEL-005', name: 'Ranipet', localities: ['Ranipet North','Ranipet South','Arcot','Walajapet','Sholingur'] },
      { id: 'VEL-006', name: 'Arakkonam', localities: ['Arakkonam','Kanchipuram East','Cheyyar','Tiruvannamalai West','Polur'] },
    ],
  },
  {
    id: 'TAN',
    name: 'Thanjavur',
    constituencies: [
      { id: 'TAN-001', name: 'Papanasam', localities: ['Papanasam','Kumbakonam','Thiruvidaimaruthur','Sirkazhi','Mayiladuthurai'] },
      { id: 'TAN-002', name: 'Thiruvaiyaru', localities: ['Thiruvaiyaru','Pattukottai','Thanjavur East','Budalur','Orathanaadu'] },
      { id: 'TAN-003', name: 'Thanjavur', localities: ['Thanjavur North','Thanjavur South','Medical College Area','Srinivasa Nagar TJ','Hospital Road'] },
      { id: 'TAN-004', name: 'Orathanadu', localities: ['Orathanadu','Peravurani','Pattukkottai North','Aranthangi East','Mimisal'] },
      { id: 'TAN-005', name: 'Kumbakonam', localities: ['Kumbakonam North','Kumbakonam South','Papanasam West','Thiruvidaimaruthur North','Sakkottai'] },
      { id: 'TAN-006', name: 'Thiruthuraipoondi', localities: ['Thiruthuraipoondi','Vedaranyam','Nagapattinam','Muthupettai','Kollidam'] },
    ],
  },
  {
    id: 'TIR',
    name: 'Tirunelveli',
    constituencies: [
      { id: 'TIR-001', name: 'Palayamkottai', localities: ['Palayamkottai','Tirunelveli Junction','Melapalayam','Pettai','Perumalpuram'] },
      { id: 'TIR-002', name: 'Tirunelveli', localities: ['Tirunelveli East','Tirunelveli West','Vannarpettai','Krishnapuram','Bagyam'] },
      { id: 'TIR-003', name: 'Ambasamudram', localities: ['Ambasamudram','Cheranmahadevi','Tenkasi','Kadayanallur','Sankarankovil'] },
      { id: 'TIR-004', name: 'Nanguneri', localities: ['Nanguneri','Radhapuram','Thisayanvilai','Cheranmahadevi','Alangulam'] },
      { id: 'TIR-005', name: 'Sankarankovil', localities: ['Sankarankovil','Srivaikundam','Kovilpatti','Kayalpatnam','Ettayapuram'] },
    ],
  },
  {
    id: 'ERT',
    name: 'Erode',
    constituencies: [
      { id: 'ERT-001', name: 'Erode East', localities: ['Erode East','Four Roads','Surampatti','Kasipalayam','Lakkapuram'] },
      { id: 'ERT-002', name: 'Erode West', localities: ['Erode West','Thindal','Veerappanchatiram','Bhavani','Anthiyur'] },
      { id: 'ERT-003', name: 'Perundurai', localities: ['Perundurai','Kodumudi','Nambiyur','Gobichettipalayam','Sathyamangalam'] },
      { id: 'ERT-004', name: 'Modakurichi', localities: ['Modakurichi','Kavundampalayam Erode','Vijayamangalam','Chithode','Ingur'] },
      { id: 'ERT-005', name: 'Bhavani', localities: ['Bhavani','Bhavani Sagar','Ingur','Chitode','Vellode'] },
      { id: 'ERT-006', name: 'Anthiyur', localities: ['Anthiyur','Gobichettipalayam West','Thalavadi','Sathyamangalam West','Hasanur'] },
    ],
  },
  {
    id: 'DIN',
    name: 'Dindigul',
    constituencies: [
      { id: 'DIN-001', name: 'Dindigul', localities: ['Dindigul East','Dindigul West','Srinivasa Nagar DG','Gandhiji Nagar','Thanakankulam'] },
      { id: 'DIN-002', name: 'Natham', localities: ['Natham','Nilakottai','Chinnalapatti','Vedasandur','Palani'] },
      { id: 'DIN-003', name: 'Palani', localities: ['Palani Town','Oddanchatram','Batlagundu','Vadamadurai','Kodaikanal'] },
      { id: 'DIN-004', name: 'Athoor', localities: ['Athoor','Gujiliamparai','Kannivadi','Reddiyarchatram','Sriramapuram'] },
    ],
  },
  {
    id: 'KAN',
    name: 'Kancheepuram',
    constituencies: [
      { id: 'KAN-001', name: 'Kancheepuram', localities: ['Kancheepuram North','Kancheepuram South','Sriperumbudur','Uthiramerur','Padalam'] },
      { id: 'KAN-002', name: 'Alandur', localities: ['Alandur','Adambakkam','Perungalathur','Tambaram West','Pammal'] },
      { id: 'KAN-003', name: 'Tambaram', localities: ['Tambaram East','Tambaram West','Chromepet','Pallavaram','Selaiyur'] },
      { id: 'KAN-004', name: 'Pallavaram', localities: ['Pallavaram','Nanganallur','Kovur','Kundrathur','Porur'] },
      { id: 'KAN-005', name: 'Chengalpattu', localities: ['Chengalpattu Town','Thiruporur','Madurantakam','Vandalur','Tirukalukundram'] },
    ],
  },
  {
    id: 'CVR',
    name: 'Cuddalore',
    constituencies: [
      { id: 'CVR-001', name: 'Cuddalore', localities: ['Cuddalore Old Town','Cuddalore Port','SIPCOT Area','Thiruvanthipuram','Vadalur'] },
      { id: 'CVR-002', name: 'Chidambaram', localities: ['Chidambaram','Kattumannarkoil','Sirkali','Sirkazhi','Kollidam'] },
      { id: 'CVR-003', name: 'Panruti', localities: ['Panruti','Virudhachalam','Neyveli','Tittagudi','Mangalur'] },
      { id: 'CVR-004', name: 'Bhuvanagiri', localities: ['Bhuvanagiri','Kurinjipadi','Marakkanam','Tindivanam','Vikravandi'] },
    ],
  },
  {
    id: 'THO',
    name: 'Thoothukudi',
    constituencies: [
      { id: 'THO-001', name: 'Thoothukudi', localities: ['Thoothukudi Port','Toovipuram','VOC Nagar','Millerpuram','Bryant Nagar'] },
      { id: 'THO-002', name: 'Kovilpatti', localities: ['Kovilpatti','Ettayapuram','Vilathikulam','Ottapidaram','Karunkulam'] },
      { id: 'THO-003', name: 'Tiruchendur', localities: ['Tiruchendur','Srivaikundam','Kayalpatnam','Manapad','Mutton'] },
      { id: 'THO-004', name: 'Vilathikulam', localities: ['Vilathikulam','Sathankulam','Eral','Thisayanvilai','Valliyur'] },
    ],
  },
  {
    id: 'VIR',
    name: 'Virudhunagar',
    constituencies: [
      { id: 'VIR-001', name: 'Virudhunagar', localities: ['Virudhunagar Town','Srivilliputhur','Rajapalayam','Sivakasi','Aruppukkottai'] },
      { id: 'VIR-002', name: 'Sivakasi', localities: ['Sivakasi','Sattur','Watrap','Srivilliputhur South','Vembakottai'] },
      { id: 'VIR-003', name: 'Rajapalayam', localities: ['Rajapalayam','Kariapatti','Tiruvengadam','Krishnankoil','Narikudi'] },
      { id: 'VIR-004', name: 'Aruppukkottai', localities: ['Aruppukkottai','Keelakarai','Paramakudi','Tiruvadanai','Kamudi'] },
    ],
  },
  {
    id: 'RAM',
    name: 'Ramanathapuram',
    constituencies: [
      { id: 'RAM-001', name: 'Ramanathapuram', localities: ['Ramanathapuram Town','Mandapam','Rameswaram','Pamban','Thiruvadanai'] },
      { id: 'RAM-002', name: 'Paramakudi', localities: ['Paramakudi','Mudhukulathur','Kamuthi','Bogalur','Keelakarai'] },
      { id: 'RAM-003', name: 'Tiruvadanai', localities: ['Tiruvadanai','Uchipuli','Tondi','Thiruppullani','Abiramam'] },
    ],
  },
  {
    id: 'SIV',
    name: 'Sivaganga',
    constituencies: [
      { id: 'SIV-001', name: 'Sivaganga', localities: ['Sivaganga Town','Kalaiyarkoil','Karaikudi','Tirupathur SG','Ilayangudi'] },
      { id: 'SIV-002', name: 'Karaikudi', localities: ['Karaikudi','Devakottai','Manamadurai','Kallal','Mudukulathur'] },
      { id: 'SIV-003', name: 'Manamadurai', localities: ['Manamadurai','Tirupuvanam','Singampunari','Kallupatti','Koppaiyaampatti'] },
    ],
  },
  {
    id: 'PUD',
    name: 'Pudukottai',
    constituencies: [
      { id: 'PUD-001', name: 'Pudukottai', localities: ['Pudukottai Town','Alangudi','Aranthangi','Gandarvakottai','Ponnamaravathi'] },
      { id: 'PUD-002', name: 'Thirumayam', localities: ['Thirumayam','Iluppur','Viralimalai','Annavasal','Karambakudi'] },
      { id: 'PUD-003', name: 'Aranthangi', localities: ['Aranthangi','Avudayarkoil','Manamelkudi','Mimisal West','Peravurani'] },
    ],
  },
  {
    id: 'NAG',
    name: 'Nagapattinam',
    constituencies: [
      { id: 'NAG-001', name: 'Nagapattinam', localities: ['Nagapattinam Town','Nagore','Velankanni','Keevalur','Tharangambadi'] },
      { id: 'NAG-002', name: 'Kilvelur', localities: ['Kilvelur','Vedaranyam','Koradacheri','Thiruthuraipoondi','Muthupettai'] },
      { id: 'NAG-003', name: 'Vedaranyam', localities: ['Vedaranyam','Point Calimere','Poonakayal','Tiruvarur West','Nannilam'] },
    ],
  },
  {
    id: 'TVR',
    name: 'Tiruvarur',
    constituencies: [
      { id: 'TVR-001', name: 'Tiruvarur', localities: ['Tiruvarur Town','Needamangalam','Mannargudi','Papanasam TVR','Koradacheri'] },
      { id: 'TVR-002', name: 'Mannargudi', localities: ['Mannargudi','Thiruthuraipoondi East','Papanasam East','Peravurani West','Kollidam East'] },
      { id: 'TVR-003', name: 'Nannilam', localities: ['Nannilam','Sirkali South','Mayiladuthurai South','Sirkazhi East','Sembanarkoil'] },
    ],
  },
  {
    id: 'MAY',
    name: 'Mayiladuthurai',
    constituencies: [
      { id: 'MAY-001', name: 'Mayiladuthurai', localities: ['Mayiladuthurai Town','Sirkali','Sirkazhi','Sembanarkoil','Tharangambadi'] },
      { id: 'MAY-002', name: 'Poompuhar', localities: ['Poompuhar','Chidambaram East','Kattumannarkoil East','Keevalur West','Bhuvanagiri'] },
    ],
  },
  {
    id: 'KAR',
    name: 'Karur',
    constituencies: [
      { id: 'KAR-001', name: 'Karur', localities: ['Karur Town','Krishnarayapuram','Kulithalai','Manapparai','Aravakurichi'] },
      { id: 'KAR-002', name: 'Aravakurichi', localities: ['Aravakurichi','Thogaimalai','Vangal','Pugalur','Nangavaram'] },
      { id: 'KAR-003', name: 'Krishnarayapuram', localities: ['Krishnarayapuram','Uppidamangalam','Kadavur','Pallapatti','Karur West'] },
    ],
  },
  {
    id: 'PRM',
    name: 'Perambalur',
    constituencies: [
      { id: 'PRM-001', name: 'Perambalur', localities: ['Perambalur Town','Ariyalur East','Veppanthattai','Labbaikudikadu','Kunnam'] },
      { id: 'PRM-002', name: 'Kunnam', localities: ['Kunnam','Ulundurpet','Sankarapuram','Karunapuram','Keeranur'] },
    ],
  },
  {
    id: 'ARY',
    name: 'Ariyalur',
    constituencies: [
      { id: 'ARY-001', name: 'Ariyalur', localities: ['Ariyalur Town','Udayarpalayam','Andimadam','Thirumanur','Sendurai'] },
      { id: 'ARY-002', name: 'Jayankondam', localities: ['Jayankondam','Sendurai East','Thirumanur South','Veppanthattai West','T Palur'] },
    ],
  },
  {
    id: 'KAL',
    name: 'Kallakurichi',
    constituencies: [
      { id: 'KAL-001', name: 'Kallakurichi', localities: ['Kallakurichi','Sankarapuram','Ulundurpet','Chinnasalem','Tirukoilur'] },
      { id: 'KAL-002', name: 'Ulundurpet', localities: ['Ulundurpet','Rishivandiyam','Thirukoilur East','Tittakudi South','Mylambadi'] },
      { id: 'KAL-003', name: 'Tirukoilur', localities: ['Tirukoilur','Chinnasalem North','Vikravandi West','Sankarapuram East','Mangalur'] },
    ],
  },
  {
    id: 'VIL',
    name: 'Villupuram',
    constituencies: [
      { id: 'VIL-001', name: 'Villupuram', localities: ['Villupuram Town','Vikravandi','Tindivanam','Markanam','Marakkanam'] },
      { id: 'VIL-002', name: 'Vanur', localities: ['Vanur','Marakanam','Tindivanam South','Mailam','Gingee'] },
      { id: 'VIL-003', name: 'Gingee', localities: ['Gingee','Mailam','Viluppuram East','Tiruvannamalai East','Vandavasi'] },
      { id: 'VIL-004', name: 'Tindivanam', localities: ['Tindivanam','Madurantakam West','Chengalpattu East','Pondicherry Border','Melmalayanur'] },
    ],
  },
  {
    id: 'TVA',
    name: 'Tiruvannamalai',
    constituencies: [
      { id: 'TVA-001', name: 'Tiruvannamalai', localities: ['Tiruvannamalai Town','Polur','Arani','Vembakkam','Cheyyar North'] },
      { id: 'TVA-002', name: 'Cheyyar', localities: ['Cheyyar','Vandavasi','Arani South','Chetpet TVA','Kalasapakkam'] },
      { id: 'TVA-003', name: 'Polur', localities: ['Polur','Javadhu Hills','Tiruvannamalai West','Arani North','Thandrampet'] },
      { id: 'TVA-004', name: 'Arani', localities: ['Arani','Cheyyar East','Vandavasi North','Arcot South','Walajah'] },
    ],
  },
  {
    id: 'DHM',
    name: 'Dharmapuri',
    constituencies: [
      { id: 'DHM-001', name: 'Dharmapuri', localities: ['Dharmapuri Town','Harur','Pennagaram','Pappireddipatti','Nallampalli'] },
      { id: 'DHM-002', name: 'Palacode', localities: ['Palacode','Karimangalam','Pennagaram East','Morappur','Bargur'] },
      { id: 'DHM-003', name: 'Harur', localities: ['Harur','Hosur East','Kelamangalam','Royakottah','Uthangarai'] },
    ],
  },
  {
    id: 'KRI',
    name: 'Krishnagiri',
    constituencies: [
      { id: 'KRI-001', name: 'Krishnagiri', localities: ['Krishnagiri Town','Hosur','Pochampalli','Bargur South','Kaveripattinam'] },
      { id: 'KRI-002', name: 'Hosur', localities: ['Hosur','Mathigiri','Rayakotta','Shoolagiri','Denkanikotta'] },
      { id: 'KRI-003', name: 'Veppanahalli', localities: ['Veppanahalli','Kaveripattinam East','Krishnagiri East','Nagojanahalli','Berigai'] },
    ],
  },
  {
    id: 'NAM',
    name: 'Namakkal',
    constituencies: [
      { id: 'NAM-001', name: 'Namakkal', localities: ['Namakkal Town','Rasipuram North','Senthamangalam','Velur','Tiruchengode'] },
      { id: 'NAM-002', name: 'Paramathi Velur', localities: ['Paramathi','Velur','Mohanur East','Mallasamudram','Namakkal North'] },
      { id: 'NAM-003', name: 'Kolli Hills', localities: ['Kolli Hills','Sankaridurg','Tiruchengode East','Jedarpalayam','Kabilarmalai'] },
    ],
  },
  {
    id: 'NIL',
    name: 'Nilgiris',
    constituencies: [
      { id: 'NIL-001', name: 'Ooty', localities: ['Udhagamandalam','Wellington','Fingerpost','Lovedale','Fern Hill'] },
      { id: 'NIL-002', name: 'Coonoor', localities: ['Coonoor','Kotagiri','Gudalur','Masinagudi','Pandalur'] },
      { id: 'NIL-003', name: 'Gudalur', localities: ['Gudalur','Panthaloor','Devala','Theppakadu','Mudumalai'] },
    ],
  },
  {
    id: 'THP',
    name: 'Theni',
    constituencies: [
      { id: 'THP-001', name: 'Theni', localities: ['Theni Town','Andipatti','Periyakulam','Uthamapalayam','Bodinayakanur'] },
      { id: 'THP-002', name: 'Bodinayakanur', localities: ['Bodinayakanur','Cumbum','Uthamapalayam West','Gudalur Theni','Periyakulam East'] },
      { id: 'THP-003', name: 'Periyakulam', localities: ['Periyakulam','Megamalai','Thekkady','Thevaram','Chinnamanur'] },
    ],
  },
  {
    id: 'TPR',
    name: 'Tiruppur',
    constituencies: [
      { id: 'TPR-001', name: 'Tiruppur North', localities: ['Tiruppur North','Kangeyam','Dharapuram','Udumalaipettai','Ootacamund Road'] },
      { id: 'TPR-002', name: 'Tiruppur South', localities: ['Tiruppur South','Palladam','Avinashi East','Annur South','Nambiyur'] },
      { id: 'TPR-003', name: 'Kangeyam', localities: ['Kangeyam','Kodumudi East','Dharapuram East','Mulanur','Vellakoil'] },
      { id: 'TPR-004', name: 'Dharapuram', localities: ['Dharapuram','Palani East','Udumalaipettai West','Gomangalam','Elayamuthur'] },
    ],
  },
  {
    id: 'TVL',
    name: 'Tiruvallur',
    constituencies: [
      { id: 'TVL-001', name: 'Gummidipoondi', localities: ['Gummidipoondi','Ponneri','Redhills','Minjur','Puzhal'] },
      { id: 'TVL-002', name: 'Poonamallee', localities: ['Poonamallee','Thirumazhisai','Avadi','Tiruvallur Town','Ambattur'] },
      { id: 'TVL-003', name: 'Avadi', localities: ['Avadi','Tiruvallur South','Thiruninravur','Kadambathur','Pallipattu'] },
      { id: 'TVL-004', name: 'Ambattur', localities: ['Ambattur','Madhavaram South','Annanur','Thiruvallur East','Maduravoyal North'] },
      { id: 'TVL-005', name: 'Tiruttani', localities: ['Tiruttani','Sholingur East','Arakkonam East','Nemili','Putlur'] },
    ],
  },
  {
    id: 'RAN',
    name: 'Ranipet',
    constituencies: [
      { id: 'RAN-001', name: 'Arcot', localities: ['Arcot','Walajapet','Ranipet South','Sholingur South','Nemili East'] },
      { id: 'RAN-002', name: 'Walajah', localities: ['Walajah','Arcot East','Arakkonam West','Kaveripakkam','Melvisharam'] },
      { id: 'RAN-003', name: 'Arani', localities: ['Arani Ranipet','Timiri','Valavanur','Arcot South','Melvisharam East'] },
    ],
  },
  {
    id: 'TPA',
    name: 'Tirupathur',
    constituencies: [
      { id: 'TPA-001', name: 'Tirupathur', localities: ['Tirupathur Town','Natrampalli','Ambur East','Vaniyambadi East','Gudiyatham South'] },
      { id: 'TPA-002', name: 'Ambur', localities: ['Ambur','Jolarpet South','Vaniyambadi','Pernambut','Gudiyatham'] },
    ],
  },
  {
    id: 'KNY',
    name: 'Kanyakumari',
    constituencies: [
      { id: 'KNY-001', name: 'Nagercoil', localities: ['Nagercoil Town','Kottar','Colachel','Marthandam','Padmanabhapuram'] },
      { id: 'KNY-002', name: 'Padmanabhapuram', localities: ['Padmanabhapuram','Thuckalay','Kuzhithurai','Vilavancode','Killiyoor'] },
      { id: 'KNY-003', name: 'Colachal', localities: ['Colachel','Manavalakurichi','Thovalai','Agastheeswaram','Killiyoor South'] },
      { id: 'KNY-004', name: 'Killiyoor', localities: ['Killiyoor','Rajakkamangalam','Boothapandi','Eraniel','Kalkulam'] },
    ],
  },
  {
    id: 'TNK',
    name: 'Tenkasi',
    constituencies: [
      { id: 'TNK-001', name: 'Tenkasi', localities: ['Tenkasi Town','Kadayanallur','Alangulam','Sankarankovil South','Shencottah'] },
      { id: 'TNK-002', name: 'Shencottah', localities: ['Shencottah','Kadayanallur East','Veerakeralampudur','Radhapuram West','Pavoorchatram'] },
      { id: 'TNK-003', name: 'Alangulam', localities: ['Alangulam','Puliyankudi','Tenkasi East','Kuruvikulam','Senkottai'] },
    ],
  },
  {
    id: 'CHP',
    name: 'Chengalpattu',
    constituencies: [
      { id: 'CHP-001', name: 'Chengalpattu', localities: ['Chengalpattu Town','Thiruporur','Madurantakam West','Vandalur South','Tirukalukundram East'] },
      { id: 'CHP-002', name: 'Thiruporur', localities: ['Thiruporur','Sholinganallur East','Perungudi','Old Mahabalipuram Road','Kelambakkam'] },
      { id: 'CHP-003', name: 'Maduranthakam', localities: ['Madurantakam','Lathur','Cheyyur','Kalpakkam','Uthiramerur West'] },
      { id: 'CHP-004', name: 'Vandalur', localities: ['Vandalur','Perungalathur West','Guduvanchery','Urapakkam','Tambaram East'] },
    ],
  },
]

// Build full district list
export const districts: District[] = rawData.map(d => {
  const constituencies = d.constituencies.map(c =>
    makeConstituency(c.id, c.name, d.id, c.localities)
  )
  const totals = constituencies.reduce(
    (acc, c) => ({
      supporters: acc.supporters + c.supporters,
      leaders: acc.leaders + c.leaders,
      missions: acc.missions + c.missionsCompleted,
      peopleHelped: acc.peopleHelped + c.peopleHelped,
    }),
    { supporters: 0, leaders: 0, missions: 0, peopleHelped: 0 }
  )
  return {
    id: d.id,
    name: d.name,
    constituencies,
    ...totals,
    growth: parseFloat((3 + Math.random() * 25).toFixed(1)),
  }
})

export const getAllConstituencies = (): Constituency[] =>
  districts.flatMap(d => d.constituencies)

export const getAllClusters = (): Cluster[] =>
  getAllConstituencies().flatMap(c => c.clusters)

export const getAllSquads = (): Squad[] =>
  getAllClusters().flatMap(c => c.squads)

export const getDistrictById = (id: string): District | undefined =>
  districts.find(d => d.id === id)

export const getConstituencyById = (id: string): Constituency | undefined =>
  getAllConstituencies().find(c => c.id === id)

export const totalStats = districts.reduce(
  (acc, d) => ({
    supporters: acc.supporters + d.supporters,
    leaders: acc.leaders + d.leaders,
    missions: acc.missions + d.missions,
    peopleHelped: acc.peopleHelped + d.peopleHelped,
  }),
  { supporters: 0, leaders: 0, missions: 0, peopleHelped: 0 }
)
