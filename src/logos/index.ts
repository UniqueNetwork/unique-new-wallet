// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
const chainDusty = '/logos/chains/dusty.png';
const chainHydrate = '/logos/chains/hydrate.png';
const chainKusama = '/logos/chains/kusama-128.gif';
const chainPolkaBTC = '/logos/chains/polkabtc.png';
const chainQuartz = '/logos/chains/quartz.png';
const chainRococo = '/logos/chains/rococo.svg';
const chainRococoTick = '/logos/chains/rococo-tick.svg';
const chainRococoTrack = '/logos/chains/rococo-track.svg';
const chainRococoTrick = '/logos/chains/rococo-trick.svg';
const chainSnakenet = '/logos/chains/snakenet.svg';
const chainUnique = '/logos/chains/unique.svg';
const extensionPolkadotJs = '/logos/extensions/polkadot-js.svg';
const externalCommonwealth = '/logos/external/commonwealth.png';
const externalPolkascan = '/logos/external/polkascan.png';
const externalPolkassembly = '/logos/external/polkassembly.png';
const externalPolkastats = '/logos/external/polkastats.png';
const externalSubscan = '/logos/external/subscan.svg';
const nodeAcala = '/logos/nodes/acala-circle.svg';
const nodeAres = '/logos/nodes/ares.svg';
const nodeBifrost = '/logos/nodes/bifrost.svg';
const nodeBitCountry = '/logos/nodes/bitcountry.svg';
const nodeCanvas = '/logos/nodes/canvas-2.png';
const nodeCentrifuge = '/logos/nodes/centrifuge.png';
const nodeChainx = '/logos/nodes/chainx.svg';
const nodeClover = '/logos/nodes/clover.svg';
const nodeCrab = '/logos/nodes/crab.svg';
const nodeCrust = '/logos/nodes/crust.svg';
const nodeDarwinia = '/logos/nodes/darwinia.png';
const nodeDataHighway = '/logos/nodes/datahighway.png';
const nodeDockMainnet = '/logos/nodes/dock-mainnet.png';
const nodeDockTestnet = '/logos/nodes/dock-testnet.png';
const nodeDotMog = '/logos/nodes/dotmog.svg';
const nodeEdgeware = '/logos/nodes/edgeware-circle.svg';
const nodeEncointerNotee = '/logos/nodes/encointer-notee.svg';
const nodeEncointerTeeproxy = '/logos/nodes/encointer-teeproxy.svg';
const nodeEquilibrium = '/logos/nodes/equilibrium.svg';
const nodeHanonycash = '/logos/nodes/hanonycash.svg';
const nodeIdavoll = '/logos/nodes/idavoll.png';
const nodeIntegritee = '/logos/nodes/integritee.svg';
const nodeJupiter = '/logos/nodes/jupiter.svg';
const nodeKilt = '/logos/nodes/kilt.svg';
const nodeKulupu = '/logos/nodes/kulupu.svg';
const nodeLaminar = '/logos/nodes/laminar-circle.svg';
const nodeLitentry = '/logos/nodes/litentry.png';
const nodeMath = '/logos/nodes/math.svg';
const moonbeam = '/logos/nodes/moonbeam.png';
const nodeNodle = '/logos/nodes/nodle.svg';
const nodePhala = '/logos/nodes/phala.svg';
const nodePlasm = '/logos/nodes/plasm.png';
const nodePolkaBTC = '/logos/nodes/polkabtc.png';
const nodePolkadex = '/logos/nodes/polkadex.svg';
const nodePolkadot = '/logos/nodes/polkadot-circle.svg';
const nodePolkadotJs = '/logos/nodes/polkadot-js.svg';
const nodeQuartz = '/logos/nodes/quartz.png';
const nodeRealis = '/logos/nodes/realis.png';
const nodeRobonomics = '/logos/nodes/robonomics.svg';
const nodeSgc = '/logos/nodes/sgc.svg';
const nodeSora = '/logos/nodes/sora-substrate.svg';
const nodeStafi = '/logos/nodes/stafi.png';
const nodeSubDAO = '/logos/nodes/subdao.png';
const nodeSubsocial = '/logos/nodes/subsocial.svg';
const nodeSubstrate = '/logos/nodes/substrate-hexagon.svg';
const nodeTernoa = '/logos/nodes/ternoa.svg';
const nodeTrustBase = '/logos/nodes/trustbase.png';
const nodeUniarts = '/logos/nodes/uniarts.png';
const nodeUnique = '/logos/nodes/unique.svg';
const nodeZenlink = '/logos/nodes/zenlink.svg';
const nodeZero = '/logos/nodes/zero.svg';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos: Record<string, unknown> = [
  ['Ares PC1', nodeAres],
  ['Crust PC1', nodeCrust],
  ['ChainX', nodeChainx],
  ['darwinia crab', nodeCrab],
  ['Darwinia PC2', nodeDarwinia],
  ['DataHighway', nodeDataHighway],
  ['Dusty', chainDusty],
  ['Galois', nodeMath],
  ['HydraDX Hydrate', chainHydrate],
  ['HydraDX Snakenet', chainSnakenet],
  ['Encointer PC1', nodeEncointerNotee],
  ['Idavoll', nodeIdavoll],
  ['IntegriTEE PC1', nodeIntegritee],
  ['Jupiter A1', nodeJupiter],
  ['Jupiter PC1', nodeJupiter],
  ['KILT PC1', nodeKilt],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['MathChain PC1', nodeMath],
  ['Moonbase Alpha', moonbeam],
  ['Moonbase Stage', moonbeam],
  ['Moonbase Development Testnet', moonbeam],
  ['PolkaBTC', nodePolkaBTC],
  ['PolkaBTC Staging', nodePolkaBTC],
  ['Polkadex Testnet', nodePolkadex],
  ['Phala PC1', nodePhala],
  ['QUARTZ by UNIQUE', chainQuartz],
  ['ReAlis Network', nodeRealis],
  ['Rococo', chainRococo],
  ['Sgc', nodeSgc],
  ['Tick', chainRococoTick],
  ['Track', chainRococoTrack],
  ['Trick', chainRococoTrick],
  ['TrustBase PC1', nodeTrustBase],
  ['Uniarts', nodeUniarts],
  ['Unique', chainUnique],
].reduce(
  (logos, [chain, logo]): Record<string, unknown> => ({
    ...logos,
    [chain.toLowerCase()]: logo,
  }),
  {},
);

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos: Record<string, unknown> = [
  ['Acala Node', nodeAcala],
  ['Ares Node', nodeAres],
  ['Ares Parachain Collator', nodeAres],
  ['mandala node', nodeAcala],
  ['airalab-robonomics', nodeRobonomics],
  ['Bifrost Node', nodeBifrost],
  ['Bifrost', nodeBifrost],
  ['BitCountry Node', nodeBitCountry],
  ['Bit.Country', nodeBitCountry],
  ['Bit Country Tewai Parachain Collator', nodeBitCountry],
  ['Canvas Node', nodeCanvas],
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['ChainX Node', nodeChainx],
  ['Clover Node', nodeClover],
  ['darwinia crab', nodeCrab],
  ['crust', nodeCrust],
  ['Crust Collator', nodeCrust],
  ['darwinia', nodeDarwinia],
  ['darwinia parachain', nodeDarwinia],
  ['Darwinia Runtime Module Library', nodeDarwinia],
  ['DataHighway', nodeDataHighway],
  ['DataHighway Node', nodeDataHighway],
  ['DataHighway Parachain Collator', nodeDataHighway],
  ['Dock Full Node', nodeDockMainnet],
  ['DOTMog Node', nodeDotMog],
  ['Edgeware Node', nodeEdgeware],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['Galois', nodeMath],
  ['hanonycash', nodeHanonycash],
  ['Idavoll Node', nodeIdavoll],
  ['KILT Node', nodeKilt],
  ['KILT Collator', nodeKilt],
  ['kulupu', nodeKulupu],
  ['Laminar Node', nodeLaminar],
  ['Litentry Collator', nodeLitentry],
  ['node-template', nodeSubstrate],
  ['Nodle Chain Node', nodeNodle],
  ['Patract Node', nodeJupiter],
  ['Polkadex Node', nodePolkadex],
  ['parity-polkadot', nodePolkadot],
  ['Plasm', nodePlasm],
  ['Plasm Node', nodePlasm],
  ['Plasm Parachain Collator', nodePlasm],
  ['phala-substrate-node', nodePhala],
  ['Phala Collator', nodePhala],
  ['polkadot-js', nodePolkadotJs],
  ['Quartz Node', nodeQuartz],
  ['ReAlis Network', nodeRealis],
  ['Sgc', nodeSgc],
  ['SORA-staging Node', nodeSora],
  ['Stafi Node', nodeStafi],
  ['Stafi', nodeStafi],
  ['subsocial-node', nodeSubsocial],
  ['substrate-node', nodeSubstrate],
  ['Equilibrium Node', nodeEquilibrium],
  ['Equilibrium', nodeEquilibrium],
  ['SUBZΞRO', nodeZero],
  ['Ternoa Node', nodeTernoa],
  ['TrustBase Node', nodeTrustBase],
  ['TrustBase Collator', nodeTrustBase],
  ['Zenlink', nodeZenlink],
  ['Zenlink Collator', nodeZenlink],
  ['SubDAO Collator', nodeSubDAO],
  ['Uniarts', nodeUniarts],
  ['Unique Node', nodeUnique],
].reduce(
  (logos, [node, logo]): Record<string, unknown> => ({
    ...logos,
    [node.toLowerCase().replace(/-/g, ' ')]: logo,
  }),
  {},
);

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos: Record<string, unknown> = {
  acala: nodeAcala,
  alexander: nodePolkadot,
  bifrost: nodeBifrost,
  bitcountry: nodeBitCountry,
  canvas: nodeCanvas,
  centrifuge: nodeCentrifuge,
  chainx: nodeChainx,
  clover: nodeClover,
  crab: nodeCrab,
  crust: nodeCrust,
  darwinia: nodeDarwinia,
  datahighway: nodeDataHighway,
  'dock-mainnet': nodeDockMainnet,
  'dock-testnet': nodeDockTestnet,
  dotmog: nodeDotMog,
  dusty: chainDusty,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  encointer_cantillon: nodeEncointerTeeproxy,
  encointer_gesell: nodeEncointerNotee,
  equilibrium: nodeEquilibrium,
  galois: nodeMath,
  hanonycash: nodeHanonycash,
  idavoll: nodeIdavoll,
  jupiter: nodeJupiter,
  kilt: nodeKilt,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  laminar: nodeLaminar,
  moonbaseAlpha: moonbeam,
  nodle: nodeNodle,
  phala: nodePhala,
  plasm: nodePlasm,
  polkabtc: nodePolkaBTC,
  polkadex: nodePolkadex,
  polkadot: nodePolkadot,
  quartz: nodeQuartz,
  realis: nodeRealis,
  rococo: chainRococo,
  rococoAcala: nodeAcala,
  rococoAres: nodeAres,
  rococoBifrost: nodeBifrost,
  rococoBitCountry: nodeBitCountry,
  rococoChainX: nodeChainx,
  rococoClover: nodeClover,
  rococoCrust: nodeCrust,
  rococoDarwinia: nodeDarwinia,
  rococoDataHighway: nodeDataHighway,
  rococoEncointer: nodeEncointerNotee,
  rococoHydrate: chainHydrate,
  rococoIdavoll: nodeIdavoll,
  rococoIntegritee: nodeIntegritee,
  rococoJupiter: nodeJupiter,
  rococoKilt: nodeKilt,
  rococoLaminar: nodeLaminar,
  rococoLitentry: nodeLitentry,
  rococoMathChain: nodeMath,
  rococoPhala: nodePhala,
  rococoPlasm: nodePlasm,
  rococoPolkabtc: chainPolkaBTC,
  rococoRobonomics: nodeRobonomics,
  rococoSubDAO: nodeSubDAO,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  rococoTrustBase: nodeTrustBase,
  rococoZenlink: nodeZenlink,
  sgc: nodeSgc,
  snakenet: chainSnakenet,
  'sora-substrate': nodeSora,
  stafi: nodeStafi,
  subsocial: nodeSubsocial,
  substrate: nodeSubstrate,
  'ternoa-chaos': nodeTernoa,
  uniarts: nodeUniarts,
  unique: nodeUnique,
  westend: nodePolkadot,
  zero: nodeZero,
};

// extension logos
export const extensionLogos: Record<string, unknown> = {
  'polkadot-js': extensionPolkadotJs,
};

// external logos, i.e. for explorers
export const externalLogos: Record<string, unknown> = {
  commonwealth: externalCommonwealth,
  polkascan: externalPolkascan,
  polkassembly: externalPolkassembly,
  polkastats: externalPolkastats,
  subscan: externalSubscan,
};

// empty logos
export const emptyLogos: Record<string, unknown> = {
  empty: emptyLogo,
};
