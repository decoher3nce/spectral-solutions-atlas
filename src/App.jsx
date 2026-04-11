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
  { id: 20, name: "Glacial Retreat & Sea Level Rise", domain: "Environment", severity: 9, desc: "Glaciers feeding 2B people's water supply are retreating. Sea level rise threatens 1B in coastal zones. Ice mass loss acceleration poorly constrained." }
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
          Mapping 80+ geospatial and spectral data sources against 20 critical global problems to surface the most creative, never-been-done solutions at their intersection.
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
                10 extraordinary opportunities — ranked by {freeDataOnly ? "free data availability, then " : ""}novelty — where multi-sensor spectral fusion solves problems no single technology can address.
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
              20 critical global problems — independently prioritized by severity, addressability, and scale — ranked by impact potential.
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
