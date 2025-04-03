import { defineStore } from 'pinia'
import agent from '@/api/agent';
import { ClassLevel, PlayerCharacter, PlayerCharacterMasterData, PrimalCompanion, PrimalCompanionType, SpellSlots, StressStatus, WarlockSpellSlots } from '@/models/PlayerCharacter';
import { Campaign } from '@/models/Campaign';

const updateDelay = 3000;
let updateTimer: number | undefined;

export const useCharacterStore = defineStore({
  id: 'character',
  state: () => ({
    characterList: [] as PlayerCharacter[],
    masterData: {} as PlayerCharacterMasterData,
    deadCharacterList: [] as PlayerCharacter[]
  }),
  actions: {
    async getMasterData() {
      await agent.playerCharacter.getMasterData().then((data) => {
        this.masterData = data;
      })
    },
    async getCharacterLists(userId: number, campaignId: number) {
      if (userId === 0 || campaignId === 0) {
        this.clearCharacterList();
        return;
      }
      
      await agent.playerCharacter.getAliveCharacterList(userId, campaignId)
        .then((data) => {
          this.characterList = data;
        });

      this.characterList.forEach((character) => {
        this.setSpellSlots(character);
      });

      await agent.playerCharacter.getDeadCharacterList(userId, campaignId)
        .then((data) => {
          this.deadCharacterList = data;
        });
    },
    setSpellSlots(character: PlayerCharacter) {
      let spellCasterLevel = 0;
      //roudning is different for 1/2 and 1/3 casters when multiclassed
      //they round down when multiclassed, and up when single classed
      //however they both need to reach a minimum level to gain slots
      character.classLevelList.forEach((classLevel) => {
        if ((classLevel.arcaneTrickster || classLevel.eldritchKnight) && classLevel.levels >= 3) {
          if (character.classLevelList.length === 1) {
            spellCasterLevel += Math.ceil(classLevel.levels / 3);
          } else {
            spellCasterLevel += Math.floor(classLevel.levels / 3);
          }
        } else if (classLevel.characterClass.fullCaster) {
          spellCasterLevel += classLevel.levels;
        } else if (classLevel.characterClass.halfCaster && classLevel.levels >= 2) {
          if (character.classLevelList.length === 1) {
            spellCasterLevel += Math.ceil(classLevel.levels / 2);
          } else {
            spellCasterLevel += Math.floor(classLevel.levels / 2);
          }
        } else if (classLevel.characterClass.artificer) {
          spellCasterLevel += Math.ceil(classLevel.levels / 2);
        } else if (classLevel.characterClass.warlock) {
          character.warlockSpellSlots = this.masterData.warlockSpellSlots.find(x => x.warlockLevel === classLevel.levels) as WarlockSpellSlots;
        }
      });

      if (spellCasterLevel > 0) {
        character.spellSlots = this.masterData.spellSlots.find(x => x.casterLevel === spellCasterLevel) as SpellSlots;
      }
    },
    async saveCharacter(index: number) {
      await agent.playerCharacter.updatePlayerCharacter(this.characterList[index])
        .then((data) => {
          this.characterList[index] = data;
          this.setSpellSlots(this.characterList[index]);
        });
    },
    clearCharacterList() {
      this.characterList = [];
    },
    setStrength(score: number, index: number) {
      this.characterList[index].strength.score = score;
    },
    setStrengthSave(proficient: string, index: number) {
      this.characterList[index].strength.proficient = proficient === "true";
    },
    setAthletics(level: number, index: number) {
      this.characterList[index].strength.athletics = level;
    },
    setDexterity(score: number, index: number) {
      this.characterList[index].dexterity.score = score;
    },
    setDexteritySave(proficient: string, index: number) {
      this.characterList[index].dexterity.proficient = proficient === "true";
    },
    setAcrobatics(level: number, index: number) {
      this.characterList[index].dexterity.acrobatics = level;
    },
    setSleightOfHand(level: number, index: number) {
      this.characterList[index].dexterity.sleightOfHand = level;
    },
    setStealth(level: number, index: number) {
      this.characterList[index].dexterity.stealth = level;
    },
    setConstitution(score: number, index: number) {
      this.characterList[index].constitution.score = score;
    },
    setConstitutionSave(proficient: string, index: number) {
      this.characterList[index].constitution.proficient = proficient === "true";
    },
    setIntelligence(score: number, index: number) {
      this.characterList[index].intelligence.score = score;
    },
    setIntelligenceSave(proficient: string, index: number) {
      this.characterList[index].intelligence.proficient = proficient === "true";
    },
    setArcana(level: number, index: number) {
      this.characterList[index].intelligence.arcana = level;
    },
    setHistory(level: number, index: number) {
      this.characterList[index].intelligence.history = level;
    },
    setInvestigation(level: number, index: number) {
      this.characterList[index].intelligence.investigation = level;
    },
    setNature(level: number, index: number) {
      this.characterList[index].intelligence.nature = level;
    },
    setReligion(level: number, index: number) {
      this.characterList[index].intelligence.religion = level;
    },
    setWisdom(score: number, index: number) {
      this.characterList[index].wisdom.score = score;
    },
    setWisdomSave(proficient: string, index: number) {
      this.characterList[index].wisdom.proficient = proficient === "true";
    },
    setAnimalHandling(level: number, index: number) {
      this.characterList[index].wisdom.animalHandling = level;
    },
    setInsight(level: number, index: number) {
      this.characterList[index].wisdom.insight = level;
    },
    setMedicine(level: number, index: number) {
      this.characterList[index].wisdom.medicine = level;
    },
    setPerception(level: number, index: number) {
      this.characterList[index].wisdom.perception = level;
    },
    setSurvival(level: number, index: number) {
      this.characterList[index].wisdom.survival = level;
    },
    setCharisma(score: number, index: number) {
      this.characterList[index].charisma.score = score;
    },
    setCharismaSave(proficient: string, index: number) {
      this.characterList[index].charisma.proficient = proficient === "true";
    },
    setDeception(level: number, index: number) {
      this.characterList[index].charisma.deception = level;
    },
    setIntimidation(level: number, index: number) {
      this.characterList[index].charisma.intimidation = level;
    },
    setPerformance(level: number, index: number) {
      this.characterList[index].charisma.performance = level;
    },
    setPersuasion(level: number, index: number) {
      this.characterList[index].charisma.persuasion = level;
    },
    setResolve(score: number, index: number) {
      if (this.characterList[index].resolve != null) {
        this.characterList[index].resolve!.score = score;
      }
    },
    getMaxHitPoints(index: number, campaign: Campaign): number {
      const conModifier = Math.floor((this.characterList[index].constitution.score - 10) / 2.0);
      let maxHitPoints = 0;

      this.characterList[index].classLevelList.forEach((classLevel) => {
        if (classLevel.baseClass) {
          maxHitPoints += (classLevel.characterClass.hitDie + conModifier) + (classLevel.levels - 1) * (classLevel.characterClass.averageHitDie + conModifier);
        } else {
          maxHitPoints += (classLevel.levels) * (classLevel.characterClass.averageHitDie + conModifier);
          
        }

        if (this.characterList[index].dwarvenToughness) {
          maxHitPoints += classLevel.levels;
        }

        if (this.characterList[index].toughFeat) {
          maxHitPoints += 2 * classLevel.levels;
        }
      });

      if (campaign.inflatedHitPoints) {
        maxHitPoints = Math.ceil(1.5 * maxHitPoints);
      }
      
      return maxHitPoints - this.characterList[index].maxHpReduction;
    },
    adjustHitDie(characterIndex: number, classLevelindex: number, amount: number) {
      this.characterList[characterIndex].classLevelList[classLevelindex].usedHitDice += amount;

      if (this.characterList[characterIndex].classLevelList[classLevelindex].usedHitDice >= this.characterList[characterIndex].classLevelList[classLevelindex].levels) {
        this.characterList[characterIndex].classLevelList[classLevelindex].usedHitDice = this.characterList[characterIndex].classLevelList[classLevelindex].levels;
      }

      if (this.characterList[characterIndex].classLevelList[classLevelindex].usedHitDice < 0) {
        this.characterList[characterIndex].classLevelList[classLevelindex].usedHitDice = 0;
      }

      this.setUpdateTimer(characterIndex);
    },
    adjustDamage(index: number, damage: number, campaign: Campaign) {
      if (this.characterList[index].temporaryHitPoints > 0 && damage > 0) {
        this.characterList[index].temporaryHitPoints -= damage;

        if (this.characterList[index].temporaryHitPoints < 0) {
          damage = this.characterList[index].temporaryHitPoints * -1;
          this.characterList[index].temporaryHitPoints = 0;
        } else {
          return;
        }
      }

      this.characterList[index].damage += damage;
      const maxHitPoints = this.getMaxHitPoints(index, campaign);

      if (this.characterList[index].damage > maxHitPoints) {
        this.characterList[index].damage = maxHitPoints;
      }

      if (this.characterList[index].damage < 0) {
        this.characterList[index].damage = 0;
      }

      this.setUpdateTimer(index);
    },
    adjustTemporyHitPoints(index: number, amount: number) {
      this.characterList[index].temporaryHitPoints += amount;

      if (this.characterList[index].temporaryHitPoints < 0) {
        this.characterList[index].temporaryHitPoints = 0;
      }

      this.setUpdateTimer(index);
    },
    adjustAc(index: number, amount: number) {
      this.characterList[index].ac += amount;

      if (this.characterList[index].ac < 1) {
        this.characterList[index].ac = 1;
      }

      this.setUpdateTimer(index);
    },
    adjustAcBonus(index: number, amount: number) {
      this.characterList[index].acBonus += amount;

      if (this.characterList[index].acBonus < 0) {
        this.characterList[index].acBonus = 0;
      }

      this.setUpdateTimer(index);
    },
    resetDeathSaves(index: number) {
      this.characterList[index].deathSaveFailures = 0;
      this.characterList[index].deathSaveSuccesses = 0;
      this.setUpdateTimer(index);
    },
    adjustDeathSaveSuccesses(index: number, amount: number) {
      this.characterList[index].deathSaveSuccesses += amount;

      if (this.characterList[index].deathSaveSuccesses < 0) {
        this.characterList[index].deathSaveSuccesses = 0;
      }

      if (this.characterList[index].deathSaveSuccesses > 3) {
        this.characterList[index].deathSaveSuccesses = 3;
      }

      this.setUpdateTimer(index);
    },
    adjustDeathSaveFailures(index: number, amount: number) {
      this.characterList[index].deathSaveFailures += amount;

      if (this.characterList[index].deathSaveFailures < 0) {
        this.characterList[index].deathSaveFailures = 0;
      }

      if (this.characterList[index].deathSaveFailures > 3) {
        this.characterList[index].deathSaveFailures = 3;
      }

      this.setUpdateTimer(index);
    },
    adjustStress(index: number, amount: number, campaign: Campaign) {
      if (!campaign.madness) {
        return;
      }

      this.characterList[index].stress += amount;

      const stressMaximum = this.getStressMaximum(index, campaign)

      if (this.characterList[index].stress < 0) {
        this.characterList[index].stress = 0;
      }

      if (this.characterList[index].stress > stressMaximum) {
        this.characterList[index].stress = stressMaximum;
      }

      this.setUpdateTimer(index);
    },
    adjustMeditationDice(index: number, amount: number, campaign: Campaign) {
      if (!campaign.madness) {
        return;
      }

      this.characterList[index].meditationDiceUsed += amount;

      if (this.characterList[index].meditationDiceUsed < 0) {
        this.characterList[index].meditationDiceUsed = 0;
      }

      if (this.characterList[index].meditationDiceUsed > 10) {
        this.characterList[index].meditationDiceUsed = 10;
      }

      this.setUpdateTimer(index);
    },
    getStressThreshold(index: number, campaign: Campaign) {
      if (!campaign.madness) {
        return 0;
      }

      const resModifier = Math.floor((this.characterList[index].resolve!.score - 10) / 2.0);

      return 100 + 5 * resModifier;
    },
    applyAfflictionOrVirtue(index: number, roll: number, campaign: Campaign) {
      if (!campaign.madness) {
        return;
      }

      this.characterList[index].stressStatus = this.masterData.stressStatuses.find(x => x.minRoll <= roll && x.maxRoll >= roll) as StressStatus;

      this.setUpdateTimer(index);
    },
    adjustFirstSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].firstSlotsUsed += amount;

      if (this.characterList[index].firstSlotsUsed < 0) {
        this.characterList[index].firstSlotsUsed = 0;
      }

      if (this.characterList[index].firstSlotsUsed > this.characterList[index].spellSlots!.first) {
        this.characterList[index].firstSlotsUsed = this.characterList[index].spellSlots!.first;
      }

      this.setUpdateTimer(index);
    },
    adjustSecondSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].secondSlotsUsed += amount;

      if (this.characterList[index].secondSlotsUsed < 0) {
        this.characterList[index].secondSlotsUsed = 0;
      }

      if (this.characterList[index].secondSlotsUsed > this.characterList[index].spellSlots!.second) {
        this.characterList[index].secondSlotsUsed = this.characterList[index].spellSlots!.second;
      }

      this.setUpdateTimer(index);
    },
    adjustThirdSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].thirdSlotsUsed += amount;

      if (this.characterList[index].thirdSlotsUsed < 0) {
        this.characterList[index].thirdSlotsUsed = 0;
      }

      if (this.characterList[index].thirdSlotsUsed > this.characterList[index].spellSlots!.third) {
        this.characterList[index].thirdSlotsUsed = this.characterList[index].spellSlots!.third;
      }

      this.setUpdateTimer(index);
    },
    adjustFourthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].fourthSlotsUsed += amount;

      if (this.characterList[index].fourthSlotsUsed < 0) {
        this.characterList[index].fourthSlotsUsed = 0;
      }

      if (this.characterList[index].fourthSlotsUsed > this.characterList[index].spellSlots!.fourth) {
        this.characterList[index].fourthSlotsUsed = this.characterList[index].spellSlots!.fourth;
      }

      this.setUpdateTimer(index);
    },
    adjustFifthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].fifthSlotsUsed += amount;

      if (this.characterList[index].fifthSlotsUsed < 0) {
        this.characterList[index].fifthSlotsUsed = 0;
      }

      if (this.characterList[index].fifthSlotsUsed > this.characterList[index].spellSlots!.fifth) {
        this.characterList[index].fifthSlotsUsed = this.characterList[index].spellSlots!.fifth;
      }

      this.setUpdateTimer(index);
    },
    adjustSixthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].sixthSlotsUsed += amount;

      if (this.characterList[index].sixthSlotsUsed < 0) {
        this.characterList[index].sixthSlotsUsed = 0;
      }

      if (this.characterList[index].sixthSlotsUsed > this.characterList[index].spellSlots!.sixth) {
        this.characterList[index].sixthSlotsUsed = this.characterList[index].spellSlots!.sixth;
      }

      this.setUpdateTimer(index);
    },
    adjustSeventhSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].seventhSlotsUsed += amount;

      if (this.characterList[index].seventhSlotsUsed < 0) {
        this.characterList[index].seventhSlotsUsed = 0;
      }

      if (this.characterList[index].seventhSlotsUsed > this.characterList[index].spellSlots!.seventh) {
        this.characterList[index].seventhSlotsUsed = this.characterList[index].spellSlots!.seventh;
      }

      this.setUpdateTimer(index);
    },
    adjustEighthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].eighthSlotsUsed += amount;

      if (this.characterList[index].eighthSlotsUsed < 0) {
        this.characterList[index].eighthSlotsUsed = 0;
      }

      if (this.characterList[index].eighthSlotsUsed > this.characterList[index].spellSlots!.eighth) {
        this.characterList[index].eighthSlotsUsed = this.characterList[index].spellSlots!.eighth;
      }

      this.setUpdateTimer(index);
    },
    adjustNinthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].ninthSlotsUsed += amount;

      if (this.characterList[index].ninthSlotsUsed < 0) {
        this.characterList[index].ninthSlotsUsed = 0;
      }

      if (this.characterList[index].ninthSlotsUsed > this.characterList[index].spellSlots!.ninth) {
        this.characterList[index].ninthSlotsUsed = this.characterList[index].spellSlots!.ninth;
      }

      this.setUpdateTimer(index);
    },
    adjustWarlockSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].spellSlots === null) {
        return;
      }

      this.characterList[index].warlockSlotsUsed += amount;

      if (this.characterList[index].warlockSlotsUsed < 0) {
        this.characterList[index].warlockSlotsUsed = 0;
      }

      if (this.characterList[index].warlockSlotsUsed > this.characterList[index].warlockSpellSlots!.quantity) {
        this.characterList[index].warlockSlotsUsed = this.characterList[index].warlockSpellSlots!.quantity;
      }

      this.setUpdateTimer(index);
    },
    getStressMaximum(index: number, campaign: Campaign) {
      return this.getStressThreshold(index, campaign) * 2;
    },
    getTotalLevels(index: number) {
      let totalLevels = 0;
      this.characterList[index].classLevelList.forEach((classLevel) => {
        totalLevels += classLevel.levels;
      });

      return totalLevels;
    },
    getProficiencyBonus(index: number) {
      const totalLevels = this.getTotalLevels(index);
      let bonus = 0;
      this.masterData.proficiencyBonuses.forEach((profBonus) => {
        if (profBonus.level === totalLevels) {
          bonus = profBonus.bonus;
        }
      });

      return bonus;
    },
    isJackOfAllTrades(index: number) {
      let jackOfAllTrades = false;

      this.characterList[index].classLevelList.forEach((classLevel) => {
        if (classLevel.characterClass.name === "Bard" && classLevel.levels > 1) {
          jackOfAllTrades = true;
        }
      });

      return jackOfAllTrades;
    },
    isBeastmaster(index: number) {
      let beastmaster = false;

      this.characterList[index].classLevelList.forEach((classLevel) => {
        if (classLevel.beastMaster) {
          beastmaster = true;
        }
      });

      return beastmaster;
    },
    longRest(index: number, campaign: Campaign) {
      this.characterList[index].damage = 0;
      this.characterList[index].temporaryHitPoints = 0;

      let totalHitDiceToRestore = Math.floor(this.getTotalLevels(index) / 2);

      if (totalHitDiceToRestore < 1) {
        totalHitDiceToRestore = 1;
      }

      let classesToRestoreHitDie = [] as ClassLevel[];

      this.characterList[index].classLevelList.forEach((classLevel) => {
        if (classLevel.usedHitDice > 0) {
          classesToRestoreHitDie.push(classLevel);
        }
      });

      //sort class list by largest hit die to smallest
      classesToRestoreHitDie = classesToRestoreHitDie.sort((a, b) => b.characterClass.hitDie - a.characterClass.hitDie);

      classesToRestoreHitDie.forEach((classLevel) => {
        if (totalHitDiceToRestore > 0) {
          if (totalHitDiceToRestore <= classLevel.usedHitDice) {
            this.adjustHitDie(index, this.characterList[index].classLevelList.indexOf(classLevel), totalHitDiceToRestore * -1);
            totalHitDiceToRestore = 0;
          } else {
            const classHitDiceToRestore = classLevel.usedHitDice;
            this.adjustHitDie(index, this.characterList[index].classLevelList.indexOf(classLevel), classHitDiceToRestore * -1);
            totalHitDiceToRestore -= classHitDiceToRestore;
          }
        }
      });

      if (this.characterList[index].primalCompanion != null) {
        this.characterList[index].primalCompanion!.damage = 0;

        let compantionHitDiceToRestore = Math.floor(this.getBeastmasterLevel(index) / 2);

        if (compantionHitDiceToRestore < 0) {
          compantionHitDiceToRestore = 1;
        }

        this.characterList[index].primalCompanion!.hitDiceUsed -= compantionHitDiceToRestore;
        this.characterList[index].primalCompanion!.temporaryHitPoints = 0;
      }

      if (this.characterList[index].spellSlots != null) {
        this.characterList[index].firstSlotsUsed = 0;
        this.characterList[index].secondSlotsUsed = 0;
        this.characterList[index].thirdSlotsUsed = 0;
        this.characterList[index].fourthSlotsUsed = 0;
        this.characterList[index].fifthSlotsUsed = 0;
        this.characterList[index].sixthSlotsUsed = 0;
        this.characterList[index].seventhSlotsUsed = 0;
        this.characterList[index].eighthSlotsUsed = 0;
        this.characterList[index].ninthSlotsUsed = 0;
      }

      if (this.characterList[index].warlockSpellSlots != null) {
        this.characterList[index].warlockSlotsUsed = 0;
      }

      const stressThreshold = this.getStressThreshold(index, campaign);
      
      if (this.characterList[index].stress <= stressThreshold) {
        this.adjustStress(index, -50, campaign);
      } else {
        this.characterList[index].stress = stressThreshold;
      }

      this.characterList[index].stressStatus = this.masterData.stressStatuses.find(x => x.id === 1) as StressStatus;
      this.adjustMeditationDice(index, -5, campaign);
    },
    levelUp(characterIndex: number, classLevelIndex: number) {
      this.characterList[characterIndex].classLevelList[classLevelIndex].levels++;
    },
    getCompanionSenses(index: number) {
      const passivePerception = 10 + Math.floor((this.characterList[index].primalCompanion!.primalCompanionType.wisdom - 10) / 2) + this.getProficiencyBonus(index);
      return this.characterList[index].primalCompanion!.senses.replace("<perception>", passivePerception.toString());
    },
    getBeastmasterLevel(index: number) {
      const beastmaster = this.characterList[index].classLevelList.find(x => x.beastMaster);

      if (beastmaster != undefined) {
        return beastmaster.levels;
      }

      return 0;
    },
    adjustCompanionHitDie(index: number, amount: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.hitDiceUsed += amount;

      if (this.characterList[index].primalCompanion!.hitDiceUsed < 0) {
        this.characterList[index].primalCompanion!.hitDiceUsed = 0;
      }

      if (this.characterList[index].primalCompanion!.hitDiceUsed > this.getBeastmasterLevel(index)) {
        this.characterList[index].primalCompanion!.hitDiceUsed = this.getBeastmasterLevel(index);
      }

      this.setUpdateTimer(index);
    },
    getCompanionMaxHitPoints(index: number) {
      if (this.characterList[index].primalCompanion === null) {
        return 0;
      }

      const baseHitPoints = this.characterList[index].primalCompanion!.primalCompanionType.baseHitPoints;

      return baseHitPoints * (this.getBeastmasterLevel(index) + 1) - this.characterList[index].primalCompanion!.maxHpReduction;
    },
    adjustCompanionDamage(index: number, damage: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      if (this.characterList[index].primalCompanion!.temporaryHitPoints > 0 && damage > 0) {
        this.characterList[index].primalCompanion!.temporaryHitPoints -= damage;

        if (this.characterList[index].primalCompanion!.temporaryHitPoints < 0) {
          damage = this.characterList[index].primalCompanion!.temporaryHitPoints * -1;
          this.characterList[index].primalCompanion!.temporaryHitPoints = 0;
        } else {
          return;
        }
      }

      this.characterList[index].primalCompanion!.damage += damage;
      const maxHitPoints = this.getCompanionMaxHitPoints(index);

      if (this.characterList[index].primalCompanion!.damage > maxHitPoints) {
        this.characterList[index].primalCompanion!.damage = maxHitPoints;
      }

      if (this.characterList[index].primalCompanion!.damage < 0) {
        this.characterList[index].primalCompanion!.damage = 0;
      }

      this.setUpdateTimer(index);
    },
    adjustCompanionTemporaryHitPoints(index: number, amount: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.temporaryHitPoints += amount;

      if (this.characterList[index].primalCompanion!.temporaryHitPoints < 0) {
        this.characterList[index].primalCompanion!.temporaryHitPoints = 0;
      }

      this.setUpdateTimer(index);
    },
    getCompanionBaseAc(index: number) {
      if (this.characterList[index].primalCompanion === null) {
        return 0;
      }

      return this.characterList[index].primalCompanion!.baseArmorClass + this.getProficiencyBonus(index);
    },
    adjustCompanionAcBonus(index: number, amount: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.acBonus += amount;

      if (this.characterList[index].primalCompanion!.acBonus < 0) {
        this.characterList[index].primalCompanion!.acBonus = 0;
      }

      this.setUpdateTimer(index);
    },
    resetCompanionDeathSaves(index: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.deathSaveFailures = 0;
      this.characterList[index].primalCompanion!.deathSaveSuccesses = 0;
      this.setUpdateTimer(index);
    },
    adjustCompanionDeathSaveSuccesses(index: number, amount: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.deathSaveSuccesses += amount;

      if (this.characterList[index].primalCompanion!.deathSaveSuccesses < 0) {
        this.characterList[index].primalCompanion!.deathSaveSuccesses = 0;
      }

      if (this.characterList[index].primalCompanion!.deathSaveSuccesses > 3) {
        this.characterList[index].primalCompanion!.deathSaveSuccesses = 3;
      }

      this.setUpdateTimer(index);
    },
    adjustCompanionDeathSaveFailures(index: number, amount: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.deathSaveFailures += amount;

      if (this.characterList[index].primalCompanion!.deathSaveFailures < 0) {
        this.characterList[index].primalCompanion!.deathSaveFailures = 0;
      }

      if (this.characterList[index].primalCompanion!.deathSaveFailures > 3) {
        this.characterList[index].primalCompanion!.deathSaveFailures = 3;
      }

      this.setUpdateTimer(index);
    },
    getCompanionAbilityDescription(index: number) {
      if (this.characterList[index].primalCompanion === null) {
        return "";
      }

      const wisSpellSave = 8 + this.getProficiencyBonus(index) + Math.floor(( this.characterList[index].wisdom.score - 10) / 2);

      return this.characterList[index].primalCompanion!.primalCompanionType.abilityDescription.replace("<wisSpellSave>", wisSpellSave.toString());
    },
    getCompanionActionDescription(index: number) {
      if (this.characterList[index].primalCompanion === null) {
        return "";
      }

      const wisSpellSave = 8 + this.getProficiencyBonus(index) + Math.floor(( this.characterList[index].wisdom.score - 10) / 2);
      const toHitBonus = this.getProficiencyBonus(index) + Math.floor(( this.characterList[index].wisdom.score - 10) / 2);
      const strDamage = Math.floor(( this.characterList[index].primalCompanion!.primalCompanionType.strength - 10) / 2) + this.getProficiencyBonus(index);
      const dexDamage = Math.floor(( this.characterList[index].primalCompanion!.primalCompanionType.dexterity - 10) / 2) + this.getProficiencyBonus(index);

      let baseDesc = this.characterList[index].primalCompanion!.primalCompanionType.actionDescription;

      baseDesc = baseDesc.replace("<toHitBonus>", toHitBonus.toString());
      baseDesc = baseDesc.replace("<wisSpellSave>", wisSpellSave.toString());
      baseDesc = baseDesc.replace("<strDamage>", strDamage.toString());
      baseDesc = baseDesc.replace("<dexDamage>", dexDamage.toString());

      return baseDesc;
    },
    setCompanionType(index: number, typeId: number) {
      if (this.characterList[index].primalCompanion === null) {
        return;
      }

      this.characterList[index].primalCompanion!.primalCompanionType = this.masterData.primalCompanionTypes.find(x => x.id === typeId) as PrimalCompanionType;
    },
    async cancelEdits(index: number) {
      await agent.playerCharacter.getCharacter(this.characterList[index].id).then((data) => {
        this.characterList[index] = data;
        this.setSpellSlots(this.characterList[index]);
      });
    },
    setUpdateTimer(characterIndex: number) {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
        this.saveCharacter(characterIndex);
      }, updateDelay)
    },
    async killCharacter(index: number) {
      await agent.playerCharacter.killCharacter(this.characterList[index].id);
    },
    async reviveCharacter(id: number) {
      await agent.playerCharacter.reviveCharacter(id);
    }
  },
  persist: true
});