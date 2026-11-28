/**
 * Small lookup of Singapore neighbourhoods / MRT stations so Ask Bela can
 * turn "near Bishan" into coordinates without a geocoding API. Coordinates
 * are approximate (station or town centre) — they only need to be good to
 * a few hundred metres for a "within ~5 km" filter. Regions use a centroid
 * and a wider radius.
 */
export type Area = {
	name: string;
	lat: number;
	lng: number;
	radiusKm: number;
	aliases?: string[];
};

const AREA_RADIUS_KM = 5;
const REGION_RADIUS_KM = 9;

type Row = [name: string, lat: number, lng: number, aliases?: string[]];

const AREA_ROWS: Row[] = [
	// Central / city
	["Orchard", 1.304, 103.8318, ["orchard road", "ion orchard"]],
	["Somerset", 1.3007, 103.839],
	["Dhoby Ghaut", 1.299, 103.8455, ["plaza singapura"]],
	["City Hall", 1.2931, 103.852, ["esplanade"]],
	["Raffles Place", 1.284, 103.8515, ["cbd"]],
	["Marina Bay", 1.2765, 103.8545, ["gardens by the bay", "marina bay sands"]],
	["Bugis", 1.3009, 103.8559],
	["Chinatown", 1.2844, 103.8443],
	["Outram Park", 1.2803, 103.8395, ["outram"]],
	["Tanjong Pagar", 1.2765, 103.8458],
	["Tiong Bahru", 1.2862, 103.827],
	["Havelock", 1.2884, 103.8337, ["havelock road"]],
	["River Valley", 1.294, 103.837, ["great world", "robertson quay"]],
	["Tanglin", 1.305, 103.8237, ["tanglin mall"]],
	["Stevens", 1.32, 103.826],
	["Newton", 1.3138, 103.838],
	["Novena", 1.3204, 103.8438],
	["Little India", 1.3066, 103.8494],
	["Farrer Park", 1.3124, 103.8541],
	["Lavender", 1.3073, 103.863],
	["Balestier", 1.3255, 103.85],
	["Botanic Gardens", 1.3224, 103.8152],
	["Bukit Timah", 1.333, 103.793, ["sixth avenue", "king albert park", "upper bukit timah"]],
	["Beauty World", 1.3412, 103.7759],
	["Hillview", 1.3627, 103.7674],
	["Redhill", 1.2896, 103.8168],
	["Bukit Merah", 1.2819, 103.8239, ["henderson"]],
	["Queenstown", 1.2945, 103.806],
	["Alexandra", 1.2875, 103.8055, ["alexandra road"]],
	["Labrador Park", 1.2722, 103.8027, ["labrador"]],
	["HarbourFront", 1.2653, 103.822, ["harbour front", "vivocity", "vivo city"]],
	["Telok Blangah", 1.2707, 103.8097, ["blangah rise"]],
	["Sentosa", 1.2494, 103.8303],
	// North / central-north
	["Thomson", 1.3541, 103.8327, ["upper thomson", "thomson plaza"]],
	["Marymount", 1.3487, 103.8395],
	["Caldecott", 1.3375, 103.8393],
	["Toa Payoh", 1.3327, 103.8474, ["tpy"]],
	["Braddell", 1.3404, 103.847],
	["Bishan", 1.351, 103.8485, ["junction 8"]],
	["Ang Mo Kio", 1.37, 103.8496, ["amk"]],
	["Lentor", 1.385, 103.836],
	["Yishun", 1.4295, 103.835],
	["Khatib", 1.4174, 103.8329],
	["Sembawang", 1.4491, 103.8201],
	["Admiralty", 1.4406, 103.801],
	["Woodlands", 1.437, 103.7865, ["causeway point"]],
	["Kranji", 1.4251, 103.762],
	// North-east
	["Potong Pasir", 1.3313, 103.8688],
	["Woodleigh", 1.3393, 103.8707, ["bidadari"]],
	["Serangoon", 1.3498, 103.8737, ["nex", "serangoon gardens"]],
	["Bartley", 1.3428, 103.8797],
	["Kovan", 1.3602, 103.8853],
	["Hougang", 1.3713, 103.8925],
	["Buangkok", 1.3829, 103.8929],
	["Sengkang", 1.3917, 103.8954],
	["Punggol", 1.4053, 103.9023],
	["Seletar", 1.4045, 103.869],
	// East
	["Kallang", 1.3114, 103.8714, ["kallang wave", "sports hub"]],
	["Stadium", 1.3029, 103.8753],
	["Mountbatten", 1.3062, 103.8826],
	["Aljunied", 1.3164, 103.8829, ["geylang"]],
	["MacPherson", 1.3266, 103.89],
	["Tai Seng", 1.3358, 103.8879],
	["Ubi", 1.33, 103.899],
	["Paya Lebar", 1.3176, 103.8924, ["plq"]],
	["Eunos", 1.3197, 103.903],
	["Joo Chiat", 1.3125, 103.902],
	["Katong", 1.305, 103.905, ["tanjong katong", "parkway parade"]],
	["Marine Parade", 1.3027, 103.907],
	["East Coast", 1.301, 103.912, ["east coast park", "east coast road"]],
	["Siglap", 1.3135, 103.926],
	["Kembangan", 1.321, 103.913],
	["Bedok", 1.324, 103.93],
	["Bedok Reservoir", 1.3365, 103.9321],
	["Eastwood", 1.3185, 103.956],
	["Tanah Merah", 1.3272, 103.9465],
	["Simei", 1.3432, 103.9533],
	["Tampines", 1.354, 103.945],
	["Pasir Ris", 1.373, 103.9493],
	["Changi", 1.3892, 103.9876, ["changi village", "changi airport", "jewel"]],
	// West
	["Holland Village", 1.3112, 103.7961, ["holland v", "holland"]],
	["Buona Vista", 1.3072, 103.79, ["one-north", "one north"]],
	["Kent Ridge", 1.2934, 103.7845],
	["Pasir Panjang", 1.2762, 103.7914],
	["Dover", 1.3114, 103.7786],
	["West Coast", 1.2958, 103.764, ["west coast park"]],
	["Clementi", 1.3151, 103.7652],
	["Jurong East", 1.3333, 103.7422, ["jurong", "jem", "westgate"]],
	["Lakeside", 1.3442, 103.721, ["jurong lake"]],
	["Jurong West", 1.3404, 103.709],
	["Boon Lay", 1.3386, 103.7058],
	["Pioneer", 1.3376, 103.6974],
	["Bukit Batok", 1.349, 103.7496],
	["Tengah", 1.374, 103.73],
	["Bukit Panjang", 1.3784, 103.762],
	["Choa Chu Kang", 1.3854, 103.7443, ["cck"]],
	["Yew Tee", 1.3973, 103.7475],
];

const REGION_ROWS: Row[] = [
	["East", 1.34, 103.935, ["east side", "eastern"]],
	["West", 1.345, 103.73, ["west side", "western"]],
	["North", 1.425, 103.81, ["north side", "northern"]],
	["North-East", 1.375, 103.89, ["north east", "northeast"]],
	["Central", 1.305, 103.835, ["town", "city", "city centre", "city center"]],
];

export const AREAS: Area[] = [
	...AREA_ROWS.map(([name, lat, lng, aliases]) => ({ name, lat, lng, radiusKm: AREA_RADIUS_KM, aliases })),
	...REGION_ROWS.map(([name, lat, lng, aliases]) => ({ name, lat, lng, radiusKm: REGION_RADIUS_KM, aliases })),
];

function normalize(text: string): string {
	return ` ${text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\b(mrt|lrt|station|interchange|area|estate|near|around|singapore)\b/g, " ")
		.replace(/\s+/g, " ")
		.trim()} `;
}

const KEYS: { key: string; area: Area }[] = AREAS.flatMap((area) =>
	[area.name, ...(area.aliases ?? [])].map((label) => ({ key: normalize(label), area })),
).sort((a, b) => b.key.length - a.key.length);

/**
 * Resolves free text ("Bishan MRT", "near amk", "Kick Off! Kovan,
 * Singapore") to a known area. Exact matches win; otherwise the longest
 * known name contained as whole words is used, so "Bedok Reservoir" beats
 * "Bedok" and "East Coast" beats the "East" region.
 */
export function resolveArea(text: unknown): Area | null {
	if (typeof text !== "string") return null;
	const input = normalize(text);
	if (!input.trim()) return null;
	const exact = KEYS.find(({ key }) => key === input);
	if (exact) return exact.area;
	const contained = KEYS.find(({ key }) => input.includes(key));
	return contained?.area ?? null;
}

export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
