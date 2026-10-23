// Editorial research, not scraped instructions or verified campaign performance.
export const researchDate='2026-10-24';
export type MarketingSource={name:string;url:string;observation:string;evidence:'case study'|'official service'|'creator website'|'editorial profile';lesson:string};
const source=(name:string,url:string,observation:string,evidence:MarketingSource['evidence'],lesson:string):MarketingSource=>({name,url,observation,evidence,lesson});
export const agencies:MarketingSource[]=[
 source('Kobe','https://www.getkobe.com/case-studies/kobe-case-study-geniebook/','Geniebook case pairs Singapore parent creators with multiple Instagram assets.','case study','Match the parenting segment, then build several useful pieces around one experience.'),
 source('Hashmeta','https://hashmeta.com/capabilities/influencer-marketing/','Combines creator selection, content and distribution through its own platforms.','official service','Assess audience fit and distribution together.'),
 source('Partipost','https://www.partipost.com/markets/singapore','Examples ask participants to experience a showroom, product or service before sharing.','case study','Use firsthand activity demonstrations before endorsement.'),
 source('Narrators','https://www.narrators.io/','Describes sourcing, content management and conversion reporting as one workflow.','official service','Keep brief, assets, approvals and outcomes together.'),
 source('KOL Digital','https://www.koldigital.sg/mommy-influencers-singapore/','Organises parent campaigns around different family stages.','official service','Choose a defined parent need rather than a generic family audience.'),
 source('TSL Media Group','https://thesmartlocal.com/advertise/amp/','Offers editorial guides, short videos and direct distribution.','official service','Turn one useful local guide into complementary formats.'),
 source('HEPMIL','https://www.hepmil.com/','Combines entertainment content, creators and media distribution.','official service','Open with a recognisable local situation and a story.'),
 source('Heroes of Digital','https://www.heroesofdigital.com/','Positions acquisition around qualified leads, bookings and revenue tracking.','official service','Measure linked enquiries and completed bookings separately.'),
 source('OOm','https://www.oom.com.sg/','Combines search, paid media and social services.','official service','Capture existing activity intent after proving the destination.'),
 source('Impossible Marketing','https://www.impossible.sg/','Provides search visibility, ads and social acquisition.','official service','Build searchable parent questions into useful content.'),
 source('First Page Digital','https://www.firstpagedigital.sg/','Offers search optimisation and performance marketing.','official service','Give every discovery piece one relevant destination.'),
 source('Digital Business Lab','https://digital-business-lab.com/about-us/','Combines storytelling, video production, analytics and social management.','official service','Plan the story and measurement before production.'),
 source('GOODSTUPH','https://goodstuph.org/','Uses local social ideas, reactive content and video.','official service','Make the hook locally recognisable without forcing trends.'),
 source('We Are Social','https://wearesocial.com/sg/services/','Connects cultural insights, creators, production and paid distribution.','official service','Give GoBela a consistent role in parents’ routines.'),
 source('Gushcloud','https://www.gushcloud.com/','Combines talent representation, brand strategy and media production.','official service','Specify usage rights and production needs before talent selection.'),
 source('Brew Interactive','https://brewinteractive.com/about-us/','Connects content, acquisition and marketing automation.','official service','Review the full journey from discovery to enquiry.'),
 source('Mutant','https://www.thisismutant.com/sg','Integrates PR, content, branding and social.','official service','Use an evidenced family problem as the launch story.'),
 source('antics@play','https://www.anticsatplay.com/about/','Uses brand strategy, creative, PR and social.','official service','Keep the family-time promise consistent across formats.'),
 source('The Secret Little Agency','https://www.thesecretlittleagency.com/','Creative agency considered for brand campaigns; accessible website provides little methodological detail.','official service','Insufficient public evidence for a specific performance playbook.'),
 source('Construct Digital','https://www.constructdigital.com/','Focuses on integrated B2B pipeline, creative and attribution.','official service','Apply to partner acquisition rather than parent reach.')
];
const kobe='https://www.getkobe.com/blog/parents-influencer/';
const mcn='https://www.mcnasia.com/top-parenting-lifestyle-creators-singapore/';
const bykido='https://www.bykido.com/pages/friends-of-bykido-who-we-follow';
export const creators:MarketingSource[]=[
 source('Cheekiemonkies','https://www.cheekiemonkie.net/','Publishes family outings, indoor/outdoor discovery and personal parenting stories.','creator website','Create saveable outing guides; verify current child-age audience before hiring.'),
 source('Sabrina Seah · @bigtreeandkoala',mcn,'Profile highlights creative play and kid-friendly experiences.','editorial profile','Show one concrete activity journey.'),
 source('Liang May · @mmlittlee',bykido,'BYKidO highlights candid family outing reviews.','editorial profile','Include practical experience details and limitations.'),
 source('Summer Goh · @ahappymum','https://www.ahappymum.com/','Publishes family activities, travel and recurring personal stories.','creator website','Build a recognisable recurring family-time series.'),
 source('Steven · @theperfectfather',bykido,'BYKidO highlights experiences with a large family.','editorial profile','Include dads and practical family logistics.'),
 source('Jacinth · Our Little Playnest','https://ourlittleplaynest.com/','Offers free parent resources, workshops and ongoing programmes.','creator website','Lead with a useful resource, then offer a relevant next step.'),
 source('Dawn Sim · @thatmomoffour',mcn,'Profile combines family wellness, yoga and an example Reel/Stories campaign.','editorial profile','Connect movement content to a real parent-child activity.'),
 source('Diah Mastura · @etrangle',kobe,'Profile describes family outings and Muslim family life.','editorial profile','Make family examples culturally relevant.'),
 source('Ying Tian · @eyeletskirt',kobe,'Profile describes creative play and family activities.','editorial profile','Offer a small activity parents can try themselves.'),
 source('Sherlyn Chan · @sherlynchanwp',mcn,'Profile describes home cooking and everyday parenting.','editorial profile','Connect Cook content to real routines.'),
 source('Aarika Lee · @aarikalee',mcn,'Profile combines creative work and family life.','editorial profile','Link arts experiences to shared family interests.'),
 source('Sarah X Miracle · @sarahxmiracle',kobe,'Profile combines music and family storytelling.','editorial profile','Use an emotional story with a clear activity connection.'),
 source('Tjin Lee · @tjinlee',kobe,'Profile includes education perspectives and family experiences.','editorial profile','Frame enrichment around connection and exploration.'),
 source('Ruby Liang · @familystaysg',bykido,'BYKidO highlights family holiday and staycation discovery.','editorial profile','Organise recommendations as practical itineraries.'),
 source('Lawrence · @3wheelingtots',bykido,'BYKidO highlights video coverage of family experiences.','editorial profile','Show what the experience feels like before asking for action.'),
 source('Audrey Tan · @audt',mcn,'Profile includes visually curated family hospitality campaigns.','editorial profile','Keep polished imagery grounded in experience details.'),
 source('Melissa Koh · @melissackoh',kobe,'Profile combines lifestyle and motherhood.','editorial profile','Use lifestyle context while retaining a concrete family benefit.'),
 source('Mongchin · @mongabong',kobe,'Profile combines parenting and everyday lifestyle.','editorial profile','Demonstrate usefulness inside a busy routine.'),
 source('Annette Lee','https://familiesforlife.sg/pages/Article/Asians-on-Asian-Parenting','Families for Life highlights humour about parenting and local family life.','editorial profile','Turn planning frustration into a relatable opening.'),
 source('MoMo Twins · @leialauren','https://www.socialhipper.com/parenting-influencers-in-singapore','Listed as a family account; current audience and commercial approach are unverified.','editorial profile','Do not infer Singapore parent reach from total followers.')
];
export const playbooks=[
 {id:'discovery',title:'Useful discovery before promotion',sources:[agencies[5],creators[0],creators[2]],adaptation:'One practical activity shortlist, a cinematic Reel and a saveable guide. Use current catalogue facts and one enquiry destination.'},
 {id:'experience',title:'Show the experience before asking for a booking',sources:[agencies[0],agencies[2],creators[1]],adaptation:'Prepare a firsthand class story. Use approved GoBela cast only; no invented parent endorsement or instructor faces.'},
 {id:'education',title:'Teach something parents can use today',sources:[creators[5],creators[8],creators[10]],adaptation:'A simple connection-through-play guide, followed by a relevant verified Learn or Play listing.'},
 {id:'story',title:'A local problem with an emotional payoff',sources:[agencies[6],agencies[12],creators[18]],adaptation:'Turn weekend planning overload into a visible shared family moment. Preserve narrative movement and restrained overlays.'},
 {id:'measurement',title:'Close the loop on useful outcomes',sources:[agencies[7],agencies[3],agencies[15]],adaptation:'Use explicit campaign codes, enquiries and completed booking links. Never substitute follower counts for conversions.'},
];
