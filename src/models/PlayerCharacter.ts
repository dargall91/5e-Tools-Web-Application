export interface PlayerCharacterMasterData {
	stressStatuses: StressStatus[],
	exhaustionLevels: ExhaustionLevel[],
	primalCompanionTypes: PrimalCompanionType[]
};

export interface PlayerCharacter {
	playerCharacterId: number,
	name: string,
	baseArmorClass: number,
	armorClassBonus: number,
	damage: number,
	hitPointMaximum: number,
	temporaryHitPoints: number,
	maxHitPointReduction: number,
	deathSaveFailures: number,
	deathSaveSuccesses: number,
	toughFeat: boolean,
	exhaustionLevel: number,
	spellcasterLevel: number,
	warlockLevel: number,
	proficiencyBonus: number,
	strength: Strength,
	dexterity: Dexterity,
	constitution: Constitution,
	intelligence: Intelligence,
	wisdom: Wisdom,
	charisma: Charisma,
	resolve: Resolve | null,
	stress: Stress | null,
	usedSpellSlots: UsedSpellSlots | null,
	characterClasses: CharacterClass[],
	spellSlots: SpellSlots | null
	warlockSpellSlots: WarlockSpellSlots | null,
	isJackOfAllTrades: boolean | null
};

export interface Stress {
	stressLevel: number;
	stressThreshold: number;
	stressMaximum: number;
	meditationDiceUsed: number;
	stressStatus: StressStatus | null;
};

interface AbilityScore {
	id: number,
	score: number,
	proficient: boolean
}

export interface Strength extends AbilityScore {
	athletics: number,
};

export interface Dexterity extends AbilityScore {
	acrobatics: number,
	sleightOfHand: number,
	stealth: number,
};

export interface Constitution extends AbilityScore { };

export interface Intelligence extends AbilityScore {
	arcana: number,
	history: number,
	investigation: number,
	nature: number,
	religion: number,
};

export interface Wisdom extends AbilityScore {
	animalHandling: number,
	insight: number,
	medicine: number,
	perception: number,
	survival: number
};

export interface Charisma extends AbilityScore {
	deception: number,
	intimidation: number,
	performance: number,
	persuasion: number,
};

export interface Resolve extends AbilityScore { };

export interface CharacterClass {
	level: number,
	hitDiceUsed: number,
	baseClass: boolean,
	subclass: Subclass,
	primalCompanion: PrimalCompanion | null
};

export interface Subclass {
	id: number,
	name: string,
	classHitDieSize: number,
	jackOfAllTrades: boolean
};

export interface StressStatus {
	id: number,
	name: string,
	type: string,
	description: string,
	minRoll: number,
	maxRoll: number
};

export interface ProficiencyBonus {
	level: number,
	bonus: number
};

export interface ExhaustionLevel {
	id: number,
	description: string
};

export interface Class {
	id: number,
	name: string,
	hitDieSize: number,
	classAbilityScore: string
	subclasses: Subclass[]
};

interface BaseSpellSlots {
	firstLevel: number,
	secondLevel: number,
	thirdLevel: number,
	fourthLevel: number,
	fifthLevel: number,
	sixthLevel: number,
	seventhLevel: number,
	eighthLevel: number,
	ninthLevel: number
};

export interface SpellSlots extends BaseSpellSlots {
	id: number
}

export interface UsedSpellSlots extends BaseSpellSlots {
	warlock: number
};

export interface WarlockSpellSlots {
	id: number,
	slots: number,
	level: number
};

export interface PrimalCompanion {
	name: string,
	hitPointMaximum: number,
	armorClassBonus: number,
	damage: number,
	maxHitPointReduction: number,
	temporaryHitPoints: number,
	deathSaveFailures: number,
	deathSaveSuccesses: number,
	hitDiceUsed: number,
	strengthOverride: number | null,
	dexterityOverride: number | null,
	constitutionOverride: number | null,
	intelligenceOverride: number | null,
	wisdomOverride: number | null,
	charismaOverride: number | null,
	primalCompanionType: PrimalCompanionType
};

export interface PrimalCompanionType {
	id: number,
	name: string,
	hitPointMultiplier: number,
	hitDieSize: number,
	speed: string,
	size: string,
	strength: number,
	dexterity: number,
	constitution: number,
	intelligence: number,
	wisdom: number,
	charisma: number,
	abilityName: string,
	abilityDescription: string,
	actionName: string,
	actionDescription: string
};
