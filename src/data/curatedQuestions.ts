import { UGCQuestion } from '../types';

export const CURATED_QUESTIONS: UGCQuestion[] = [
  // Question 1: Walther Penck vs W.M. Davis (Geomorphology) - Assertion & Reason
  {
    id: 'cq-geo-01',
    topic: 'Davisian vs Penckian Cycle of Erosion & Slope Development',
    unit: 'Unit I: Geomorphology',
    paper: 'Paper 2 (Geography)',
    format: 'assertion_reason',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Given below are two statements, one is labelled as Assertion (A) and the other is labelled as Reason (R):',
    assertion: 'Walther Penck asserted that landforms are not the outcome of a sequential passage of time through youth, maturity, and old age, but represent an expression of the varying ratio between the rate of upliftment and the rate of degradation.',
    reason: 'According to Penck, upliftment and degradation operate simultaneously from the very inception, unlike Davis who assumed that erosion does not commence until the entire upliftment of the landmass is completed.',
    options: [
      { id: '1', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A).' },
      { id: '2', text: 'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).' },
      { id: '3', text: '(A) is true, but (R) is false.' },
      { id: '4', text: '(A) is false, but (R) is true.' },
    ],
    correctOptionId: '1',
    correctExplanation: `Both Assertion (A) and Reason (R) are true, and (R) directly explains (A). Walther Penck, in his seminal 1924 work "Die Morphologische Analyse", fundamentally broke from W.M. Davis's concept of 'stage' (time). Penck emphasized that relief features develop as a dynamic relationship between endogenetic forces (rate of upliftment) and exogenetic forces (rate of erosion). Crucially, Davis held that "upliftment is rapid and takes place in a short period during which no erosion occurs" — an unrealistic premise that Penck rectified by establishing that uplift and denudation are coeval (simultaneous from day one). Thus, the ratio of rates (Aufsteigende, Gleichförmige, and Absteigende Entwicklung) dictates the morphological landscape rather than elapsed chronological time.`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: 'Both statements are doctrinally accurate according to Penckian geomorphological theory, and (R) provides the exact theoretical mechanism that validates (A).',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: '(R) is not merely another true fact; it is the causal explanation of why landforms reflect the ratio of rates rather than sequential Davisian time periods.',
        examTrap: 'NTA NET often tests whether you can distinguish between two isolated true facts versus an actual cause-and-effect relationship.',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: '(R) is undeniably true; Davis posited erosion commences only after uplift terminates, whereas Penck explicitly demonstrated coeval operations.',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: '(A) accurately encapsulates Penck\'s core definition of geomorphology as morphological analysis.',
      },
    ],
    keyConceptTakeaway: 'Davis = Sequential Time & Stage (Structure, Process, Stage). Penck = Ratio of Uplift : Degradation (Aufsteigende [waxing], Gleichförmige [uniform], Absteigende [waning]). Uplift and erosion occur SIMULTANEOUSLY in Penck.',
  },

  // Question 2: Koppen Climate Classification - Multi-Statement (Climatology)
  {
    id: 'cq-geo-02',
    topic: "Koppen's Scheme of Climatic Classification (Sub-types & Letters)",
    unit: 'Unit II: Climatology',
    paper: 'Paper 2 (Geography)',
    format: 'multi_statement',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Consider the following statements regarding Wladimir Köppen\'s climatic classification:',
    statements: [
      { label: 'Statement I', text: 'In Köppen\'s scheme, the boundary between "A" (Tropical) and "C" (Warm Temperate) climates is the coldest month mean temperature of 18°C.' },
      { label: 'Statement II', text: 'The second letter \'s\' indicates dry summer, where the precipitation in the driest summer month is less than one-third of the wettest winter month.' },
      { label: 'Statement III', text: 'The climatic code \'Cwg\' designates a humid subtropical climate with a dry winter and the hottest month occurring before the summer solstice, characteristic of the Ganga Plain in India.' },
      { label: 'Statement IV', text: 'The distinction between \'BW\' (Arid Desert) and \'BS\' (Semi-arid Steppe) depends strictly on mean annual temperature exceeding 25°C.' },
    ],
    options: [
      { id: '1', text: 'Statements I, II and III only are correct' },
      { id: '2', text: 'Statements I, III and IV only are correct' },
      { id: '3', text: 'Statements II and IV only are correct' },
      { id: '4', text: 'Statements I, II, III and IV are all correct' },
    ],
    correctOptionId: '1',
    correctExplanation: `Statements I, II, and III are correct; Statement IV is incorrect.
1. Statement I is correct: 18°C is the universal threshold isotherm for the coldest month separating A (all months > 18°C) from C (coldest month between -3°C [or 0°C] and 18°C).
2. Statement II is correct: The letter 's' signifies summer drought (Mediterranean type, Cs), defined as driest summer month precipitation < 30mm and less than 1/3 of the wettest winter month.
3. Statement III is correct: In 'Cwg', 'C' = warm temperate, 'w' = dry winter, and 'g' = Gangetic temperature curve (maximum temperature occurs in May/June before the monsoon rains and summer solstice).
4. Statement IV is INCORRECT: The threshold dividing BW (desert) and BS (steppe) is precipitation calculated as a function of temperature and seasonal concentration (r = 2t + 28 if rain mainly in summer, r = 2t if rain mainly in winter, r = 2t + 14 if evenly distributed). If precipitation is less than half this threshold, it is BW; if between half and the full threshold, it is BS. It is NEVER a simple cutoff of mean annual temperature > 25°C (which relates to 'h' vs 'k').`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: 'Only Statements I, II, and III adhere to Köppen\'s empirical botanical and thermal criteria.',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: 'Includes Statement IV, which falsely asserts BW/BS distinction is based on temperature alone.',
        examTrap: 'NTA deliberately mixes the \'BW/BS\' precipitation threshold with the \'h/k\' (hot vs cold, 18°C mean annual temperature) modifier.',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: 'Omits Statement I, which is one of the foundational tenets of Köppen\'s system.',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: 'Assumes all statements are true without detecting the classical trap in Statement IV.',
      },
    ],
    keyConceptTakeaway: "In Koppen's formula: 'g' = Ganges type (warmest month precedes solstice/monsoon). 'h' = heiss (mean annual temp > 18°C), 'k' = kalt (cold, < 18°C). BW vs BS is determined by PRECIPITATION THRESHOLD (r), not absolute temperature.",
  },

  // Question 3: Matching - Geomorphology / Geographic Thought (Match List I with List II)
  {
    id: 'cq-geo-03',
    topic: 'Major Geomorphic Concepts and their Propounders',
    unit: 'Unit I: Geomorphology',
    paper: 'Paper 2 (Geography)',
    format: 'matching',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Match List I (Geomorphological Concept / Term) with List II (Propounder / Geomorphologist):',
    list1Title: 'List I (Concept / Term)',
    list1: [
      { code: 'A', text: 'Pediplanation and Scarp Retreat' },
      { code: 'B', text: 'Dynamic Equilibrium Theory' },
      { code: 'C', text: 'Panplain' },
      { code: 'D', text: 'Base Level of Erosion' },
    ],
    list2Title: 'List II (Geomorphologist)',
    list2: [
      { code: '1', text: 'J.W. Powell (1875)' },
      { code: '2', text: 'L.C. King (1953)' },
      { code: '3', text: 'J.T. Hack (1960)' },
      { code: '4', text: 'C.H. Crickmay (1933)' },
    ],
    options: [
      { id: '1', text: 'A-2, B-3, C-4, D-1' },
      { id: '2', text: 'A-3, B-2, C-1, D-4' },
      { id: '3', text: 'A-2, B-1, C-4, D-3' },
      { id: '4', text: 'A-4, B-3, C-2, D-1' },
    ],
    correctOptionId: '1',
    correctExplanation: `The correct pairing is A-2, B-3, C-4, D-1:
- A. Pediplanation & Scarp Retreat -> L.C. King (1953/1962). King developed the cycle of pediplanation based on South African semi-arid landscapes, featuring pediments and parallel retreat of scarps (inselsbergs).
- B. Dynamic Equilibrium Theory -> J.T. Hack (1960). Hack proposed that landforms exist in an open-system steady state where form is adjusted to ongoing processes rather than changing through time.
- C. Panplain -> C.H. Crickmay (1933). Crickmay proposed that lateral planation by rivers coalesces adjacent floodplains to create an extensive erosional plain called a "panplain", challenging Davis's peneplain.
- D. Base Level of Erosion -> J.W. Powell (1875). In his exploration of the Colorado River and Uinta Mountains, Powell formulated the concept of sea level as the ultimate "base level" below which dry subaerial erosion cannot degrade the land.`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: 'All four associations are historically and theoretical accurate.',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: 'Inverts King and Hack, and misattributes Base Level to Crickmay.',
        examTrap: 'Confusing Crickmay\'s Panplain with Davis\'s Peneplain and King\'s Pediplain is one of the most common NTA traps.',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: 'Falsely links J.W. Powell to Dynamic Equilibrium (which belongs to Hack).',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: 'Mismatches Crickmay with Pediplanation.',
      },
    ],
    keyConceptTakeaway: 'Peneplain = W.M. Davis | Endrumpf/Primärrumpf = W. Penck | Pediplain = L.C. King | Panplain = C.H. Crickmay | Etchplain = Wayland | Base Level = J.W. Powell (1875) | Dynamic Equilibrium = J.T. Hack (1960).',
  },

  // Question 4: Geographic Thought - Paradigm Shifts (Chronology & Concepts)
  {
    id: 'cq-geo-04',
    topic: 'Evolution of Geographical Paradigms: From Positivism to Radical Geography',
    unit: 'Unit VIII: Geographic Thought',
    paper: 'Paper 2 (Geography)',
    format: 'multi_statement',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Which of the following statements regarding paradigm shifts in Geographical Thought are CORRECT?',
    statements: [
      { label: 'Statement I', text: 'The Quantitative Revolution aimed to transform geography from an idiographic (descriptive) discipline into a nomothetic (law-seeking) spatial science.' },
      { label: 'Statement II', text: 'David Harvey\'s intellectual journey represents a transition from spatial science (Explanation in Geography, 1969) to Marxist/Radical Geography (Social Justice and the City, 1973).' },
      { label: 'Statement III', text: 'Humanistic Geography, championed by Yi-Fu Tuan and Edward Relph, fully embraced quantitative spatial modeling and logical positivism.' },
      { label: 'Statement IV', text: 'The concept of "Genre de vie" was introduced by Friedrich Ratzel to support Environmental Determinism.' },
    ],
    options: [
      { id: '1', text: 'Statements I and II only are correct' },
      { id: '2', text: 'Statements I, II and III only are correct' },
      { id: '3', text: 'Statements II and IV only are correct' },
      { id: '4', text: 'Statements I, III and IV only are correct' },
    ],
    correctOptionId: '1',
    correctExplanation: `Statements I and II are correct, while Statements III and IV are fundamentally incorrect.
- Statement I is correct: Led by Ian Burton, William Bunge, Peter Haggett, and Richard Chorley, the Quantitative Revolution (QR) explicitly rejected regional exceptionalism (Hartshorne's idiographic view) in favor of nomothetic law-making based on physics and geometry.
- Statement II is correct: David Harvey authored "Explanation in Geography" (1969), the definitive philosophical treatise on quantitative methods and logical positivism, but within 4 years published "Social Justice and the City" (1973), openly denouncing spatial science as status-quo ideology and founding modern Marxist/radical geography.
- Statement III is INCORRECT: Humanistic Geography was born as a fierce CRITIQUE of quantitative modeling and positivism. Yi-Fu Tuan (Topophilia, 1974) and Edward Relph (Place and Placelessness, 1976) introduced phenomenological and existential understandings of human attachment to space ('place' vs 'space').
- Statement IV is INCORRECT: "Genre de vie" (lifestyle/livelihood) was formulated by Paul Vidal de la Blache, the founder of French Possibilism, NOT Friedrich Ratzel (who coined Lebensraum and Anthropogeographie).`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: 'Only I and II withstand critical scrutiny.',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: 'Statement III claims Humanistic Geography embraced quantitative modeling, which is the exact opposite of its founding mission (it was an anti-positivist revolt).',
        examTrap: 'Candidates often confuse which paradigm opposed which; Humanism & Radicalism arose simultaneously in late 1960s/70s against Positivism.',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: 'Statement IV misattributes Vidal de la Blache\'s concept to Ratzel.',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: 'Contains both erroneous statements (III and IV).',
      },
    ],
    keyConceptTakeaway: 'Idiographic = Regional description (Hartshorne). Nomothetic = General law-seeking (Schaefer, Bunge). Positivism -> Attacked by: 1) Behaviouralism (Kirk/Wolpert), 2) Humanism (Tuan/Relph), 3) Radical/Marxist (Harvey/Peet). Genre de vie = Vidal de la Blache.',
  },

  // Question 5: Economic Geography - Alfred Weber Location Theory
  {
    id: 'cq-geo-05',
    topic: "Alfred Weber's Theory of Industrial Location: Material Index and Isodapanes",
    unit: 'Unit VI: Economic Geography & Regional Development',
    paper: 'Paper 2 (Geography)',
    format: 'assertion_reason',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Given below are two statements, one is labelled as Assertion (A) and the other is labelled as Reason (R):',
    assertion: 'In Alfred Weber\'s Industrial Location Theory, if the Material Index (MI) of an industry is greater than 1.0 (MI > 1), the optimal plant location will be oriented towards the raw material source rather than the consumption market.',
    reason: 'A Material Index greater than 1 indicates that localized gross raw materials lose substantial weight during the manufacturing process, making it more cost-effective to transport the lighter finished product than the heavy raw material.',
    options: [
      { id: '1', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A).' },
      { id: '2', text: 'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).' },
      { id: '3', text: '(A) is true, but (R) is false.' },
      { id: '4', text: '(A) is false, but (R) is true.' },
    ],
    correctOptionId: '1',
    correctExplanation: `Both (A) and (R) are true, and (R) correctly explains (A).
Weber defined the Material Index as:
MI = (Weight of localized raw materials) / (Weight of finished product).
- When raw materials are "pure" (e.g., yarn into cloth), they lose no weight during processing, so MI = 1.0, and the factory can be located anywhere between source and market.
- When raw materials are "ubiquitous" (available everywhere like water or air), they pull location toward the market (MI < 1).
- When raw materials are "gross" and "weight-losing" (e.g., iron ore, coal, sugarcane), the weight of raw material exceeds the finished product (MI > 1). Transporting raw material incurs higher freight charges than transporting the final product (e.g. sugar vs sugarcane). Hence, the least-cost transport point pulls the production unit directly to the raw material site.`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: 'Both the definition of MI > 1 and its mechanical explanation via weight-losing gross raw materials are fully congruent.',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: '(R) directly provides the mathematical and economic causality of (A).',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: '(R) is accurate; weight loss during processing is the defining hallmark of gross materials.',
        examTrap: 'NTA often tries to confuse "pure materials" with "gross materials" or swaps the numerator and denominator of the Material Index.',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: '(A) is a foundational principle of Weberian location theory.',
      },
    ],
    keyConceptTakeaway: 'Weber\'s Material Index = Weight of localized raw materials / Weight of finished product. MI > 1 = Raw material oriented (weight-losing, e.g. Iron & Steel, Sugar). MI < 1 = Market oriented (weight-gaining or ubiquitous). Critical Isodapane = Line where savings in labor cost equal additional transport cost.',
  },

  // Question 6: Geographical Techniques - Nearest Neighbour Analysis (Rn)
  {
    id: 'cq-geo-06',
    topic: 'Nearest Neighbour Analysis (Clark and Evans Rn Index)',
    unit: 'Unit IX: Geographical Techniques & GIS',
    paper: 'Paper 2 (Geography)',
    format: 'conceptual_analysis',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'In Clark and Evans (1954) Nearest Neighbour Analysis, a researcher calculates an Rn index value of 0.12 for a set of rural settlements in an alluvial basin. What does this statistical value signify regarding the spatial distribution pattern?',
    options: [
      { id: '1', text: 'The distribution is highly clustered, approaching a single point pattern.' },
      { id: '2', text: 'The distribution is purely random, exhibiting Poisson distribution characteristics.' },
      { id: '3', text: 'The distribution is tending strongly towards a uniform hexagonal lattice (dispersed).' },
      { id: '4', text: 'The calculation indicates an erroneous dataset, as Rn values cannot fall below 1.0.' },
    ],
    correctOptionId: '1',
    correctExplanation: `Option 1 is correct.
The Clark and Evans Nearest Neighbour Index (Rn) measures the degree of spatial departure from randomness:
Rn = Observed mean distance (r_obs) / Expected mean distance in a random distribution (r_exp).
The theoretical range of Rn is strictly from 0 to 2.1491 (approximately 2.15):
- Rn = 0: Maximum clustering (all points coalesce into a single location / complete agglomeration).
- Rn = 1.0: Pure random distribution (Poisson distribution).
- Rn = 2.15: Maximum dispersion / perfectly uniform spacing (equilateral triangular / hexagonal lattice).
An Rn value of 0.12 is very close to 0, indicating an intense clustered or agglomerated spatial pattern.`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: '0.12 lies in the range [0.0 - 0.5], representing strong agglomeration/clustering.',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: 'A random distribution requires Rn to be approximately 1.0 (specifically 0.8 - 1.2).',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: 'Uniform/dispersed distribution requires Rn approaching 2.15.',
        examTrap: 'NTA traps candidates by reversing the scale: assuming 0 means "zero clustering" or "scattered". In Rn analysis, 0 is COMPLETE CLUSTERING.',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: 'Rn values range continuously from 0.0 to 2.15; values below 1.0 are standard for clustered phenomena.',
      },
    ],
    keyConceptTakeaway: 'Rn Scale: 0.00 = Absolute Clustering -> 1.00 = Perfectly Random -> 2.15 = Maximum Dispersion (Hexagonal pattern). Formula: r_exp = 1 / (2 * sqrt(density)).',
  },

  // Question 7: Paper 1 - Research Aptitude (Type I and Type II Errors)
  {
    id: 'cq-p1-01',
    topic: 'Hypothesis Testing: Type I and Type II Errors',
    unit: 'Unit II: Research Aptitude',
    paper: 'Paper 1',
    format: 'assertion_reason',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Given below are two statements, one is labelled as Assertion (A) and the other is labelled as Reason (R):',
    assertion: 'A researcher commits a Type I error (False Positive) when they reject a null hypothesis (H₀) that is actually true in the population.',
    reason: 'Lowering the significance level (α) from 0.05 to 0.01 reduces the probability of committing a Type I error, but simultaneously increases the risk of committing a Type II error (β).',
    options: [
      { id: '1', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A).' },
      { id: '2', text: 'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).' },
      { id: '3', text: '(A) is true, but (R) is false.' },
      { id: '4', text: '(A) is false, but (R) is true.' },
    ],
    correctOptionId: '2',
    correctExplanation: `Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).
- Assertion (A) correctly states the canonical statistical definition of a Type I error: rejecting a true null hypothesis (designated by alpha, α).
- Reason (R) is also a completely true statistical fact: There is an inverse tradeoff between Type I error (α) and Type II error (β). Making the criterion for rejecting H₀ more stringent (e.g. from 5% to 1%) makes it harder to reject H₀, thus reducing Type I error while increasing the likelihood of failing to reject a false H₀ (Type II error).
- However, (R) describes the tradeoff between α and β when adjusting significance thresholds; it does NOT explain the constitutional definition of why rejecting a true H₀ constitutes a Type I error. Hence, both are true, but (R) is not the causal explanation of (A).`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Incorrect',
        explanation: 'While both statements are correct statistical facts, (R) explores error tradeoffs, not the definition of Type I error itself.',
        examTrap: 'This is the most notorious NTA Paper 1 pattern: two true statements in research methodology where aspirants mistakenly mark Option 1.',
      },
      {
        optionId: '2',
        verdict: 'Correct',
        explanation: 'Both statements are true independently, but (R) does not explain the definitional premise of (A).',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: '(R) is mathematically sound; the inverse relationship between alpha and beta is a proven law of statistical decision theory.',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: '(A) is the textbook definition of Type I error.',
      },
    ],
    keyConceptTakeaway: 'Type I Error (α) = Reject True H₀ (convicting an innocent person). Type II Error (β) = Fail to reject False H₀ (letting a guilty person walk free). Power of test = 1 - β. As α decreases, β increases.',
  },

  // Question 8: Paper 1 - Logical Reasoning (Nyaya Pramanas)
  {
    id: 'cq-p1-02',
    topic: 'Indian Logic (Pramanas in Nyaya Philosophy)',
    unit: 'Unit VI: Logical Reasoning',
    paper: 'Paper 1',
    format: 'multi_statement',
    difficulty: 'High-Level (Latest Pattern)',
    questionStem: 'Which of the following statements regarding Pramanas (means of valid knowledge) in classical Indian philosophy are CORRECT?',
    statements: [
      { label: 'Statement I', text: 'According to the Nyaya school, there are six valid Pramanas: Pratyaksha, Anumana, Upamana, Shabda, Arthapatti, and Anupalabdhi.' },
      { label: 'Statement II', text: 'Arthapatti (Postulation / Derivation from circumstances) is accepted as an independent Pramana by the Advaita Vedanta and Bhatta Mimamsa schools, but rejected as independent by Nyaya (subsumed under Anumana).' },
      { label: 'Statement III', text: 'The classic example "Devadatta is fat, yet he does not eat during the day; therefore, he eats at night" is an illustration of Arthapatti.' },
      { label: 'Statement IV', text: 'Anupalabdhi (Non-apprehension) is recognized by the Charvaka and Buddhist schools as the primary source of valid knowledge.' },
    ],
    options: [
      { id: '1', text: 'Statements II and III only are correct' },
      { id: '2', text: 'Statements I, II and III only are correct' },
      { id: '3', text: 'Statements I, III and IV only are correct' },
      { id: '4', text: 'Statements II, III and IV only are correct' },
    ],
    correctOptionId: '1',
    correctExplanation: `Statements II and III are correct; Statements I and IV are incorrect.
- Statement I is INCORRECT: The Nyaya school accepts only FOUR Pramanas: 1) Pratyaksha (Perception), 2) Anumana (Inference), 3) Upamana (Comparison), and 4) Shabda (Testimony). It is the Bhatta Mimamsa and Advaita Vedanta schools that accept all SIX Pramanas (including Arthapatti and Anupalabdhi).
- Statement II is CORRECT: Nyaya rejects Arthapatti as an independent pramāna, arguing it can be deduced via kevalavyatireki anumana (negative inference), whereas Kumarila Bhatta and Shankara\'s Advaita maintain it is distinct.
- Statement III is CORRECT: The nocturnal feeding of Devadatta (Pino Devadatto diva na bhunkte) is the canonical textbook example of Arthapatti across Indian epistemology.
- Statement IV is INCORRECT: Charvaka accepts ONLY ONE Pramana (Pratyaksha / Perception) and outright rejects Anupalabdhi. Buddhism accepts only TWO (Pratyaksha and Anumana). Anupalabdhi is accepted only by Bhatta Mimamsa and Advaita Vedanta.`,
    optionDebunker: [
      {
        optionId: '1',
        verdict: 'Correct',
        explanation: 'Statements II and III accurately reflect the philosophical distinctions between Nyaya, Mimamsa, and Vedanta.',
      },
      {
        optionId: '2',
        verdict: 'Incorrect',
        explanation: 'Fails to recognize that Nyaya accepts 4, not 6 Pramanas.',
        examTrap: 'NTA repeatedly tests the exact number of Pramanas accepted by each school: Charvaka (1), Buddhist & Vaisheshika (2), Samkhya (3), Nyaya (4), Prabhakara Mimamsa (5), Bhatta Mimamsa & Advaita (6).',
      },
      {
        optionId: '3',
        verdict: 'Incorrect',
        explanation: 'Contains Statement I (false) and Statement IV (false).',
      },
      {
        optionId: '4',
        verdict: 'Incorrect',
        explanation: 'Statement IV falsely claims Charvakas and Buddhists accept Anupalabdhi.',
      },
    ],
    keyConceptTakeaway: 'School Pramana Counts: Charvaka = 1 (Pratyaksha) | Buddhism & Vaisheshika = 2 (Pratyaksha, Anumana) | Samkhya = 3 (+ Shabda) | Nyaya = 4 (+ Upamana) | Prabhakara = 5 (+ Arthapatti) | Advaita & Bhatta Mimamsa = 6 (+ Anupalabdhi).',
  },
];
