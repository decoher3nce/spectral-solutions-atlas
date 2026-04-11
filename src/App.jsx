import { useState } from "react";

const DATA_SOURCES = [
  {
    category: "Multispectral Optical",
    sources: [
      { name: "Landsat 8/9", bands: "11 bands", res: "15-100m", revisit: "8 days", provider: "USGS/NASA", gee: true, free: true, key: "VNIR, SWIR, Thermal" },
      { name: "Sentinel-2A/B", bands: "13 bands", res: "10-60m", revisit: "5 days", provider: "ESA/Copernicus", gee: true, free: true, key: "VNIR, Red Edge, SWIR" },
      { name: "MODIS (Terra/Aqua)", bands: "36 bands", res: "250m-1km", revisit: "1-2 days", provider: "NASA", gee: true, free: true, key: "Vis-TIR, Ocean color" },
      { name: "VIIRS", bands: "22 bands", res: "375-750m", revisit: "Daily", provider: "NOAA", gee: true, free: true, key: "Vis-TIR, Day/Night Band" },
      { name: "ASTER", bands: "14 bands", res: "15-90m", revisit: "16 days", provider: "NASA/METI", gee: true, free: true, key: "VNIR, SWIR, TIR" },
      { name: "Planet SuperDove", bands: "8 bands", res: "3m", revisit: "Daily", provider: "Planet Labs", gee: false, free: false, key: "Vis, Red Edge, NIR" },
      { name: "Maxar WorldView-3", bands: "29 bands", res: "0.31m pan", revisit: "1 day", provider: "Maxar", gee: false, free: false, key: "VNIR, SWIR, CAVIS" },
    ]
  },
  {
    category: "Hyperspectral",
    sources: [
      { name: "EnMAP", bands: "242 bands", res: "30m", revisit: "27 days", provider: "DLR (Germany)", gee: false, free: true, key: "420-2450nm continuous" },
      { name: "PRISMA", bands: "240 bands", res: "30m", revisit: "29 days", provider: "ASI (Italy)", gee: false, free: true, key: "400-2500nm, VNIR+SWIR" },
      { name: "Planet Tanager-1", bands: "400+ bands", res: "30m", revisit: "Tasking", provider: "Planet/JPL", gee: false, free: false, key: "400-2500nm, CH₄/CO₂ detection" },
      { name: "Pixxel Firefly (6 sats)", bands: "150+ bands", res: "5m", revisit: "24-48hr", provider: "Pixxel", gee: false, free: false, key: "VNIR-SWIR, 5m HSI" },
      { name: "Wyvern Dragonette", bands: "120+ bands", res: "5m", revisit: "Tasking", provider: "Wyvern", gee: false, free: false, key: "400-1000nm" },
      { name: "Kuva Space Hyperfield", bands: "200+ bands", res: "25-50m", revisit: "Daily target", provider: "Kuva Space", gee: false, free: false, key: "Onboard AI processing" },
      { name: "DESIS (ISS)", bands: "235 bands", res: "30m", revisit: "Variable", provider: "DLR/Teledyne", gee: false, free: true, key: "400-1000nm VNIR" },
      { name: "CHIME (upcoming)", bands: "200+ bands", res: "20-30m", revisit: "10-12 days", provider: "ESA Copernicus", gee: false, free: true, key: "400-2500nm, operational 2028+" },
      { name: "SBG (upcoming)", bands: "200+ bands", res: "30m", revisit: "16 days", provider: "NASA", gee: false, free: true, key: "VSWIR + TIR, Surface Biology" },
      { name: "AVIRIS-NG (airborne)", bands: "424 bands", res: "0.3-4m", revisit: "Campaign", provider: "NASA/JPL", gee: false, free: true, key: "380-2510nm, airborne HSI" },
    ]
  },
  {
    category: "SAR / Radar",
    sources: [
      { name: "Sentinel-1", bands: "C-band", res: "5-20m", revisit: "6 days", provider: "ESA", gee: true, free: true, key: "C-band SAR, all-weather" },
      { name: "ALOS-2 PALSAR-2", bands: "L-band", res: "1-100m", revisit: "14 days", provider: "JAXA", gee: true, free: true, key: "L-band, forest penetration" },
      { name: "ICEYE", bands: "X-band", res: "<1m", revisit: "<24hr", provider: "ICEYE", gee: false, free: false, key: "X-band SAR constellation" },
      { name: "Capella Space", bands: "X-band", res: "0.3m", revisit: "<1hr", provider: "Capella", gee: false, free: false, key: "Highest-res commercial SAR" },
      { name: "Umbra", bands: "X-band", res: "0.16m", revisit: "Tasking", provider: "Umbra", gee: false, free: true, key: "Open data, ultra-high res" },
      { name: "NISAR (2025+)", bands: "L+S band", res: "3-10m", revisit: "12 days", provider: "NASA/ISRO", gee: false, free: true, key: "Dual-band InSAR, deformation" },
    ]
  },
  {
    category: "LiDAR / Elevation",
    sources: [
      { name: "GEDI (ISS)", bands: "1064nm laser", res: "25m footprint", revisit: "Variable", provider: "NASA", gee: true, free: true, key: "Forest canopy height, biomass" },
      { name: "ICESat-2/ATLAS", bands: "532nm photon", res: "11m footprint", revisit: "91 days", provider: "NASA", gee: true, free: true, key: "Ice sheets, sea level, canopy" },
      { name: "USGS 3DEP", bands: "Airborne LiDAR", res: "0.5-2m", revisit: "Baseline", provider: "USGS", gee: false, free: true, key: "Complete US topo, 2026 baseline" },
      { name: "Copernicus DEM GLO-30", bands: "TanDEM-X derived", res: "30m", revisit: "Static", provider: "ESA/DLR", gee: true, free: true, key: "Global DSM" },
    ]
  },
  {
    category: "Atmospheric / GHG",
    sources: [
      { name: "Sentinel-5P/TROPOMI", bands: "UV-SWIR spectrometer", res: "5.5x3.5km", revisit: "Daily", provider: "ESA", gee: true, free: true, key: "NO₂, CH₄, CO, O₃, SO₂" },
      { name: "OCO-2/3", bands: "NIR+SWIR", res: "1.3x2.3km", revisit: "16 days", provider: "NASA", gee: false, free: true, key: "Column CO₂" },
      { name: "GHGSat", bands: "SWIR spectrometer", res: "25m", revisit: "Tasking", provider: "GHGSat", gee: false, free: false, key: "Point-source CH₄ at 25m" },
      { name: "MethaneSAT", bands: "SWIR spectrometer", res: "100x400m", revisit: "Weekly regions", provider: "EDF", gee: false, free: true, key: "Area-wide CH₄ emissions" },
      { name: "CAMS (Copernicus)", bands: "Modeled/assimilated", res: "~40km", revisit: "Daily", provider: "ECMWF", gee: true, free: true, key: "Aerosol, reactive gases, GHG" },
      { name: "EarthCARE/ATLID", bands: "UV HSRL lidar", res: "~100m vert", revisit: "25 days", provider: "ESA/JAXA", gee: false, free: true, key: "Aerosol profiles, dust tracking" },
    ]
  },
  {
    category: "Thermal / Nighttime",
    sources: [
      { name: "ECOSTRESS (ISS)", bands: "5 TIR bands", res: "38x69m", revisit: "Variable", provider: "NASA/JPL", gee: true, free: true, key: "Plant evapotranspiration stress" },
      { name: "LSTM (upcoming)", bands: "TIR spectrometer", res: "50m", revisit: "1-3 days", provider: "ESA Copernicus", gee: false, free: true, key: "Land surface temp, 2028+" },
      { name: "VIIRS Day/Night Band", bands: "500-900nm", res: "750m", revisit: "Daily", provider: "NOAA", gee: true, free: true, key: "Nighttime lights, fire" },
      { name: "Landsat TIRS", bands: "2 TIR bands", res: "100m", revisit: "16 days", provider: "USGS", gee: true, free: true, key: "Land surface temperature" },
    ]
  },
  {
    category: "Ocean / Water",
    sources: [
      { name: "Sentinel-3 OLCI", bands: "21 bands", res: "300m", revisit: "<2 days", provider: "ESA", gee: true, free: true, key: "Ocean color, chlorophyll" },
      { name: "PACE/OCI", bands: "200+ bands", res: "1km", revisit: "1-2 days", provider: "NASA", gee: false, free: true, key: "Hyperspectral ocean color" },
      { name: "SWOT", bands: "Ka-band radar", res: "50-250m", revisit: "21 days", provider: "NASA/CNES", gee: false, free: true, key: "Surface water heights, ocean topo" },
      { name: "Allen Coral Atlas", bands: "Sentinel-2 derived", res: "5m", revisit: "Static composite", provider: "Vulcan/UQ", gee: true, free: true, key: "Coral reef mapping" },
      { name: "Global Fishing Watch", bands: "AIS + SAR fusion", res: "Varies", revisit: "Near-real-time", provider: "GFW", gee: true, free: true, key: "Vessel detection, dark fishing" },
    ]
  },
  {
    category: "Gravity / Geodetic",
    sources: [
      { name: "GRACE-FO", bands: "Microwave ranging", res: "~300km", revisit: "30 days", provider: "NASA/DLR", gee: true, free: true, key: "Mass change: water, ice, aquifers" },
      { name: "GNSS Networks", bands: "L-band signals", res: "Point", revisit: "Continuous", provider: "IGS/Various", gee: false, free: true, key: "Crustal deformation, water vapor" },
    ]
  },
  {
    category: "Derived / Fusion Products (GEE)",
    sources: [
      { name: "Global Forest Change", bands: "Landsat-derived", res: "30m", revisit: "Annual", provider: "Hansen/UMD", gee: true, free: true, key: "Tree cover loss 2000-present" },
      { name: "Dynamic World", bands: "Sentinel-2 derived", res: "10m", revisit: "~5 days", provider: "Google/WRI", gee: true, free: true, key: "Near-real-time land cover" },
      { name: "CHIRPS Precipitation", bands: "IR + gauge fusion", res: "~5km", revisit: "Daily", provider: "UCSB CHC", gee: true, free: true, key: "40+ year rainfall archive" },
      { name: "WorldPop", bands: "ML-estimated", res: "100m", revisit: "Annual", provider: "U Southampton", gee: true, free: true, key: "Population distribution" },
      { name: "Global Human Modification", bands: "Multi-source", res: "1km", revisit: "Snapshot", provider: "CSP", gee: true, free: true, key: "Cumulative human impact 0-1" },
      { name: "JRC Global Surface Water", bands: "Landsat-derived", res: "30m", revisit: "Monthly", provider: "EC JRC", gee: true, free: true, key: "32-year surface water dynamics" },
    ]
  }
];

const PROBLEMS = [
  { id: 1, name: "Climate Change Acceleration", domain: "Environment", severity: 10, desc: "Accelerating warming, tipping points approaching. Emissions tracking, carbon accounting, and adaptation planning remain inadequate at the granularity needed for action." },
  { id: 2, name: "Biodiversity Collapse", domain: "Environment", severity: 9, desc: "Sixth mass extinction underway. Species loss, habitat fragmentation, and ecosystem degradation outpacing monitoring and intervention capacity." },
  { id: 3, name: "Global Food Insecurity", domain: "Human", severity: 9, desc: "783M people undernourished. Climate shocks, conflict, and supply chain disruptions threaten food systems. Precision agriculture adoption lags in regions that need it most." },
  { id: 4, name: "Water Scarcity & Contamination", domain: "Resource", severity: 9, desc: "2.2B people lack safe drinking water. Groundwater depletion invisible from surface. Transboundary water conflicts intensifying." },
  { id: 5, name: "Forced Displacement & Migration", domain: "Human", severity: 8, desc: "120M+ displaced persons globally. Climate migration accelerating. Destination prediction and resource pre-positioning remain reactive, not anticipatory." },
  { id: 6, name: "Pandemic & Disease Emergence", domain: "Human", severity: 8, desc: "Zoonotic spillover risk increasing with deforestation and habitat encroachment. Disease surveillance in remote regions is minimal." },
  { id: 7, name: "Critical Mineral Scarcity", domain: "Resource", severity: 8, desc: "Energy transition demands lithium, cobalt, rare earths. Exploration is slow, environmentally destructive, and geopolitically concentrated." },
  { id: 8, name: "Methane & GHG Super-Emitters", domain: "Environment", severity: 9, desc: "Methane has 80x CO₂ warming potential over 20 years. Thousands of super-emitter sites operate unmonitored, unregulated, unreported." },
  { id: 9, name: "Ocean Ecosystem Degradation", domain: "Environment", severity: 8, desc: "Coral bleaching, overfishing, plastic pollution, ocean acidification. 70% of Earth's surface is ocean but <10% is effectively monitored." },
  { id: 10, name: "Extreme Weather & Disaster Response", domain: "Human", severity: 9, desc: "Wildfires, floods, cyclones increasing in frequency and intensity. Damage costs tripling per decade. Early warning systems still fail the most vulnerable." },
  { id: 11, name: "Urban Heat & Livability Crisis", domain: "Human", severity: 7, desc: "3.5B people in cities. Urban heat islands kill more than hurricanes. Heat exposure disproportionately affects informal settlements with zero adaptation." },
  { id: 12, name: "Soil Degradation & Desertification", domain: "Environment", severity: 8, desc: "33% of global soils degraded. Topsoil loss undermines food production and carbon sequestration. Soil health is the least-monitored environmental variable." },
  { id: 13, name: "Illegal Deforestation & Land Use", domain: "Environment", severity: 8, desc: "4.7M hectares of tropical forest lost annually. Supply chain regulations (EU EUDR) need near-real-time verification at scale." },
  { id: 14, name: "Infrastructure Decay & Failure", domain: "Resource", severity: 7, desc: "Aging bridges, dams, pipelines across developed world. Subsidence, corrosion, and deformation go undetected until catastrophic failure." },
  { id: 15, name: "Energy Poverty & Transition Equity", domain: "Human", severity: 8, desc: "600M in Sub-Saharan Africa lack electricity. Renewable siting, grid planning, and energy access mapping are inadequate." },
  { id: 16, name: "Conflict & Humanitarian Crisis", domain: "Human", severity: 9, desc: "More active wars than since WWII. 1 in 7 people live under conflict threat. Damage assessment, displacement tracking, and aid logistics are overwhelmed." },
  { id: 17, name: "Antibiotic Resistance Spread", domain: "Human", severity: 7, desc: "AMR projected to cause 10M deaths/year by 2050. Pharmaceutical runoff and agricultural antibiotic use spread resistance genes through water systems." },
  { id: 18, name: "Wildfire Regime Shift", domain: "Environment", severity: 8, desc: "Fire seasons now year-round. Fuel loads, drought, and ignition sources compound. Post-fire erosion and debris flows create cascading hazards." },
  { id: 19, name: "Supply Chain Opacity", domain: "Resource", severity: 7, desc: "Deforestation-linked commodities, forced labor, conflict minerals flow through opaque global supply chains. Traceability at origin remains a gap." },
  { id: 20, name: "Glacial Retreat & Sea Level Rise", domain: "Environment", severity: 9, desc: "Glaciers feeding 2B people's water supply are retreating. Sea level rise threatens 1B in coastal zones. Ice mass loss acceleration poorly constrained." },
  { id: 21, name: "Permafrost Thaw & Carbon Feedback", domain: "Environment", severity: 8, desc: "Permafrost contains 1,500 Gt of carbon — twice the atmosphere. Thaw is accelerating non-linearly, releasing CO₂ and methane. Ground deformation destroys Arctic infrastructure." },
  { id: 22, name: "Freshwater Ecosystem Collapse", domain: "Environment", severity: 7, desc: "Freshwater biodiversity declining 83% since 1970. Rivers, lakes, and wetlands face pollution, damming, and over-extraction. Monitoring coverage is minimal outside wealthy nations." },
  { id: 23, name: "Illegal Mining & Artisanal Extraction", domain: "Resource", severity: 7, desc: "Unregulated gold, cobalt, and sand mining devastates ecosystems, poisons watersheds with mercury, and funds armed groups. 40M+ artisanal miners operate with zero oversight." },
  { id: 24, name: "Coastal Erosion & Land Loss", domain: "Environment", severity: 7, desc: "24% of sandy beaches eroding globally. Delta subsidence, sea level rise, and dam-reduced sediment supply compound the problem. 1B people live in low-elevation coastal zones." },
  { id: 25, name: "Air Quality & Particulate Pollution", domain: "Human", severity: 8, desc: "Air pollution kills 7M annually. PM2.5 and NO₂ exposure is highly unequal. Ground monitoring networks are sparse in the Global South where exposure is worst." },
  { id: 26, name: "Invasive Species Proliferation", domain: "Environment", severity: 7, desc: "Invasive species cost $423B/year globally. They transform ecosystems, outcompete natives, and alter fire regimes. Detection typically occurs years after establishment." },
  { id: 27, name: "Fisheries Collapse & IUU Fishing", domain: "Resource", severity: 8, desc: "34% of fish stocks overfished. Illegal, unreported, and unregulated fishing accounts for 20% of global catch. Dark vessels evade AIS tracking across vast ocean areas." },
  { id: 28, name: "Nuclear & Industrial Legacy Contamination", domain: "Resource", severity: 6, desc: "Thousands of legacy contamination sites from Cold War nuclear programs, industrial waste, and mining. Subsurface plume migration is invisible from the surface without specialized monitoring." },
  { id: 29, name: "Agricultural Water Waste & Irrigation Loss", domain: "Resource", severity: 7, desc: "Agriculture uses 70% of freshwater withdrawals. Flood irrigation wastes 50%+ of water. Precision irrigation adoption is <5% in regions with greatest water stress." },
  { id: 30, name: "Forced & Child Labor in Supply Chains", domain: "Human", severity: 8, desc: "50M people in modern slavery, 160M children in child labor. Agricultural commodities — cocoa, cotton, palm oil — are highest risk. Verification at farm level is nearly impossible at scale." },
  { id: 31, name: "Wetland & Mangrove Destruction", domain: "Environment", severity: 8, desc: "35% of mangroves lost since 1980. Wetlands disappearing 3x faster than forests. These ecosystems store 5x more carbon per hectare than tropical forests and protect coastlines." },
  { id: 32, name: "Urban Sprawl & Peri-urban Conversion", domain: "Environment", severity: 7, desc: "Urban land area tripling by 2030. Peri-urban agricultural land — the most productive — is consumed first. Informal sprawl evades planning controls in developing cities." },
  { id: 33, name: "Microplastic & Chemical Contamination", domain: "Environment", severity: 7, desc: "14M tons of microplastics on the ocean floor. PFAS 'forever chemicals' detected in rainwater globally. Chemical contamination plumes in waterways are largely unmapped." },
  { id: 34, name: "Dam & Levee Failure Risk", domain: "Resource", severity: 7, desc: "58,700 large dams worldwide, average age 50+ years. 3.5M people at risk from structurally deficient dams in the US alone. Monitoring relies on infrequent manual inspections." },
  { id: 35, name: "Refugee Settlement Sustainability", domain: "Human", severity: 7, desc: "Refugee camps designed for months last decades. Resource depletion around settlements creates environmental rings visible from space. 22M refugees in protracted situations." },
  { id: 36, name: "Volcanic & Seismic Hazard Exposure", domain: "Human", severity: 7, desc: "800M people live within 100km of active volcanoes. Ground deformation precursors go undetected at unmonitored volcanoes. Earthquake damage assessment takes weeks by ground survey." },
  { id: 37, name: "Peatland Degradation & Tropical Peat Fire", domain: "Environment", severity: 8, desc: "Drained peatlands emit 5% of global CO₂. Indonesian peat fires in 2015 exceeded total US daily emissions for weeks. Subsurface smoldering is undetectable by conventional fire monitoring." },
  { id: 38, name: "Maritime Security & Illegal Activity", domain: "Human", severity: 6, desc: "Sanctions evasion, smuggling, and illegal transshipment at sea. Ship-to-ship transfers in remote waters evade port state controls. AIS spoofing and dark operations increasing." },
  { id: 39, name: "Crop Monoculture & Genetic Vulnerability", domain: "Resource", severity: 7, desc: "75% of crop genetic diversity lost in the last century. Three crops provide 60% of plant-based calories. Genetic uniformity creates catastrophic vulnerability to novel pathogens and climate shifts." },
  { id: 40, name: "Sand Mining & Aggregate Depletion", domain: "Resource", severity: 6, desc: "Sand is the most consumed natural resource after water. Illegal river and coastal sand mining destroys aquatic habitats, undermines bridges, and accelerates coastal erosion. Extraction is largely unmonitored." },
  { id: 41, name: "Light Pollution & Nocturnal Ecosystem Disruption", domain: "Environment", severity: 6, desc: "80% of the world lives under light-polluted skies. Artificial light disrupts insect navigation, bird migration, sea turtle nesting, and coral spawning. Light pollution growing 10% per year." },
  { id: 42, name: "Compound Drought & Heatwave Events", domain: "Environment", severity: 8, desc: "Simultaneous drought-heat events increasing 2x per decade. Compound events cause crop failures, wildfire explosions, and water crises that individual hazards alone would not trigger." },
  { id: 43, name: "Transboundary Pollution & Waste Dumping", domain: "Resource", severity: 7, desc: "Hazardous waste exported from wealthy to poor nations under legal grey zones. Ocean dumping, e-waste processing, and chemical runoff cross borders with no accountability chain." },
  { id: 44, name: "Unplanned Urbanization & Informal Settlements", domain: "Human", severity: 7, desc: "1B people live in informal settlements. Growth outpaces mapping — many settlements don't appear on official maps. Infrastructure planning impossible without current spatial data." },
  { id: 45, name: "Nature-Based Carbon Credit Fraud", domain: "Resource", severity: 7, desc: "90% of rainforest carbon offsets may be worthless. Additionality is unverifiable, baselines are inflated, and permanence is unmonitored. A $2B market with minimal physical verification." },
  { id: 46, name: "Mining Tailings Dam Failure", domain: "Resource", severity: 8, desc: "Brumadinho, Samarco, Mount Polley — catastrophic tailings failures killing hundreds and contaminating watersheds for decades. 3,500+ active tailings dams worldwide with inadequate monitoring." },
  { id: 47, name: "Arctic Change & Shipping Risk", domain: "Environment", severity: 6, desc: "Arctic sea ice declining 13% per decade. New shipping routes opening through fragile ecosystems. Oil spill response capability is zero in most Arctic waters." },
  { id: 48, name: "Crop Disease & Pest Regime Shifts", domain: "Human", severity: 8, desc: "Climate change shifting pest and pathogen ranges poleward. Wheat blast, fall armyworm, and locust swarms threaten food security. Detection occurs after visible damage, when intervention is too late." },
  { id: 49, name: "Groundwater Contamination (Arsenic/Fluoride)", domain: "Human", severity: 7, desc: "300M people drink arsenic-contaminated water. Fluoride toxicity affects 200M+. Contamination is invisible, geological in origin, and requires well-by-well testing that hasn't been done at scale." },
  { id: 50, name: "Cultural Heritage & Archaeological Site Threats", domain: "Human", severity: 6, desc: "Conflict, looting, climate change, and development destroy irreplaceable heritage sites. Satellite monitoring has identified thousands of looting pits but systematic protection remains absent." }
];

const SOLUTIONS = [
  {
    id: 1,
    title: "Planetary Methane Prosecution Engine",
    tagline: "Turn spectral signatures into legal evidence",
    problems: [8, 1],
    dataSources: ["Planet Tanager-1", "GHGSat", "MethaneSAT", "Sentinel-5P/TROPOMI", "Sentinel-2A/B"],
    novelty: 10,
    description: "Fuse Tanager-1's 400-band hyperspectral with GHGSat's 25m point-source methane detection and MethaneSAT's area-wide quantification to create a legally admissible, chain-of-custody emissions evidence system. Overlay Sentinel-2 optical for facility identification. Generate automated attribution reports linking specific well pads, landfills, and pipelines to quantified emissions volumes. Package as court-ready evidence for climate litigation, regulatory enforcement, and carbon credit invalidation. No one is currently building the bridge from spectral detection to prosecutable evidence at global scale.",
    whyNovel: "Existing methane monitoring treats detection as an endpoint. This inverts it: detection becomes the starting point of a legal workflow. The spectral stack creates redundant, multi-sensor corroboration that meets evidentiary standards no single sensor can. Climate litigation is a $100B+ addressable market with no automated evidence pipeline.",
    impact: "Could force closure of the estimated 100,000+ super-emitter sites responsible for ~50% of anthropogenic methane, achieving more near-term climate impact than any renewable energy deployment."
  },
  {
    id: 2,
    title: "Hyperspectral Soil Carbon Futures Market",
    tagline: "Price carbon where it's stored, not where it's traded",
    problems: [12, 1, 3],
    dataSources: ["EnMAP", "PRISMA", "Pixxel Firefly", "ECOSTRESS", "Sentinel-2A/B", "GRACE-FO"],
    novelty: 10,
    description: "Use EnMAP and PRISMA's continuous VNIR-SWIR spectra to measure soil organic carbon (SOC) at field scale by detecting absorption features at 2200nm and 2350nm. Fuse with ECOSTRESS thermal stress data (microbial activity proxy) and GRACE-FO mass anomalies (moisture/density proxy). Build a continuously updated, spectrally-verified SOC inventory that underpins a new commodity class: soil carbon futures. Farmers trade on verified carbon sequestration rates derived from multi-temporal hyperspectral signatures, not self-reported models.",
    whyNovel: "Current carbon markets rely on models and infrequent soil sampling. Hyperspectral signatures of SOC are well-characterized in lab spectroscopy but no one has operationalized satellite-scale SOC measurement into a financial instrument. The fusion of SWIR spectral SOC with thermal microbial activity and gravimetric moisture creates a three-independent-physics verification stack.",
    impact: "Could unlock $50-100B in soil carbon value currently invisible to markets, while incentivizing regenerative agriculture across 1.5B hectares of degraded cropland."
  },
  {
    id: 3,
    title: "Zoonotic Spillover Early Warning Network",
    tagline: "Predict the next pandemic from orbit",
    problems: [6, 2, 13],
    dataSources: ["Pixxel Firefly", "Sentinel-2A/B", "GEDI", "VIIRS Day/Night Band", "Dynamic World", "Landsat 8/9", "CHIRPS Precipitation"],
    novelty: 9,
    description: "Map deforestation frontiers at 5m hyperspectral resolution (Pixxel) to identify active habitat fragmentation corridors where wildlife-human-livestock interfaces are forming. Fuse GEDI canopy structure (edge effects and degradation gradient) with Dynamic World land-use change (new settlement/agriculture appearing in former forest). Overlay VIIRS nighttime lights (population pressure proxy) and CHIRPS rainfall anomalies (vector breeding condition changes). Model spillover risk as a function of spectral biodiversity indicators × fragmentation velocity × human encroachment rate × climate stress. Deploy as a WHO-compatible alert layer.",
    whyNovel: "Current pandemic preparedness is genomic surveillance after emergence. This flips temporal orientation: use the spectral signatures of ecosystem disruption to predict where spillover conditions are forming months to years before a pathogen jumps. The 5m hyperspectral resolution from Pixxel is new enough that species-level habitat classification at deforestation frontiers becomes feasible for the first time.",
    impact: "Even modest improvement in pandemic prediction lead time (3-6 months) saves trillions in economic damage and millions of lives per event."
  },
  {
    id: 4,
    title: "Invisible Aquifer Observatory",
    tagline: "See underground water from space with three-physics fusion",
    problems: [4, 3, 20],
    dataSources: ["GRACE-FO", "NISAR", "Sentinel-1", "SWOT", "ECOSTRESS", "Landsat TIRS", "EnMAP"],
    novelty: 9,
    description: "Combine GRACE-FO gravimetry (mass anomalies indicating aquifer volume change at ~300km) with NISAR/Sentinel-1 InSAR (mm-scale surface subsidence from aquifer compaction at 10m resolution) and ECOSTRESS/Landsat thermal (evapotranspiration stress indicating drawdown effects). Use EnMAP hyperspectral to identify mineral efflorescence patterns (surface salt deposits that indicate rising water tables or contamination plumes). SWOT provides connected surface water height context. The fusion creates a multi-resolution, multi-physics 'X-ray' of groundwater systems never previously possible from space.",
    whyNovel: "Each sensor alone provides one ambiguous signal about groundwater. The innovation is the fusion architecture: gravity gives volume, InSAR gives compaction geometry, thermal gives biological stress response, hyperspectral gives geochemical surface expression, and altimetry gives hydrological connectivity. Together they constrain the inverse problem sufficiently to produce actionable aquifer management data without drilling.",
    impact: "Could prevent aquifer collapse for the 2B+ people dependent on groundwater in the Indo-Gangetic Plain, Central Valley, North China Plain, and MENA regions."
  },
  {
    id: 5,
    title: "Conflict Damage as Live Financial Instrument",
    tagline: "Real-time reconstruction cost pricing from SAR change detection",
    problems: [16, 5],
    dataSources: ["Capella Space", "ICEYE", "Maxar WorldView-3", "VIIRS Day/Night Band", "WorldPop", "Sentinel-2A/B"],
    novelty: 9,
    description: "Use Capella and ICEYE's sub-meter SAR (cloud/smoke-penetrating) to detect building destruction in active conflict zones within hours. Classify damage grades (intact → destroyed) using coherence change detection. Fuse with Maxar optical for building-type identification and pre-conflict baselines. Overlay WorldPop for displacement estimation and VIIRS nighttime lights for infrastructure functionality assessment. Auto-generate reconstruction cost estimates using building-type × damage-grade × local cost matrices. Package as a continuously priced financial instrument: conflict reconstruction bonds that update in near-real-time as damage accrues.",
    whyNovel: "Post-conflict reconstruction is currently priced years after cessation via ground surveys. This creates a live financial signal during conflict, enabling pre-positioned reconstruction financing, insurance pricing for conflict zones, and legally quantified reparations claims. SAR's ability to image through smoke and at night makes this uniquely possible.",
    impact: "Could mobilize reconstruction capital years earlier, reducing post-conflict poverty traps that perpetuate cycles of violence affecting hundreds of millions."
  },
  {
    id: 6,
    title: "Critical Mineral Discovery Without Digging",
    tagline: "Prospect from orbit using spectral mineralogy + gravity anomalies",
    problems: [7, 15],
    dataSources: ["EnMAP", "PRISMA", "ASTER", "Planet Tanager-1", "GRACE-FO", "ALOS-2 PALSAR-2", "Copernicus DEM GLO-30"],
    novelty: 9,
    description: "Use EnMAP/PRISMA SWIR bands to identify alteration mineralogy (clays, iron oxides, carbonates) that indicate lithium, cobalt, and rare earth deposits. The 2200nm Al-OH absorption, 2350nm Fe-Mg-OH, and 1000nm Fe²⁺ features are diagnostic. Fuse with ASTER TIR emissivity for silicate/carbonate discrimination, GRACE-FO for subsurface density anomalies, and PALSAR-2 L-band for regolith structure penetration. Apply to unexplored terrains in Africa, Central Asia, and South America where ground exploration is dangerous or politically blocked. Generate prospect maps that reduce drill-to-discovery ratios from ~1:500 to ~1:50.",
    whyNovel: "Traditional mineral exploration requires expensive ground campaigns in remote/hostile terrain. The combination of operational hyperspectral satellites (new as of 2022-2025) with gravity and SAR penetration creates a non-invasive prospecting stack that can survey entire countries in weeks rather than decades. No one has systematically fused all three physics for critical mineral targeting.",
    impact: "Could accelerate energy transition mineral discovery by 10-20 years, breaking geopolitical bottlenecks that currently concentrate 70% of processing in China."
  },
  {
    id: 7,
    title: "Deforestation-Free Supply Chain Verification at Pixel Level",
    tagline: "Trace every commodity parcel to its spectral origin",
    problems: [13, 19, 2],
    dataSources: ["Pixxel Firefly", "Sentinel-2A/B", "ALOS-2 PALSAR-2", "Global Forest Change", "Planet SuperDove"],
    novelty: 8,
    description: "The EU Deforestation Regulation (EUDR) requires proof that commodities weren't produced on deforested land. Use Pixxel's 5m hyperspectral to spectrally distinguish commodity crops (cocoa, palm oil, soy, coffee, rubber, cattle pasture) from native vegetation with species-level accuracy. Fuse with Sentinel-2 temporal stacks (phenology matching) and PALSAR-2 L-band (detecting clearing under cloud cover in tropical regions). Cross-reference with Hansen forest loss data for temporal compliance. Generate per-parcel spectral certificates of origin that are unforgeable because they encode the spectral fingerprint of the specific soil-crop-climate combination at GPS coordinates.",
    whyNovel: "Current EUDR compliance relies on coarse land-cover classification that can't distinguish a legal cocoa farm from an illegal one planted on recently cleared forest. Hyperspectral crop species ID + temporal forest change + SAR cloud-gap-filling creates the first spectrally unforgeable provenance system. The spectral signature of a crop encodes its growing conditions like a chemical fingerprint.",
    impact: "Could enforce compliance across $50B+ in deforestation-linked commodity trade, protecting 5M+ hectares of tropical forest annually."
  },
  {
    id: 8,
    title: "Urban Heat Equity Triage System",
    tagline: "Map who is dying from heat, block by block, in real time",
    problems: [11, 10, 15],
    dataSources: ["ECOSTRESS", "Landsat TIRS", "Sentinel-2A/B", "WorldPop", "VIIRS Day/Night Band", "Pixxel Firefly"],
    novelty: 8,
    description: "Fuse ECOSTRESS's 38m thermal (capturing diurnal temperature cycling) with Sentinel-2 urban materials classification and WorldPop population density to create a heat vulnerability index at block level. Use Pixxel hyperspectral to classify roof and pavement materials spectrally (dark asphalt vs. cool coatings vs. vegetated roofs), which determines albedo and heat absorption. Overlay nighttime VIIRS to identify neighborhoods where energy poverty prevents air conditioning. The output is a continuously updated triage map showing where lethal heat exposure, vulnerable populations, and zero cooling capacity converge. Deploy as a municipal emergency resource allocation tool.",
    whyNovel: "Urban heat studies exist but they stop at temperature mapping. This system fuses thermal physics (surface energy balance), spectral material classification (roof/pavement albedo), population vulnerability (density × poverty × age), and energy access (nighttime lights as AC proxy) into a single decision layer. The material-level spectral classification from new HSI constellations is the missing link.",
    impact: "Heat kills ~500K people annually, disproportionately in informal settlements. Block-level triage could reduce heat mortality 20-40% in participating cities through targeted interventions (cool coatings, shade structures, cooling centers)."
  },
  {
    id: 9,
    title: "Antibiotic Resistance River Radar",
    tagline: "Trace pharmaceutical contamination from factory to watershed",
    problems: [17, 4, 9],
    dataSources: ["EnMAP", "PRISMA", "PACE/OCI", "Sentinel-3 OLCI", "Sentinel-2A/B", "SWOT"],
    novelty: 10,
    description: "Pharmaceutical manufacturing effluent and agricultural antibiotic runoff create spectral signatures in receiving waters: abnormal chlorophyll fluorescence ratios, unusual colored dissolved organic matter (CDOM) absorption, and specific phytoplankton community shifts detectable by hyperspectral ocean/water color sensors. Use EnMAP/PRISMA to map factory discharge plumes in rivers and PACE's 200-band hyperspectral ocean color to track coastal propagation. Correlate phytoplankton community structure changes (diatom-to-cyanobacteria ratios detectable spectrally) with known AMR hotspots. SWOT provides water flow context. Build a global watch-list of pharmaceutical contamination corridors that correlate with AMR emergence data.",
    whyNovel: "No one has connected satellite water spectroscopy to antibiotic resistance geography. The key insight is that pharmaceutical effluent doesn't just contaminate water — it changes the biological community structure in ways that alter the spectral signature of the water body. Hyperspectral water color is a proxy for pharmaceutical impact on aquatic ecology, which is itself the crucible of AMR gene exchange.",
    impact: "Could identify the top 1000 pharmaceutical contamination hotspots globally, enabling targeted regulatory intervention on the factories and farms driving the next superbug."
  },
  {
    id: 10,
    title: "Climate Migration Predictive Positioning",
    tagline: "Pre-position aid where people will be, not where they are",
    problems: [5, 3, 10, 20],
    dataSources: ["GRACE-FO", "CHIRPS Precipitation", "ECOSTRESS", "Dynamic World", "VIIRS Day/Night Band", "WorldPop", "Sentinel-2A/B", "Landsat 8/9", "JRC Global Surface Water"],
    novelty: 9,
    description: "Build a multi-year climate habitability decay model by fusing: GRACE-FO aquifer depletion trajectories, CHIRPS precipitation trend vectors, ECOSTRESS crop stress indices, JRC surface water recession rates, and Dynamic World land-use change velocity. When habitability metrics cross critical thresholds in populated areas (WorldPop), model migration flow direction using terrain, infrastructure, and historical movement corridors. Generate 6-24 month migration probability maps. Pre-position humanitarian resources, plan urban absorption capacity, and trigger anticipatory cash transfers in destination zones before displacement occurs.",
    whyNovel: "Humanitarian response is reactive: camps after displacement. This model uses the unique combination of gravity (invisible aquifer decline), thermal (crop stress before failure), precipitation (drought onset), and surface water (resource scarcity) to predict habitability collapse 6-24 months ahead. The multi-physics approach avoids false alarms from any single sensor. No current system fuses these signals for anticipatory humanitarian action.",
    impact: "Anticipatory action costs 1/7th of emergency response. Applied to the 20 countries on the IRC Emergency Watchlist, this could save $10B+ annually in humanitarian spending while preventing millions of crisis-driven displacements."
  },
  {
    id: 11,
    title: "Permafrost Collapse Infrastructure Insurance",
    tagline: "Price Arctic infrastructure risk from subsidence velocity fields",
    problems: [21, 14, 1],
    dataSources: ["Sentinel-1", "NISAR (2025+)", "Landsat TIRS", "ECOSTRESS", "Copernicus DEM GLO-30", "MODIS (Terra/Aqua)"],
    novelty: 9,
    description: "Combine Sentinel-1 and NISAR InSAR to generate mm-resolution subsidence velocity fields across Arctic permafrost regions. Fuse with Landsat TIRS and ECOSTRESS thermal data to map active layer thickness changes and talik formation. Overlay Copernicus DEM for terrain-driven thaw susceptibility modeling. Create continuously updated structural risk scores for every pipeline, road, building, and runway in permafrost zones. Package as an actuarial product: real-time infrastructure insurance pricing based on ground stability physics.",
    whyNovel: "Arctic infrastructure damage costs $50B+ by 2050 but current risk models use static permafrost maps. Dual-frequency InSAR (C-band + L-band) discriminates surface frost heave from deep thaw subsidence — a distinction impossible with single-sensor approaches. No one has connected this to financial instruments.",
    impact: "Could prevent catastrophic failures of Arctic pipelines carrying 10M+ barrels/day and enable proactive relocation of 4M+ people in permafrost-affected settlements across Russia, Canada, and Alaska."
  },
  {
    id: 12,
    title: "Coral Reef Bleaching Prediction & Triage System",
    tagline: "Predict bleaching 8 weeks out using spectral stress signatures",
    problems: [9, 2, 1],
    dataSources: ["Sentinel-2A/B", "PACE/OCI", "Sentinel-3 OLCI", "ECOSTRESS", "Landsat TIRS", "Allen Coral Atlas"],
    novelty: 8,
    description: "Use PACE's 200-band hyperspectral ocean color to detect pre-bleaching stress in coral symbiotic algae via shifts in chlorophyll fluorescence ratios and accessory pigment absorption. Fuse with Sentinel-2 10m benthic mapping for reef-scale resolution, Sentinel-3 for sea surface temperature anomaly tracking, and ECOSTRESS/Landsat thermal for nearshore thermal plume identification. Cross-reference Allen Coral Atlas reef maps for global coverage. Generate 4-8 week bleaching probability forecasts enabling targeted intervention (shading, assisted gene flow, larval seeding).",
    whyNovel: "Current bleaching alerts (NOAA Coral Reef Watch) use SST anomalies alone — a blunt instrument that can't distinguish thermal tolerance variation across reef communities. Hyperspectral pigment stress detection sees biological response before thermal thresholds are crossed.",
    impact: "Could save 30-50% of reefs currently lost in mass bleaching events by enabling targeted intervention on the most viable and ecologically critical reef systems."
  },
  {
    id: 13,
    title: "Illegal Mining Real-Time Prosecution Network",
    tagline: "Detect, quantify, and prosecute illegal mining from spectral fingerprints",
    problems: [23, 4, 13],
    dataSources: ["Sentinel-2A/B", "ALOS-2 PALSAR-2", "Sentinel-1", "Planet SuperDove", "EnMAP", "JRC Global Surface Water"],
    novelty: 8,
    description: "Detect illegal alluvial gold mining by identifying the spectral signature of mercury-contaminated sediment plumes (elevated turbidity + specific spectral reflectance in SWIR) in rivers using EnMAP and Sentinel-2. Use PALSAR-2 L-band SAR to detect forest clearing and pit excavation under cloud cover in tropical regions. Track operation expansion rates with Planet SuperDove 3m daily revisit. Correlate with JRC surface water data to identify river course alterations. Generate automated enforcement packages with GPS coordinates, volumetric extraction estimates, and temporal evidence chains.",
    whyNovel: "Illegal mining is typically detected only when rivers turn visibly brown — far too late. SWIR spectral signatures of mercury-laden sediment are detectable at concentrations well below visible thresholds. SAR penetrates the persistent cloud cover that shields most illegal operations from optical monitoring.",
    impact: "Could disrupt the $20B+ illegal gold mining industry that poisons 15M+ people with mercury across 70+ countries and is the largest driver of deforestation in the Amazon."
  },
  {
    id: 14,
    title: "Compound Drought-Heat Cascade Forecaster",
    tagline: "Predict agricultural collapse before crops show visible stress",
    problems: [42, 3, 10],
    dataSources: ["ECOSTRESS", "GRACE-FO", "CHIRPS Precipitation", "Sentinel-2A/B", "Landsat 8/9", "MODIS (Terra/Aqua)", "Landsat TIRS"],
    novelty: 9,
    description: "Build a compound event detection system that fuses ECOSTRESS evapotranspiration stress (crop water demand exceeding supply), GRACE-FO gravity anomalies (subsurface moisture depletion trend), CHIRPS precipitation deficit trajectories, and Landsat/Sentinel-2 vegetation index decline rates. The key innovation is detecting the convergence of multiple stress vectors before any single indicator crosses a critical threshold. When three or more independent physics-based stress signals align in the same region within the same temporal window, issue compound event warnings 4-8 weeks before crop failure becomes visible.",
    whyNovel: "Drought warnings use precipitation deficits; heat warnings use temperature; crop monitors use NDVI. None detect the compound interaction. The fusion of gravity (invisible soil moisture), thermal (plant stress response), optical (canopy condition), and precipitation (atmospheric forcing) creates a multi-physics early warning that no single sensor or agency provides.",
    impact: "Compound drought-heat events caused $50B+ in crop losses in 2022 alone. Even 3-week advance warning enables crop insurance trigger adjustments, livestock movement, and food aid pre-positioning for 500M+ smallholder farmers."
  },
  {
    id: 15,
    title: "Dark Fleet & IUU Fishing Radar Dragnet",
    tagline: "Find every fishing vessel on Earth, whether they want to be found or not",
    problems: [27, 38, 9],
    dataSources: ["Sentinel-1", "ICEYE", "VIIRS Day/Night Band", "Global Fishing Watch", "Sentinel-2A/B"],
    novelty: 8,
    description: "Use Sentinel-1 C-band SAR to detect vessels that have disabled AIS transponders ('dark vessels') across entire ocean basins. Fuse with ICEYE's sub-meter X-band SAR for vessel type classification based on hull geometry and deck equipment signatures. Overlay VIIRS nighttime lights to detect squid jigger fleets and at-sea transshipment operations lit by powerful onboard lights. Cross-reference with Global Fishing Watch AIS data to identify vessels that toggle transponders on/off at fishing ground boundaries. Generate automated illegal fishing probability scores for every detected vessel.",
    whyNovel: "Global Fishing Watch tracks AIS — but the worst actors turn AIS off. SAR sees metal on water regardless of transponder status. The fusion of SAR vessel detection + VIIRS night lights + AIS gaps creates a three-independent-observation identification system that makes dark fishing effectively impossible to hide.",
    impact: "IUU fishing costs $23B/year and is the primary driver of fisheries collapse in developing nations. Comprehensive vessel detection could reduce IUU catch by 60-80%, protecting the food security of 3B+ people who depend on fish for protein."
  },
  {
    id: 16,
    title: "Wildfire Fuel Load & Ignition Risk Mapper",
    tagline: "Map every combustible hectare before it burns",
    problems: [18, 12, 42],
    dataSources: ["GEDI", "Sentinel-2A/B", "Landsat 8/9", "ECOSTRESS", "VIIRS", "Copernicus DEM GLO-30", "CHIRPS Precipitation"],
    novelty: 8,
    description: "Use GEDI's full-waveform LiDAR to measure 3D fuel structure (canopy height, understory density, ladder fuel connectivity) across fire-prone landscapes. Fuse with Sentinel-2/Landsat time series to track fuel moisture content via SWIR bands and phenological state. Overlay ECOSTRESS thermal for live fuel moisture estimation, VIIRS for active fire history, Copernicus DEM for slope/aspect fire behavior modeling, and CHIRPS for drought stress accumulation. Generate continuously updated fuel load maps that predict fire behavior (intensity, rate of spread, spotting distance) at 30m resolution for every hectare.",
    whyNovel: "Fire agencies model behavior from point weather stations and coarse fuel type maps. GEDI provides the missing vertical fuel structure — the difference between surface fire and catastrophic crown fire. No operational system fuses 3D fuel structure with spectral moisture, thermal stress, and terrain at continental scale.",
    impact: "Wildfire suppression costs $30B+/year globally. Precision fuel treatment guided by 3D fuel maps could reduce catastrophic fire area by 40-60% at a fraction of current suppression spending."
  },
  {
    id: 17,
    title: "Refugee Camp Resource Depletion Forecaster",
    tagline: "Predict environmental collapse around settlements before crisis hits",
    problems: [35, 5, 12],
    dataSources: ["Sentinel-2A/B", "VIIRS Day/Night Band", "WorldPop", "Dynamic World", "Landsat 8/9", "CHIRPS Precipitation"],
    novelty: 7,
    description: "Map the expanding 'depletion rings' around refugee settlements using Sentinel-2 temporal vegetation index stacks — concentric zones of firewood harvesting, overgrazing, and soil compaction that expand predictably over time. Fuse with VIIRS nighttime lights for settlement growth rate, WorldPop for population density estimation, Dynamic World for land cover conversion tracking, and CHIRPS for rainfall-adjusted carrying capacity. Model the intersection of resource depletion velocity with population growth to predict when camps will exceed local environmental carrying capacity, triggering secondary displacement.",
    whyNovel: "Humanitarian planning treats camps as logistics problems, not ecological systems. The spectral signature of progressive resource depletion around settlements is well-documented in remote sensing literature but has never been operationalized into a predictive resource management tool.",
    impact: "Could prevent secondary displacement of millions by triggering resource interventions (fuel-efficient stoves, agroforestry, water harvesting) before environmental collapse forces camp relocation."
  },
  {
    id: 18,
    title: "Urban Flood Vulnerability Digital Twin",
    tagline: "Model every raindrop's path through the urban fabric",
    problems: [10, 44, 24],
    dataSources: ["USGS 3DEP", "Copernicus DEM GLO-30", "Sentinel-1", "Sentinel-2A/B", "WorldPop", "Dynamic World", "CHIRPS Precipitation"],
    novelty: 8,
    description: "Build hyper-resolution urban flood models by fusing USGS 3DEP LiDAR (0.5m terrain with building footprints and storm drain inlets resolved) with Sentinel-1 SAR flood extent mapping, Sentinel-2 impervious surface classification, and CHIRPS intensity-duration-frequency curves. For cities outside 3DEP coverage, use Copernicus DEM enhanced with Sentinel-2-derived building height estimation. Overlay WorldPop population density and Dynamic World land cover for exposure modeling. Generate ward-level flood risk scores that account for both physical vulnerability (terrain, drainage, imperviousness) and social vulnerability (population density, informal settlement location).",
    whyNovel: "Urban flood models require sub-meter terrain data that doesn't exist in most flood-vulnerable cities. The innovation is using SAR-derived flood extents from historical events to calibrate coarser DEMs, creating pseudo-high-resolution hydraulic models for data-poor cities. Social vulnerability overlay transforms physics models into actionable equity tools.",
    impact: "Urban flooding kills 5,000+ and displaces 20M+ annually. Precision vulnerability mapping could reduce flood fatalities 50-70% through targeted drainage investment, early warning, and settlement planning in the world's fastest-growing cities."
  },
  {
    id: 19,
    title: "Peatland Fire Underground Detection System",
    tagline: "See fire burning beneath the surface before smoke rises",
    problems: [37, 1, 8],
    dataSources: ["Sentinel-1", "ECOSTRESS", "Landsat TIRS", "Sentinel-5P/TROPOMI", "Sentinel-2A/B", "MODIS (Terra/Aqua)"],
    novelty: 9,
    description: "Detect subsurface smoldering peat fires by fusing Sentinel-1 SAR coherence loss (soil structure changes from underground combustion) with ECOSTRESS/Landsat thermal anomalies (surface temperature elevated 2-5°C above ambient over smoldering zones). Use TROPOMI to detect low-level CO and particulate columns over apparently fire-free peatland. Sentinel-2 maps water table proxy indicators (vegetation stress patterns indicating drainage). MODIS provides regional thermal context. The system detects underground peat fires days to weeks before they surface, when suppression is still feasible.",
    whyNovel: "Peat fires burn underground for months, undetectable by conventional fire satellites (VIIRS/MODIS hotspots) until they surface. SAR coherence change from subsurface combustion is a novel detection physics — the burning peat changes soil dielectric properties detectably from orbit. No operational system attempts underground fire detection.",
    impact: "Indonesian peat fires alone release 1-2 Gt CO₂ in bad years — rivaling entire nations' annual emissions. Early detection could prevent 80% of peat fire emissions and the associated respiratory health crisis affecting 100M+ people."
  },
  {
    id: 20,
    title: "Invasive Species Spectral Early Warning",
    tagline: "Detect invasive plants from their spectral fingerprint before they dominate",
    problems: [26, 2, 22],
    dataSources: ["EnMAP", "Pixxel Firefly (6 sats)", "Sentinel-2A/B", "Landsat 8/9", "Dynamic World"],
    novelty: 8,
    description: "Use EnMAP and Pixxel hyperspectral to identify invasive plant species by their unique spectral signatures — leaf chemistry, canopy structure, and phenological timing that differ from native vegetation. Many invasives have distinctive spectral features: water hyacinth's chlorophyll fluorescence peak, cheatgrass's early senescence in SWIR, kudzu's unique red-edge profile. Fuse with Sentinel-2/Landsat multi-temporal stacks to detect phenological anomalies (species greening or senescing out of sync with native community). Track invasion fronts at 5-30m resolution and model spread velocity using Dynamic World land cover as habitat suitability context.",
    whyNovel: "Invasive species are currently mapped by ground surveys years after establishment. Hyperspectral species discrimination at satellite scale has been demonstrated in research but never operationalized into a surveillance system. The 5m resolution from Pixxel enables detection of small pioneer populations before they reach the exponential growth phase.",
    impact: "Early detection when populations are small reduces eradication cost 100x. Applied globally, could prevent $100B+/year in invasive species damages and protect biodiversity hotspots from ecological transformation."
  },
  {
    id: 21,
    title: "Tailings Dam Failure Early Warning Network",
    tagline: "Detect dam deformation months before catastrophic failure",
    problems: [46, 4, 23],
    dataSources: ["Sentinel-1", "NISAR (2025+)", "Sentinel-2A/B", "Copernicus DEM GLO-30", "Landsat 8/9"],
    novelty: 8,
    description: "Monitor all 3,500+ active tailings dams worldwide using Sentinel-1 InSAR time series to detect mm-scale creep deformation on dam faces and embankments. Fuse with NISAR L-band for deeper penetration into earthen structures. Use Sentinel-2 to monitor seepage indicators (vegetation anomalies at dam toe indicating water migration through structure) and pond level changes. Copernicus DEM provides downstream inundation modeling for every dam. Generate automated risk scores combining deformation rate, seepage indicators, pond level trends, and downstream exposure. Alert regulators and downstream communities when deformation exceeds safe thresholds.",
    whyNovel: "Brumadinho's dam showed detectable InSAR deformation months before failure — but no one was watching. The innovation is systematic global monitoring of every tailings dam, not case-by-case studies. Seepage detection via vegetation anomaly is a novel proxy: water migrating through an earthen dam creates a vegetation signature at the toe detectable in 10m Sentinel-2 imagery.",
    impact: "Could prevent catastrophic failures that kill hundreds and contaminate watersheds for decades. The Brumadinho disaster alone caused $7B+ in damages — systematic monitoring of all dams could prevent the next one."
  },
  {
    id: 22,
    title: "Coastal Erosion & Sediment Budget Tracker",
    tagline: "Map every shoreline on Earth monthly and predict where land disappears next",
    problems: [24, 20, 14],
    dataSources: ["Sentinel-2A/B", "Landsat 8/9", "ICESat-2/ATLAS", "Sentinel-1", "SWOT", "Copernicus DEM GLO-30"],
    novelty: 7,
    description: "Generate monthly global shoreline positions from Sentinel-2 and Landsat using sub-pixel waterline extraction algorithms. Fuse with ICESat-2 beach elevation profiles to distinguish erosion (volume loss) from inundation (water level rise). Use Sentinel-1 SAR for shoreline mapping through cloud cover in monsoon regions. SWOT provides nearshore wave climate and current data affecting sediment transport. Build continental-scale sediment budget models tracking erosion-deposition patterns. Predict shoreline position 5-20 years forward for every coastal community.",
    whyNovel: "Shoreline monitoring exists but is fragmented — national surveys every 5-10 years at best. The combination of optical waterline extraction + ICESat-2 elevation + SAR all-weather coverage creates the first truly global monthly shoreline observatory with volumetric change capability.",
    impact: "Could inform coastal protection investments for 1B people in low-elevation coastal zones, preventing $100B+ in infrastructure losses from coastal erosion by enabling proactive setback planning."
  },
  {
    id: 23,
    title: "Air Quality Inequality Real-Time Mapper",
    tagline: "Map who breathes the worst air, block by block, worldwide",
    problems: [25, 11, 15],
    dataSources: ["Sentinel-5P/TROPOMI", "CAMS (Copernicus)", "Sentinel-2A/B", "VIIRS Day/Night Band", "WorldPop", "MODIS (Terra/Aqua)"],
    novelty: 7,
    description: "Downscale TROPOMI NO₂ and aerosol columns from 5km to neighborhood level using Sentinel-2 land use classification as a spatial prior (industrial zones, major roads, residential areas have characteristic emission profiles). Fuse with CAMS assimilated particulate data, MODIS aerosol optical depth, and VIIRS nighttime lights (industrial activity proxy). Overlay WorldPop population density to calculate per-capita pollution exposure. Generate block-level air quality equity scores revealing where the most polluted air intersects the most vulnerable populations.",
    whyNovel: "Air quality monitoring relies on sparse ground stations that miss hyper-local pollution hotspots. The downscaling innovation uses land use spectral classification as a physics-informed spatial prior — not just statistical interpolation — to distribute column measurements into neighborhood-level exposure estimates.",
    impact: "Could redirect $10B+ in clean air investments to the communities with worst exposure, potentially preventing 1M+ premature deaths annually by targeting pollution sources affecting the most people."
  },
  {
    id: 24,
    title: "Precision Irrigation Water Savings Engine",
    tagline: "Save 40% of agricultural water with thermal-spectral irrigation scheduling",
    problems: [29, 4, 3],
    dataSources: ["ECOSTRESS", "Sentinel-2A/B", "Landsat 8/9", "Landsat TIRS", "GRACE-FO", "CHIRPS Precipitation"],
    novelty: 7,
    description: "Use ECOSTRESS evapotranspiration maps to calculate actual vs. optimal crop water consumption at field scale. Fuse with Sentinel-2 NDVI/NDRE for crop growth stage estimation and Landsat TIRS for canopy temperature stress detection. Compare actual ET with rainfall (CHIRPS) to quantify irrigation demand. Track GRACE-FO aquifer trends to contextualize extraction sustainability. Generate field-level irrigation prescriptions: how much water, when, and where — eliminating the overwatering that accounts for 40-60% of agricultural water waste.",
    whyNovel: "Precision irrigation exists but adoption is <5% because it requires expensive ground sensors. Satellite-based ET measurement provides the same information free, at scale, for every field on Earth. The ECOSTRESS-GRACE fusion connects field-level decisions to aquifer-level sustainability — individual farmers see how their irrigation contributes to regional depletion.",
    impact: "Agriculture uses 70% of freshwater. 40% savings on irrigated cropland would free 1,000+ km³/year of freshwater — equivalent to the annual flow of 10 Colorado Rivers — while maintaining or improving crop yields."
  },
  {
    id: 25,
    title: "Supply Chain Slave Labor Geospatial Detector",
    tagline: "Find forced labor from the spatial signatures of exploitation",
    problems: [30, 19, 13],
    dataSources: ["Maxar WorldView-3", "Sentinel-2A/B", "Planet SuperDove", "VIIRS Day/Night Band", "WorldPop", "Dynamic World"],
    novelty: 9,
    description: "Identify forced labor operations by detecting their spatial signatures: isolated worker compounds adjacent to commodity production areas (brick kilns, charcoal production, fisheries, agricultural estates) with characteristics inconsistent with voluntary settlements — high worker-to-structure ratios (WorldPop), no nighttime light growth despite population presence (VIIRS), restricted road access patterns (Sentinel-2), and production output inconsistent with reported workforce (Planet SuperDove temporal monitoring). Use Maxar VHR for detailed facility classification. Cross-reference with known commodity supply chain origins to flag products entering global trade from forced labor hotspots.",
    whyNovel: "Modern slavery investigations rely on informants and raid-based enforcement. The insight is that exploitation leaves spatial signatures: forced labor sites look physically different from voluntary labor in systematic, detectable ways. No one has built a geospatial classifier for labor exploitation, but the spatial features are well-documented in NGO reports.",
    impact: "Could identify thousands of forced labor sites across brick kilns (India), fishing vessels (SE Asia), cocoa farms (West Africa), and cotton fields (Central Asia), directly supporting liberation of hundreds of thousands of people."
  },
  {
    id: 26,
    title: "Mangrove & Wetland Carbon Integrity Verifier",
    tagline: "Ground-truth blue carbon credits from orbit with spectral biomass measurement",
    problems: [45, 31, 1],
    dataSources: ["GEDI", "ALOS-2 PALSAR-2", "Sentinel-2A/B", "Landsat 8/9", "Global Forest Change", "ICESat-2/ATLAS"],
    novelty: 8,
    description: "Verify blue carbon credit claims by independently measuring mangrove and wetland biomass using GEDI waveform LiDAR (canopy height → biomass allometry) and PALSAR-2 L-band backscatter (biomass estimation from radar). Fuse with Sentinel-2/Landsat time series to verify claimed conservation additionality (was the mangrove actually at risk of loss?). Cross-reference Global Forest Change data for historical loss context and ICESat-2 for elevation-based inundation vulnerability. Generate independent biomass × area × permanence risk scores for every blue carbon project, flagging credits where claimed carbon stocks exceed physically measured values.",
    whyNovel: "Blue carbon credits trade at premium prices but verification relies on project developer self-reporting. Independent satellite biomass measurement using dual-physics (LiDAR + radar) creates unfalsifiable verification. The additionality test — was this mangrove genuinely threatened? — using historical loss data is a regulatory innovation enabled by the 30+ year Landsat archive.",
    impact: "Could clean up the $500M+ blue carbon market by identifying fraudulent or inflated credits, redirecting investment to projects with genuine climate and biodiversity impact across 15M hectares of threatened mangroves."
  },
  {
    id: 27,
    title: "Urban Sprawl Agricultural Loss Accountant",
    tagline: "Price every hectare of farmland consumed by development in real time",
    problems: [32, 3, 12],
    dataSources: ["Sentinel-2A/B", "Dynamic World", "Landsat 8/9", "WorldPop", "VIIRS Day/Night Band", "MODIS (Terra/Aqua)"],
    novelty: 7,
    description: "Track peri-urban agricultural land conversion at 10m resolution using Sentinel-2 temporal stacks and Dynamic World near-real-time land cover change. Calculate the agricultural productivity of each converted hectare using historical Landsat NDVI time series and MODIS crop yield estimation. Multiply by crop type and local price data to assign a food production loss value to every hectare of sprawl. Overlay WorldPop growth trajectories and VIIRS nighttime light expansion rates to forecast future conversion corridors. Generate municipal-level sprawl cost dashboards showing cumulative food production capacity lost.",
    whyNovel: "Urban planning treats farmland loss as a zoning issue. This system prices it as a food security cost — creating an economic argument for densification that resonates with policymakers. The temporal depth of the Landsat archive enables productivity valuation that current land cover snapshots cannot provide.",
    impact: "Peri-urban land produces 15-20% of global food supply but is being converted at 2M hectares/year. Making sprawl costs visible could redirect development patterns and protect the most productive farmland feeding billions."
  },
  {
    id: 28,
    title: "Volcanic Eruption Precursor Detection Grid",
    tagline: "Monitor every volcano on Earth for deformation, degassing, and thermal unrest",
    problems: [36, 10, 25],
    dataSources: ["Sentinel-1", "Sentinel-5P/TROPOMI", "ECOSTRESS", "Landsat TIRS", "Sentinel-2A/B", "Copernicus DEM GLO-30"],
    novelty: 8,
    description: "Build a global volcanic unrest detection system monitoring all 1,400+ potentially active volcanoes using Sentinel-1 InSAR (edifice inflation/deflation indicating magma movement), TROPOMI SO₂ columns (degassing changes indicating magma ascent), ECOSTRESS/Landsat thermal (fumarole temperature anomalies and crater lake heating), and Sentinel-2 (visible changes — new fumaroles, lahar deposits, dome growth). Copernicus DEM provides lahar flow path modeling. Generate multi-parameter unrest scores that distinguish genuine eruption precursors from background noise with higher confidence than any single monitoring technique.",
    whyNovel: "Only ~200 volcanoes have ground-based monitoring. The other 1,200 are watched by nothing. Multi-parameter satellite monitoring has been demonstrated for individual volcanoes but never operationalized globally. The fusion of deformation + gas + thermal reduces false alarm rates by requiring convergent evidence across independent physics.",
    impact: "800M people live within 100km of active volcanoes. Systematic monitoring could provide days to weeks of warning for eruptions at currently unmonitored volcanoes, potentially saving tens of thousands of lives per major event."
  },
  {
    id: 29,
    title: "Freshwater Ecosystem Health Spectral Index",
    tagline: "Diagnose lake and river sickness from hyperspectral water color",
    problems: [22, 4, 33],
    dataSources: ["EnMAP", "PACE/OCI", "Sentinel-2A/B", "Sentinel-3 OLCI", "ECOSTRESS", "JRC Global Surface Water"],
    novelty: 8,
    description: "Create a global freshwater health diagnostic using EnMAP/PACE hyperspectral water-leaving reflectance to detect harmful algal blooms (cyanobacteria-specific phycocyanin absorption at 620nm), eutrophication (chlorophyll-a gradient mapping), sediment loading (mineral suspended solid spectral signatures), and chemical contamination proxies (CDOM fluorescence anomalies). Fuse with Sentinel-2 for spatial resolution on smaller water bodies, Sentinel-3 OLCI for temporal frequency on large lakes, and ECOSTRESS for thermal stratification assessment. Cross-reference JRC surface water for water body extent changes. Generate continuous water quality health scores for every lake and reservoir >1 hectare globally.",
    whyNovel: "Water quality monitoring relies on in-situ sampling at a tiny fraction of water bodies. Hyperspectral water color has been validated for ocean applications but satellite-scale freshwater spectroscopy is newly feasible with EnMAP and PACE. The spectral signatures of different pollution types are diagnostically distinct — enabling cause identification, not just detection.",
    impact: "2.2B people lack safe drinking water. Continuous monitoring of all freshwater bodies could provide early warning of contamination events, guide treatment investments, and protect the drinking water supply for billions."
  },
  {
    id: 30,
    title: "Crop Disease Spectral Surveillance Network",
    tagline: "Detect crop pathogens from spectral stress before visible symptoms appear",
    problems: [48, 3, 39],
    dataSources: ["Pixxel Firefly (6 sats)", "Sentinel-2A/B", "ECOSTRESS", "MODIS (Terra/Aqua)", "CHIRPS Precipitation", "Landsat 8/9"],
    novelty: 9,
    description: "Use Pixxel's 5m hyperspectral to detect pre-visual disease stress in crops by identifying spectral shifts in leaf reflectance: reduced chlorophyll absorption (550nm shoulder changes), increased cell wall scattering (NIR plateau shifts), and altered water content (1450nm/1940nm absorption depth changes) that precede visible symptoms by 7-14 days. Fuse with Sentinel-2 red-edge bands for regional scaling, ECOSTRESS for canopy temperature anomalies (infected plants transpire differently), MODIS for continental spread tracking, and CHIRPS for disease-favorable moisture conditions. Generate automated pest and pathogen alerts with spread vector predictions.",
    whyNovel: "Crop disease detection is currently visual — farmers or extension workers spotting symptoms. By then, infection is well established and intervention options are limited. Pre-visual spectral detection at 5m resolution from Pixxel enables field-scale early intervention during the latent period when fungicides and biocontrols are most effective. The 24-48hr revisit enables spread velocity estimation impossible from Sentinel-2's 5-day revisit.",
    impact: "Crop diseases cause $220B/year in losses. Pre-visual detection with 7-14 day lead time could reduce losses by 30-50%, preventing food crises in the developing world where subsistence farmers can't absorb yield shocks."
  },
  {
    id: 31,
    title: "Earthquake Damage Assessment in Hours",
    tagline: "Map building damage across entire cities within hours of an earthquake",
    problems: [36, 16, 14],
    dataSources: ["Capella Space", "ICEYE", "Sentinel-1", "Sentinel-2A/B", "WorldPop", "Copernicus DEM GLO-30"],
    novelty: 7,
    description: "Use Capella and ICEYE's sub-meter SAR (available within hours, day or night, any weather) to perform coherence change detection against pre-event SAR baselines. Classify building damage grades (D0-D5 on EMS-98 scale) from coherence loss magnitude, double-bounce reflection changes, and debris scatter signatures. Sentinel-1 provides wide-area screening to prioritize sub-meter tasking. Sentinel-2 pre-event baselines provide building stock classification. Overlay WorldPop for casualty estimation and Copernicus DEM for access route assessment. Generate ward-level damage reports within 6 hours of a major earthquake.",
    whyNovel: "Post-earthquake damage assessment currently takes days to weeks by ground teams. SAR coherence change detection for building damage is validated but not operationalized into an automated rapid-response pipeline. Sub-meter commercial SAR constellations (Capella, ICEYE) enable individual building classification that Sentinel-1's 20m resolution cannot achieve.",
    impact: "Golden hour response saves lives — every hour of delay in locating damaged buildings costs lives. Reducing assessment time from days to hours could save thousands of lives per major earthquake by directing search and rescue to the most damaged areas immediately."
  },
  {
    id: 32,
    title: "Sand Mining Surveillance Platform",
    tagline: "Track illegal sand extraction from rivers, coasts, and seabeds globally",
    problems: [40, 24, 22],
    dataSources: ["Sentinel-2A/B", "Sentinel-1", "Landsat 8/9", "Planet SuperDove", "JRC Global Surface Water", "Copernicus DEM GLO-30"],
    novelty: 7,
    description: "Detect illegal sand mining by monitoring river channel morphology changes (widening, deepening, bar migration) using Sentinel-2 and Landsat time series waterline extraction. Use Sentinel-1 SAR to detect dredging vessels and equipment on rivers and coastlines. Track coastal sand loss through shoreline recession rates and compare with permitted extraction volumes. Planet SuperDove's daily revisit captures operational timing patterns that reveal unlicensed extraction. Cross-reference JRC surface water for river course stability baselines and Copernicus DEM for volumetric change estimation.",
    whyNovel: "Sand is the world's most consumed solid material but extraction monitoring is virtually nonexistent. The key insight is that illegal sand mining changes river morphology in ways detectable from space — channel widening, bar disappearance, and bank collapse create persistent spectral and geometric signatures in multi-temporal satellite data.",
    impact: "Illegal sand mining causes bridge collapses, aquifer contamination, and coastal erosion affecting hundreds of millions. Monitoring could reduce illegal extraction by 50%+ and protect river ecosystems that support 2B+ people."
  },
  {
    id: 33,
    title: "Light Pollution Biodiversity Impact Mapper",
    tagline: "Quantify where artificial light is killing ecosystems and target reduction",
    problems: [41, 2, 26],
    dataSources: ["VIIRS Day/Night Band", "Sentinel-2A/B", "Dynamic World", "MODIS (Terra/Aqua)", "GEDI"],
    novelty: 7,
    description: "Map artificial light at night (ALAN) exposure across biodiversity-critical habitats using VIIRS Day/Night Band radiance calibrated to ground-level illuminance. Overlay with Sentinel-2 habitat classification and GEDI forest structure to model light penetration into canopy environments. Use Dynamic World to identify the light sources (urban, industrial, agricultural, infrastructure) and MODIS to track seasonal light intensity variation (migration season exposure). Calculate species-specific impact scores using light sensitivity thresholds for key indicator species (sea turtles, migratory birds, pollinators, coral). Generate targeted light reduction prescriptions — which lights, when dimmed, provide maximum ecological benefit.",
    whyNovel: "Light pollution mapping exists but is disconnected from ecological impact. This system connects photon-level exposure modeling with species-specific light sensitivity data across habitats. The prescription engine — identifying which specific lights to modify for maximum biodiversity benefit — is novel and actionable.",
    impact: "Light pollution contributes to insect population collapse (40% decline), bird disorientation (1B+ bird deaths/year from collisions), and coral spawning disruption. Targeted reduction could protect critical ecological processes at fraction of the cost of broad dark-sky regulations."
  },
  {
    id: 34,
    title: "Transboundary Pollution Attribution Engine",
    tagline: "Trace pollution to its source across political boundaries using atmospheric transport modeling",
    problems: [43, 25, 33],
    dataSources: ["Sentinel-5P/TROPOMI", "CAMS (Copernicus)", "Sentinel-2A/B", "MODIS (Terra/Aqua)", "EarthCARE/ATLID"],
    novelty: 8,
    description: "Use TROPOMI NO₂, SO₂, and aerosol columns combined with CAMS atmospheric transport models to trace pollution plumes backward from affected regions to source facilities. Sentinel-2 identifies the specific industrial installations at source locations. MODIS provides synoptic-scale aerosol transport context, and EarthCARE/ATLID delivers vertical aerosol profiles distinguishing surface emissions from transported layers. Generate automated attribution reports: 'X% of particulate pollution in Region A on Date B originated from Facility C in Country D,' with full atmospheric transport chain documentation suitable for diplomatic and legal proceedings.",
    whyNovel: "Transboundary pollution disputes rely on ambient monitoring that can't prove origin. Satellite-based back-trajectory analysis combined with source-level facility identification creates an end-to-end attribution chain. EarthCARE's vertical profiling resolves the altitude ambiguity that undermines existing transport models.",
    impact: "Transboundary pollution causes ~1M premature deaths/year but goes unaddressed because affected countries can't prove source attribution. Legally defensible attribution could trigger billions in pollution reduction investments at source."
  },
  {
    id: 35,
    title: "Informal Settlement Infrastructure Planner",
    tagline: "Map unmapped communities and design their infrastructure from space",
    problems: [44, 15, 11],
    dataSources: ["Maxar WorldView-3", "Sentinel-2A/B", "VIIRS Day/Night Band", "WorldPop", "Copernicus DEM GLO-30", "ECOSTRESS"],
    novelty: 7,
    description: "Map informal settlements at building level using Maxar VHR (0.31m) to extract individual structure footprints, road networks, and open spaces. Sentinel-2 provides land cover context and growth rate monitoring. VIIRS nighttime lights indicate electrification status. Copernicus DEM provides drainage and flood risk. ECOSTRESS maps thermal exposure for heat vulnerability. WorldPop calibrates population estimates. Generate automated infrastructure prioritization plans: which settlements need water, roads, electricity, and drainage most urgently, with engineered layouts that work within existing building patterns.",
    whyNovel: "1B people live in settlements that don't appear on official maps. You can't plan infrastructure for places you haven't mapped. VHR satellite mapping at building level, combined with infrastructure gap analysis from multi-sensor data, creates the planning foundation that municipal governments need but can't produce with their own resources.",
    impact: "Could accelerate infrastructure delivery to 1B+ people in informal settlements by providing the spatial planning data that currently takes years of ground surveys to produce, at a fraction of the cost."
  },
  {
    id: 36,
    title: "Carbon Credit Permanence Monitor",
    tagline: "Watch every forest carbon project continuously for reversal",
    problems: [45, 13, 18],
    dataSources: ["Sentinel-2A/B", "ALOS-2 PALSAR-2", "Global Forest Change", "GEDI", "VIIRS", "Landsat 8/9"],
    novelty: 7,
    description: "Monitor all REDD+ and voluntary forest carbon projects for permanence by tracking canopy cover (Sentinel-2/Landsat time series), forest structure (GEDI biomass), and deforestation incursions (PALSAR-2 L-band for cloud-free tropical forest change detection). Detect fire intrusions using VIIRS active fire data. Cross-reference with Global Forest Change annual loss data. Generate automated permanence risk scores and flag projects where carbon stocks are declining despite active credit issuance. Alert registries and buyers when credited carbon is being released back to the atmosphere.",
    whyNovel: "Carbon credit permanence is currently verified by periodic audits, often years apart. Between audits, forests can burn, be logged, or degrade without credit invalidation. Continuous multi-sensor monitoring creates real-time permanence verification that could become a market standard requirement.",
    impact: "The voluntary carbon market is $2B+ but permanence failures undermine credibility. Continuous monitoring could restore market confidence and redirect billions toward genuinely permanent forest conservation."
  },
  {
    id: 37,
    title: "Locust Swarm Breeding Ground Predictor",
    tagline: "Predict where locust swarms will emerge from soil moisture and vegetation anomalies",
    problems: [48, 3, 42],
    dataSources: ["Sentinel-2A/B", "CHIRPS Precipitation", "ECOSTRESS", "MODIS (Terra/Aqua)", "Landsat 8/9", "Dynamic World"],
    novelty: 8,
    description: "Map desert locust breeding conditions by detecting the convergence of rainfall anomalies (CHIRPS exceeding greening thresholds in arid zones), vegetation greenup in typically barren areas (Sentinel-2/MODIS NDVI anomalies), and soil moisture conditions favorable for egg laying (ECOSTRESS thermal inertia as moisture proxy). Track green vegetation corridors that provide food for hopper bands as they mature and connect. Use Dynamic World to identify cropland in the projected swarm path. Generate 4-8 week breeding emergence forecasts with swarm trajectory projections based on wind patterns.",
    whyNovel: "FAO Desert Locust Watch monitors active swarms but breeding ground prediction relies on scattered ground reports from remote desert areas. The satellite-based approach detects the ecological preconditions for breeding (unusual vegetation in deserts after rare rainfall) weeks before hoppers emerge, providing the lead time needed for targeted control while populations are concentrated.",
    impact: "The 2019-2021 locust crisis caused $8.5B in crop losses across East Africa and South Asia. Breeding ground prediction could enable early-stage control costing 1/100th of emergency response, protecting food supplies for 25M+ people."
  },
  {
    id: 38,
    title: "Maritime Sanctions Evasion Detector",
    tagline: "Find every sanctions-evading ship-to-ship transfer on the ocean",
    problems: [38, 27, 19],
    dataSources: ["Sentinel-1", "ICEYE", "VIIRS Day/Night Band", "Global Fishing Watch", "Sentinel-2A/B"],
    novelty: 7,
    description: "Detect ship-to-ship transfers (used for sanctions evasion, fuel laundering, and illegal transshipment) by identifying vessels in close proximity on the open ocean using Sentinel-1 SAR wide-area scanning. Classify transfer events using ICEYE sub-meter SAR imagery showing vessels rafted alongside each other. Detect nighttime operations via VIIRS Day/Night Band. Cross-reference with Global Fishing Watch AIS data to identify vessels with gaps in tracking records during transfer periods. Sentinel-2 provides supplementary optical confirmation in clear-sky conditions. Generate automated sanctions compliance reports for maritime enforcement agencies.",
    whyNovel: "Ship-to-ship transfers in remote waters are the primary sanctions evasion mechanism for oil, arms, and narcotics. AIS tracking is trivially defeated by transponder shutdown. SAR-based detection doesn't depend on vessel cooperation and can monitor entire ocean areas systematically. The combination of detection + AIS gap correlation creates high-confidence evasion identification.",
    impact: "Sanctions evasion via dark STS transfers enables $10B+ in illicit trade annually. Comprehensive detection could strengthen sanctions regimes protecting international security while disrupting criminal revenue streams."
  },
  {
    id: 39,
    title: "Crop Genetic Diversity Spectral Census",
    tagline: "Map crop variety diversity from orbit to identify monoculture vulnerability",
    problems: [39, 3, 48],
    dataSources: ["EnMAP", "Pixxel Firefly (6 sats)", "Sentinel-2A/B", "MODIS (Terra/Aqua)", "CHIRPS Precipitation"],
    novelty: 9,
    description: "Use EnMAP and Pixxel hyperspectral to distinguish crop varieties within the same species by detecting subtle differences in leaf chemistry (nitrogen content, cell wall composition, pigment ratios) and canopy architecture. Different wheat varieties, for example, have measurably different spectral signatures in the 700-1100nm range. Build phenological variety signatures by tracking spectral changes through growing season via Sentinel-2 time series. Map genetic diversity indices across agricultural regions — identifying areas where a single variety dominates, creating vulnerability to variety-specific pathogens. Overlay CHIRPS climate stress data to flag regions where low diversity intersects climate risk.",
    whyNovel: "Crop maps show what species is planted but not which variety. This distinction is critical for disease vulnerability assessment — the Irish Potato Famine and 1970 Southern Corn Leaf Blight were monoculture catastrophes. Variety-level discrimination from satellite hyperspectral is at the frontier of remote sensing science, newly feasible with 5m resolution from Pixxel.",
    impact: "A single disease adapted to a dominant variety could destroy 20-40% of a major crop's global production. Identifying and mapping variety monocultures enables targeted diversification strategies protecting global food security."
  },
  {
    id: 40,
    title: "Arctic Shipping Oil Spill Readiness Index",
    tagline: "Map spill risk, response capacity, and ecosystem exposure for every Arctic route",
    problems: [47, 9, 27],
    dataSources: ["Sentinel-1", "Sentinel-2A/B", "ICESat-2/ATLAS", "MODIS (Terra/Aqua)", "Sentinel-3 OLCI", "VIIRS"],
    novelty: 7,
    description: "Map Arctic shipping routes against oil spill vulnerability by fusing Sentinel-1 SAR sea ice characterization (ice type, thickness proxy, lead identification) with ICESat-2 freeboard measurements (multi-year vs. first-year ice discrimination). Overlay Sentinel-2/MODIS ocean color for marine ecosystem productivity mapping and Sentinel-3 OLCI for phytoplankton bloom timing. Use VIIRS for vessel traffic density tracking. Calculate route-specific spill risk scores combining ice collision probability, ecosystem exposure value, distance to response infrastructure, and seasonal environmental sensitivity. Generate seasonal routing recommendations that minimize ecological risk.",
    whyNovel: "Arctic shipping is increasing 10%/year but there is zero oil spill response capability in most Arctic waters. This system quantifies the gap between risk and response capacity — creating the data needed for mandatory routing, insurance pricing, and infrastructure investment. No existing system integrates ice hazard, ecosystem value, and response capacity into route-level risk scores.",
    impact: "An Arctic oil spill would be ecologically catastrophic and practically irrecoverable with current technology. Risk-informed routing could prevent spills while enabling the economic benefits of shorter shipping routes."
  },
  {
    id: 41,
    title: "Groundwater Arsenic Risk Mapper",
    tagline: "Predict arsenic contamination from geological and hydrological proxies without drilling",
    problems: [49, 4, 3],
    dataSources: ["EnMAP", "ASTER", "Landsat 8/9", "Sentinel-2A/B", "Copernicus DEM GLO-30", "GRACE-FO"],
    novelty: 8,
    description: "Map arsenic-prone aquifer geology using EnMAP/ASTER SWIR mineralogy to identify arsenic-bearing geological formations (young alluvial sediments with iron oxide spectral signatures, reduced floodplain deposits with characteristic clay mineralogy). Fuse with Landsat/Sentinel-2 temporal analysis of flooding patterns (arsenic mobilization correlates with seasonal reducing conditions in flood-prone areas). Copernicus DEM identifies geomorphic settings associated with arsenic (low-gradient floodplains, old river channels, deltaic deposits). GRACE-FO tracks groundwater extraction rates that alter redox conditions and mobilize arsenic. Generate probability maps of arsenic contamination at 30m resolution, prioritizing areas for targeted well testing.",
    whyNovel: "300M people drink arsenic-contaminated water but well testing at scale is prohibitively expensive ($20-50/well × millions of wells). The geological and hydrological conditions that mobilize arsenic have spectral and geomorphic signatures detectable from space. This enables risk stratification: test the high-probability wells first, potentially reaching 80% of affected populations with 20% of the testing effort.",
    impact: "Arsenic poisoning causes cancer, cardiovascular disease, and developmental impacts in hundreds of millions. Risk-prioritized testing could accelerate the identification of unsafe wells by 10x, enabling targeted water treatment or alternative supply before chronic exposure causes irreversible harm."
  },
  {
    id: 42,
    title: "Heritage Site Looting & Destruction Sentinel",
    tagline: "Detect archaeological looting pits and conflict destruction from sub-meter change detection",
    problems: [50, 16, 23],
    dataSources: ["Maxar WorldView-3", "Sentinel-2A/B", "Sentinel-1", "Copernicus DEM GLO-30"],
    novelty: 7,
    description: "Monitor cultural heritage sites and archaeological areas using Maxar VHR (0.31m) to detect looting pits (characteristic circular or rectangular excavations), unauthorized construction encroachment, and conflict damage. Sentinel-2 provides temporal coverage for change detection between VHR acquisitions. Sentinel-1 SAR enables monitoring through cloud cover and detects structural collapse in conflict zones. Copernicus DEM contextualizes terrain vulnerability to erosion and development pressure. Generate automated alerts for UNESCO, INTERPOL, and national heritage agencies when looting or destruction signatures appear at protected sites.",
    whyNovel: "Satellite-based heritage monitoring has been demonstrated in academic studies (notably for Syrian conflict damage) but isn't operationalized as a systematic global surveillance system. The looting pit spectral and geometric signatures are distinctive and automatable — circular depressions with fresh soil spectral signatures appearing in clusters near known archaeological sites.",
    impact: "Looting and conflict have destroyed thousands of irreplaceable heritage sites in Syria, Iraq, Yemen, and beyond. Systematic monitoring could deter looting (surveillance effect) and enable rapid response to prevent total destruction, preserving humanity's shared cultural record."
  },
  {
    id: 43,
    title: "Energy Poverty Solar Siting Engine",
    tagline: "Optimally site distributed solar for the 600M without electricity",
    problems: [15, 44, 1],
    dataSources: ["VIIRS Day/Night Band", "Sentinel-2A/B", "WorldPop", "Copernicus DEM GLO-30", "MODIS (Terra/Aqua)", "Dynamic World"],
    novelty: 7,
    description: "Identify optimal locations for distributed solar deployment in energy-poor regions by fusing VIIRS nighttime lights (mapping the electrification gap — populated areas with no light), WorldPop (population density requiring service), Sentinel-2 (rooftop and open land availability), Copernicus DEM (terrain shading analysis), and MODIS (cloud cover and solar irradiance estimation). Dynamic World provides land use constraints. Generate site-specific deployment plans for mini-grids and solar home systems: optimal panel placement, expected generation, population served, and cost-per-connection estimates. Prioritize by population density × energy gap × solar resource quality.",
    whyNovel: "Energy access planning in Sub-Saharan Africa and South Asia relies on outdated census data and coarse electrification maps. The fusion of nighttime lights (actual electrification status, not administrative claims) with population data and solar resource assessment creates the first ground-truth-based solar siting tool for energy-poor regions.",
    impact: "600M people in Sub-Saharan Africa lack electricity. Optimal solar siting could accelerate universal energy access by reducing deployment costs 20-30% and ensuring systems are sized correctly for actual population needs."
  },
  {
    id: 44,
    title: "Glacier-Fed Water Supply Countdown Clock",
    tagline: "Calculate when each glacier-dependent city loses its water supply",
    problems: [20, 4, 1],
    dataSources: ["Landsat 8/9", "Sentinel-2A/B", "ICESat-2/ATLAS", "GRACE-FO", "CHIRPS Precipitation", "ECOSTRESS"],
    novelty: 8,
    description: "Track glacier volume loss at individual glacier scale using Landsat/Sentinel-2 area change time series combined with ICESat-2 elevation differencing for thickness change. Fuse with GRACE-FO regional mass balance and CHIRPS precipitation trends (shifting snow-to-rain ratios). Model the glacier contribution to downstream water supply for every glacier-dependent watershed and calculate the 'peak water' date — when glacier meltwater contribution begins declining. Overlay ECOSTRESS agricultural water demand in downstream irrigated areas. Generate countdown timelines for every glacier-dependent city and agricultural region: years until water supply critically declines.",
    whyNovel: "Glacier monitoring exists but isn't connected to downstream water supply implications. The innovation is the end-to-end chain: glacier volume trajectory → meltwater contribution modeling → downstream demand comparison → critical shortage date. This converts an abstract climate metric into a concrete infrastructure planning deadline for specific cities and agricultural regions.",
    impact: "2B people depend on glacier meltwater. Knowing when 'peak water' arrives for each watershed — some within 10-15 years — enables proactive water infrastructure investment, crop transition planning, and managed retreat before crisis hits."
  },
  {
    id: 45,
    title: "Dam & Reservoir Sedimentation Forecaster",
    tagline: "Predict when reservoirs lose storage capacity from upstream erosion",
    problems: [34, 4, 12],
    dataSources: ["Sentinel-2A/B", "Landsat 8/9", "SWOT", "Copernicus DEM GLO-30", "CHIRPS Precipitation", "Dynamic World"],
    novelty: 7,
    description: "Monitor reservoir sedimentation by tracking water surface area changes (Sentinel-2/Landsat) at multiple pool levels to estimate storage-elevation curves over time. Detect turbidity plumes entering reservoirs using Sentinel-2 suspended sediment algorithms. SWOT provides reservoir water level measurements. Model upstream erosion potential from Copernicus DEM terrain analysis, Dynamic World land cover change (deforestation → erosion increase), and CHIRPS rainfall intensity trends. Calculate remaining useful life for every major reservoir based on sedimentation rate trajectories, alerting water managers years before critical storage loss.",
    whyNovel: "Reservoir sedimentation silently reduces global water storage capacity by 1% per year — a crisis hidden below the waterline. Satellite-derived storage curves combined with upstream erosion modeling create a predictive tool that traditional bathymetric surveys (expensive, infrequent) cannot match at global scale.",
    impact: "Sedimentation threatens the water supply and hydropower capacity of reservoirs serving billions. Predictive forecasting enables proactive sediment management, upstream erosion control, and replacement infrastructure planning before critical capacity loss."
  },
  {
    id: 46,
    title: "Wetland Methane Emission Quantification System",
    tagline: "Map the planet's largest natural methane source at wetland scale",
    problems: [1, 31, 8],
    dataSources: ["Sentinel-5P/TROPOMI", "MethaneSAT", "Sentinel-1", "Sentinel-2A/B", "ECOSTRESS", "JRC Global Surface Water"],
    novelty: 8,
    description: "Quantify methane emissions from natural wetlands — the largest natural CH₄ source — by fusing TROPOMI and MethaneSAT atmospheric methane enhancements with Sentinel-1 SAR wetland inundation extent mapping (water under vegetation detectable by C-band). Sentinel-2 provides vegetation type classification (distinguishing high-emitting sedge marshes from lower-emitting forested wetlands). ECOSTRESS maps temperature (microbial methanogenesis rate correlates with temperature). JRC surface water tracks inundation dynamics. Partition the methane signal between natural wetland emissions and anthropogenic sources using spatial correlation with inundation extent. Build the first satellite-based global wetland methane flux product at individual wetland resolution.",
    whyNovel: "Natural wetland methane is the largest uncertainty in the global methane budget — current estimates range 100-230 Tg/year. The fusion of atmospheric methane measurement with SAR-derived inundation mapping enables attribution of methane enhancements to specific wetland complexes. This partitioning between natural and anthropogenic sources has never been achieved at global scale.",
    impact: "Understanding whether natural wetland methane emissions are increasing (a critical climate feedback) versus stable is essential for climate policy. This system resolves a fundamental climate science question while identifying where wetland restoration or drainage management could have the largest climate impact."
  },
  {
    id: 47,
    title: "Post-Disaster Supply Route Optimizer",
    tagline: "Map passable roads within hours of any disaster using SAR and optical fusion",
    problems: [10, 16, 36],
    dataSources: ["Sentinel-1", "Capella Space", "Sentinel-2A/B", "Copernicus DEM GLO-30", "WorldPop", "VIIRS Day/Night Band"],
    novelty: 7,
    description: "Assess road network passability within hours of earthquakes, floods, or cyclones using Sentinel-1 wide-area SAR change detection (flood extent, landslide debris, bridge damage) combined with Capella sub-meter SAR for critical route bottleneck assessment. Sentinel-2 provides pre-disaster road network baselines. Copernicus DEM models landslide and flood risk for alternative routes. WorldPop identifies stranded population clusters. VIIRS nighttime light loss maps power outage extent. Generate optimized humanitarian logistics routes that account for road condition, population need, and supply depot locations — updated as conditions change.",
    whyNovel: "Disaster logistics currently operate with hours-old ground reports on a few main roads. SAR provides near-complete road network status assessment (passable/blocked) across entire affected regions within hours, regardless of weather or time of day. The route optimization layer transforms raw damage data into actionable logistics decisions.",
    impact: "Logistics delays are the primary cause of preventable post-disaster deaths. Optimal routing could reduce delivery time to affected populations by 40-60%, saving thousands of lives per major disaster event."
  },
  {
    id: 48,
    title: "Renewable Energy Land Use Conflict Resolver",
    tagline: "Site solar and wind farms where they help ecosystems instead of harming them",
    problems: [15, 2, 32],
    dataSources: ["Sentinel-2A/B", "Dynamic World", "GEDI", "MODIS (Terra/Aqua)", "Copernicus DEM GLO-30", "Global Human Modification"],
    novelty: 7,
    description: "Identify optimal renewable energy sites that avoid biodiversity conflict by fusing Dynamic World land cover with GEDI habitat structure data (avoiding structurally complex habitats), Global Human Modification index (preferring already-modified landscapes), and Sentinel-2 vegetation condition (avoiding high-quality remnant habitat). MODIS provides solar irradiance estimation and wind proxy data. Copernicus DEM enables terrain-based wind resource assessment. Generate conflict-free siting maps that maximize energy production while minimizing habitat loss, with agrivoltaic compatibility scores for agricultural lands.",
    whyNovel: "Renewable energy deployment increasingly conflicts with biodiversity conservation — solar farms on desert tortoise habitat, wind farms on bird migration corridors. No current siting tool integrates energy resource quality with multi-layer ecological sensitivity at the detail needed for project-level decisions.",
    impact: "The energy transition requires 500,000+ km² of new renewable installations. Smart siting could prevent the displacement of critical habitat while accelerating deployment by reducing permitting conflicts and litigation."
  },
  {
    id: 49,
    title: "Microplastic River-to-Ocean Tracking System",
    tagline: "Trace plastic pollution from land sources through rivers to ocean accumulation zones",
    problems: [33, 9, 22],
    dataSources: ["Sentinel-2A/B", "PACE/OCI", "Sentinel-3 OLCI", "MODIS (Terra/Aqua)", "JRC Global Surface Water", "Dynamic World"],
    novelty: 8,
    description: "Map macroplastic accumulation in rivers using Sentinel-2's spectral bands — floating plastic debris has distinctive reflectance in NIR and SWIR bands distinguishable from vegetation and foam. Track debris transport through river systems using temporal image sequences and JRC surface water flow paths. Use PACE/Sentinel-3 ocean color to detect microplastic-associated changes in sea surface spectral properties and phytoplankton community shifts. Identify land-based sources by correlating plastic detection density with upstream land use (Dynamic World) and waste management infrastructure. MODIS provides context for large-scale marine debris accumulation patterns. Generate source-to-sink pollution budgets for every major river system.",
    whyNovel: "80% of ocean plastic enters via rivers but river plastic monitoring is virtually nonexistent. Satellite detection of floating plastic using spectral signatures is newly validated (2023-2025 research). The source-to-sink tracing concept — following plastic from land through rivers to ocean — creates accountability chains connecting specific pollution sources to downstream impacts.",
    impact: "11M tons of plastic enter the ocean annually. Source identification enables targeted intervention at the ~1,000 rivers responsible for 80% of ocean plastic input, dramatically more cost-effective than ocean cleanup."
  },
  {
    id: 50,
    title: "Nuclear Legacy Site Contamination Tracker",
    tagline: "Monitor nuclear and industrial contamination plumes from vegetation stress spectral signatures",
    problems: [28, 4, 12],
    dataSources: ["EnMAP", "PRISMA", "Sentinel-2A/B", "Landsat 8/9", "ECOSTRESS", "GRACE-FO"],
    novelty: 9,
    description: "Detect subsurface contamination plume migration at nuclear and industrial legacy sites by identifying vegetation stress spectral signatures: plants growing over contamination plumes show altered leaf chemistry (metal accumulation changes SWIR absorption features), reduced chlorophyll (visible reflectance shifts), and thermal stress (ECOSTRESS canopy temperature anomalies). Use EnMAP/PRISMA hyperspectral to discriminate contamination-specific stress from drought or nutrient stress via unique spectral signatures of heavy metal phytotoxicity. Track plume migration over time using Landsat/Sentinel-2 multi-decadal vegetation stress archives. GRACE-FO provides groundwater flow direction context for plume trajectory prediction.",
    whyNovel: "Thousands of contaminated sites exist from Cold War nuclear programs, industrial waste, and mining. Subsurface monitoring requires expensive wells. The insight that contamination plumes alter vegetation spectral signatures in detectable, contamination-specific ways enables non-invasive monitoring from space. Multi-temporal analysis reveals plume migration directions and velocities without drilling a single well.",
    impact: "Could provide early warning of contamination plume migration toward water supplies at thousands of legacy sites, protecting drinking water for millions of people at a fraction of the cost of traditional groundwater monitoring networks."
  }
];

const DOMAIN_COLORS = {
  "Environment": { bg: "#0a2f1f", accent: "#22c55e", text: "#bbf7d0" },
  "Human": { bg: "#2a1020", accent: "#f472b6", text: "#fce7f3" },
  "Resource": { bg: "#1a1a2e", accent: "#818cf8", text: "#e0e7ff" },
};

const CATEGORY_COLORS = [
  "#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#a855f7",
  "#ec4899", "#14b8a6", "#6366f1", "#f97316"
];

export default function SpectralSolutionsAtlas() {
  const [activeTab, setActiveTab] = useState("solutions");
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [hoveredProblem, setHoveredProblem] = useState(null);
  const [freeDataOnly, setFreeDataOnly] = useState(false);

  const allSources = DATA_SOURCES.flatMap(c => c.sources);
  const sourceIsFree = (name) => {
    const s = allSources.find(src => src.name === name);
    return s ? s.free : false;
  };
  const solutionFreeCount = (sol) => sol.dataSources.filter(sourceIsFree).length;
  const solutionAllFree = (sol) => sol.dataSources.every(sourceIsFree);
  const solutionFreeRatio = (sol) => solutionFreeCount(sol) / sol.dataSources.length;

  const sortedSolutions = [...SOLUTIONS].sort((a, b) => {
    if (freeDataOnly) {
      const aFree = solutionAllFree(a);
      const bFree = solutionAllFree(b);
      if (aFree !== bFree) return bFree - aFree;
      const ratioSort = solutionFreeRatio(b) - solutionFreeRatio(a);
      if (Math.abs(ratioSort) > 0.01) return ratioSort;
    }
    return b.novelty - a.novelty;
  });

  const tabs = [
    { id: "solutions", label: "Creative Solutions", icon: "◆" },
    { id: "data", label: "Data Atlas", icon: "◫" },
    { id: "problems", label: "Global Problems", icon: "▲" },
  ];

  const renderSeverityBar = (severity) => (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          width: 6, height: 16,
          borderRadius: 1,
          backgroundColor: i < severity
            ? severity >= 9 ? "#ef4444" : severity >= 7 ? "#f59e0b" : "#22c55e"
            : "rgba(255,255,255,0.08)"
        }} />
      ))}
    </div>
  );

  const renderNoveltyDots = (n) => (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          backgroundColor: i < n ? "#818cf8" : "rgba(255,255,255,0.08)",
          boxShadow: i < n ? "0 0 6px rgba(129,140,248,0.4)" : "none"
        }} />
      ))}
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Instrument Sans', 'DM Sans', system-ui, sans-serif",
      backgroundColor: "#0a0a0f",
      color: "#e2e8f0",
      minHeight: "100vh",
      padding: 0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(129,140,248,0.1); } 50% { box-shadow: 0 0 30px rgba(129,140,248,0.25); } }
        .solution-card { transition: all 0.3s ease; cursor: pointer; }
        .solution-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .tab-btn { transition: all 0.2s ease; cursor: pointer; }
        .tab-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .cat-row { transition: all 0.2s ease; cursor: pointer; }
        .cat-row:hover { background: rgba(255,255,255,0.04) !important; }
        .problem-row { transition: all 0.2s ease; }
        .problem-row:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "32px 24px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)"
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: 3,
          color: "#818cf8",
          textTransform: "uppercase",
          marginBottom: 8
        }}>
          Geospatial Intelligence × Global Problems
        </div>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#f8fafc",
          marginBottom: 8
        }}>
          Spectral Solutions Atlas
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, maxWidth: 640 }}>
          Mapping 80+ geospatial and spectral data sources against 50 critical global problems to surface 50 creative, never-been-done solutions at their intersection.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
      }}>
        {tabs.map(t => (
          <button key={t.id} className="tab-btn" onClick={() => { setActiveTab(t.id); setSelectedSolution(null); }} style={{
            padding: "14px 20px",
            fontSize: 13,
            fontWeight: 600,
            color: activeTab === t.id ? "#818cf8" : "#64748b",
            background: "none",
            border: "none",
            borderBottom: activeTab === t.id ? "2px solid #818cf8" : "2px solid transparent",
            fontFamily: "inherit",
          }}>
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>

        {/* ===== SOLUTIONS TAB ===== */}
        {activeTab === "solutions" && !selectedSolution && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                50 extraordinary opportunities — ranked by {freeDataOnly ? "free data availability, then " : ""}novelty — where multi-sensor spectral fusion solves problems no single technology can address.
              </div>
              <button onClick={() => setFreeDataOnly(!freeDataOnly)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 8,
                border: freeDataOnly ? "1px solid #22c55e55" : "1px solid rgba(255,255,255,0.1)",
                background: freeDataOnly ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)",
                color: freeDataOnly ? "#22c55e" : "#94a3b8",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s ease", whiteSpace: "nowrap",
              }}>
                <div style={{
                  width: 32, height: 18, borderRadius: 9, padding: 2,
                  background: freeDataOnly ? "#22c55e" : "rgba(255,255,255,0.15)",
                  transition: "background 0.2s ease",
                  display: "flex", alignItems: "center",
                  justifyContent: freeDataOnly ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: "#fff",
                    transition: "all 0.2s ease",
                  }} />
                </div>
                Free data priority
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sortedSolutions.map((s, i) => (
                <div key={s.id} className="solution-card" onClick={() => setSelectedSolution(s)}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: "18px 20px",
                    animation: `fadeIn 0.4s ease ${i * 0.06}s both`,
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          color: "#818cf8",
                          backgroundColor: "rgba(129,140,248,0.12)",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}>#{i + 1}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{s.title}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#22c55e", fontStyle: "italic", marginBottom: 8 }}>{s.tagline}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {s.problems.map(pid => {
                          const p = PROBLEMS.find(pp => pp.id === pid);
                          const c = DOMAIN_COLORS[p.domain];
                          return (
                            <span key={pid} style={{
                              fontSize: 10,
                              padding: "2px 8px",
                              borderRadius: 3,
                              backgroundColor: c.bg,
                              color: c.accent,
                              border: `1px solid ${c.accent}33`,
                            }}>{p.name}</span>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 80 }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>NOVELTY</div>
                      {renderNoveltyDots(s.novelty)}
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 8 }}>
                        {s.dataSources.length} sensors fused
                      </div>
                      <div style={{ fontSize: 10, marginTop: 6, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                        {solutionAllFree(s) ? (
                          <span style={{ color: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid #22c55e44", padding: "1px 8px", borderRadius: 3, fontWeight: 600 }}>ALL FREE</span>
                        ) : (
                          <span style={{ color: "#f59e0b" }}>{solutionFreeCount(s)}/{s.dataSources.length} free</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SOLUTION DETAIL ===== */}
        {activeTab === "solutions" && selectedSolution && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <button onClick={() => setSelectedSolution(null)} style={{
              background: "none", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", fontSize: 12, padding: "6px 14px", borderRadius: 6,
              cursor: "pointer", marginBottom: 20, fontFamily: "inherit"
            }}>← Back to all solutions</button>

            <div style={{
              background: "linear-gradient(135deg, rgba(129,140,248,0.08), rgba(34,197,94,0.06))",
              border: "1px solid rgba(129,140,248,0.15)",
              borderRadius: 12, padding: 24, marginBottom: 20,
              animation: "pulseGlow 4s ease infinite"
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#818cf8", letterSpacing: 2, marginBottom: 6 }}>
                SOLUTION #{SOLUTIONS.indexOf(selectedSolution) + 1}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{selectedSolution.title}</h2>
              <div style={{ fontSize: 14, color: "#22c55e", fontStyle: "italic", marginBottom: 16 }}>{selectedSolution.tagline}</div>

              <div style={{ display: "flex", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>NOVELTY SCORE</div>
                  {renderNoveltyDots(selectedSolution.novelty)}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>PROBLEMS ADDRESSED</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {selectedSolution.problems.map(pid => {
                      const p = PROBLEMS.find(pp => pp.id === pid);
                      const c = DOMAIN_COLORS[p.domain];
                      return <span key={pid} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, backgroundColor: c.bg, color: c.accent, border: `1px solid ${c.accent}33` }}>{p.name}</span>;
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: "#64748b" }}>SENSOR FUSION STACK</span>
                {solutionAllFree(selectedSolution) ? (
                  <span style={{ fontSize: 9, color: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid #22c55e44", padding: "1px 8px", borderRadius: 3, fontWeight: 600 }}>ALL FREE DATA</span>
                ) : (
                  <span style={{ fontSize: 9, color: "#f59e0b" }}>{solutionFreeCount(selectedSolution)}/{selectedSolution.dataSources.length} free</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {selectedSolution.dataSources.map(ds => {
                  const isFree = sourceIsFree(ds);
                  return (
                    <span key={ds} style={{
                      fontSize: 11, padding: "4px 10px", borderRadius: 4,
                      background: isFree ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                      color: "#e2e8f0",
                      border: isFree ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(245,158,11,0.2)",
                      fontFamily: "'Space Mono', monospace",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {ds}
                      <span style={{ fontSize: 8, color: isFree ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>{isFree ? "FREE" : "PAID"}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {[
              { label: "HOW IT WORKS", content: selectedSolution.description },
              { label: "WHY THIS HAS NEVER BEEN DONE", content: selectedSolution.whyNovel },
              { label: "POTENTIAL IMPACT", content: selectedSolution.impact },
            ].map((section, i) => (
              <div key={i} style={{
                marginBottom: 16, padding: "16px 20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                animation: `fadeIn 0.4s ease ${0.1 + i * 0.1}s both`
              }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10, color: "#818cf8", letterSpacing: 2, marginBottom: 8
                }}>{section.label}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#cbd5e1" }}>{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* ===== DATA ATLAS TAB ===== */}
        {activeTab === "data" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
              {DATA_SOURCES.reduce((a, c) => a + c.sources.length, 0)} sources across {DATA_SOURCES.length} sensing modalities — from multispectral optical to gravity field measurements.
            </div>
            {DATA_SOURCES.map((cat, ci) => (
              <div key={cat.category} style={{
                marginBottom: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                overflow: "hidden",
                animation: `fadeIn 0.3s ease ${ci * 0.04}s both`
              }}>
                <div className="cat-row" onClick={() => setExpandedCategory(expandedCategory === ci ? null : ci)}
                  style={{
                    padding: "14px 18px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: expandedCategory === ci ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: CATEGORY_COLORS[ci % CATEGORY_COLORS.length] }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{cat.category}</span>
                    <span style={{
                      fontSize: 11, color: "#64748b",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      padding: "1px 8px", borderRadius: 10
                    }}>{cat.sources.length}</span>
                  </div>
                  <span style={{ color: "#64748b", fontSize: 14, transform: expandedCategory === ci ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                </div>
                {expandedCategory === ci && (
                  <div style={{ padding: "0 18px 14px" }}>
                    {cat.sources.map((s, si) => (
                      <div key={si} style={{
                        padding: "10px 0",
                        borderTop: si > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        animation: `fadeIn 0.2s ease ${si * 0.03}s both`
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.name}</span>
                            {s.gee && <span style={{ fontSize: 9, color: "#22c55e", marginLeft: 8, padding: "1px 6px", borderRadius: 3, border: "1px solid #22c55e44", backgroundColor: "rgba(34,197,94,0.08)" }}>GEE</span>}
                            <span style={{ fontSize: 9, marginLeft: 6, padding: "1px 6px", borderRadius: 3, color: s.free ? "#22c55e" : "#f59e0b", border: s.free ? "1px solid #22c55e44" : "1px solid #f59e0b44", backgroundColor: s.free ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)" }}>{s.free ? "FREE" : "PAID"}</span>
                          </div>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#64748b" }}>{s.provider}</span>
                        </div>
                        <div style={{ display: "flex", gap: 16, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}><strong style={{ color: "#cbd5e1" }}>Bands:</strong> {s.bands}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}><strong style={{ color: "#cbd5e1" }}>Res:</strong> {s.res}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}><strong style={{ color: "#cbd5e1" }}>Revisit:</strong> {s.revisit}</span>
                        </div>
                        <div style={{ fontSize: 11, color: CATEGORY_COLORS[ci % CATEGORY_COLORS.length], marginTop: 4, opacity: 0.8 }}>{s.key}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== PROBLEMS TAB ===== */}
        {activeTab === "problems" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>
              50 critical global problems — independently prioritized by severity, addressability, and scale — ranked by impact potential.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {Object.entries(DOMAIN_COLORS).map(([d, c]) => (
                <span key={d} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, backgroundColor: c.bg, color: c.accent, border: `1px solid ${c.accent}33` }}>{d}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[...PROBLEMS].sort((a, b) => b.severity - a.severity).map((p, i) => {
                const c = DOMAIN_COLORS[p.domain];
                const linkedSolutions = SOLUTIONS.filter(s => s.problems.includes(p.id));
                const isExpanded = hoveredProblem === p.id;
                return (
                  <div key={p.id} className="problem-row"
                    onClick={() => setHoveredProblem(isExpanded ? null : p.id)}
                    style={{
                      padding: "14px 18px",
                      background: isExpanded ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
                      border: `1px solid ${isExpanded ? c.accent + "33" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      animation: `fadeIn 0.3s ease ${i * 0.03}s both`
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: c.accent }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: c.accent }}>{p.domain}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {linkedSolutions.length > 0 && (
                          <span style={{ fontSize: 10, color: "#818cf8", backgroundColor: "rgba(129,140,248,0.1)", padding: "2px 8px", borderRadius: 4 }}>
                            {linkedSolutions.length} solution{linkedSolutions.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {renderSeverityBar(p.severity)}
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: `2px solid ${c.accent}22`, animation: "fadeIn 0.3s ease" }}>
                        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
                        {linkedSolutions.length > 0 && (
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>LINKED SOLUTIONS:</div>
                            {linkedSolutions.map(s => (
                              <div key={s.id}
                                onClick={(e) => { e.stopPropagation(); setActiveTab("solutions"); setSelectedSolution(s); }}
                                style={{
                                  fontSize: 12, color: "#818cf8", cursor: "pointer",
                                  padding: "4px 0",
                                  textDecoration: "underline",
                                  textDecorationColor: "rgba(129,140,248,0.3)"
                                }}>
                                → {s.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "20px 24px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        fontSize: 10, color: "#475569",
        fontFamily: "'Space Mono', monospace",
        letterSpacing: 0.5
      }}>
        Sources: Google Earth Engine Catalog · ESA Copernicus · NASA EarthData · Planet Labs · Pixxel · Kuva Space · EnMAP · WEF Global Risks Report 2026 · IRC Emergency Watchlist 2026
      </div>
    </div>
  );
}
