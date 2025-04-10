import { Class } from "./PlayerCharacter";

export interface Campaign {
	campaignId: number;
	name: string;
	usesStress: boolean;
	usesInflatedHitPoints: number;
	allowsMulticlassing: boolean;
	classes: Class[];
};
