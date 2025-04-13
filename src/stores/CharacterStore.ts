import { defineStore } from 'pinia'
import agent from '@/api/agent';
import { PlayerCharacter, PlayerCharacterMasterData, PrimalCompanion, PrimalCompanionType, StressStatus, StressType } from '@/models/PlayerCharacter';

const updateDelay = 3000;
let updateTimer: number = 0;
let baseUpdateTimer: number = 0;
let stressUpdateTimer: number = 0;

export const useCharacterStore = defineStore({
  id: 'character',
  state: () => ({
    characterList: [] as PlayerCharacter[],
    masterData: {} as PlayerCharacterMasterData,
    deadCharacterList: [] as PlayerCharacter[]
  }),
  actions: {
    async getMasterData(campaignId: number) {
      await agent.playerCharacter.getMasterData(campaignId).then((data) => {
        this.masterData = data!;
      })
    },
    async getCharacterLists(userId: number, campaignId: number) {
      if (userId === 0 || campaignId === 0) {
        this.clearCharacterList();
        return;
      }
      
      await agent.playerCharacter.getCharacters(userId, campaignId, false)
        .then((data) => {
          this.characterList = data!;
        });


      await agent.playerCharacter.getCharacters(userId, campaignId, true)
        .then((data) => {
          this.deadCharacterList = data!;
        });
    },
    async saveCharacter(index: number) {
      await agent.playerCharacter.updatePlayerCharacter(this.characterList[index])
        .then((data) => {
          this.characterList[index] = data!;
        });
    },
    async saveCharacterBase(index: number) {
      await agent.playerCharacter.updatePlayerCharacterBase(this.characterList[index]);
    },
    async saveStress(index: number) {
      if (this.characterList[index].stress !== null)
      {
        await agent.playerCharacter.updateStress(this.characterList[index].playerCharacterId, this.characterList[index].stress!)
          .then((data) => {
            //stress status is not transferred, preseve value
            const stressStatus = this.characterList[index].stress!.stressStatus;
            this.characterList[index].stress = data!;
            this.characterList[index].stress!.stressStatus = stressStatus;
          });
      }      
    },
    clearCharacterList() {
      this.characterList = [];
    },
    setMaxHitPointReduction(index: number, amount: number) {
      const currentHitPoints = this.getHitPointMaximum(index) - this.characterList[index].damage;
      this.characterList[index].maxHitPointReduction = amount;
      this.characterList[index].damage = this.getHitPointMaximum(index) - currentHitPoints;

      if (this.characterList[index].damage < 0) {
        this.characterList[index].damage = 0;
      }
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
      if (this.characterList[index].resolve !== null) {
        this.characterList[index].resolve!.score = score;
      }
    },
    adjustHitDie(characterIndex: number, classLevelindex: number, amount: number) {
      this.characterList[characterIndex].characterClasses[classLevelindex].hitDiceUsed += amount;

      if (this.characterList[characterIndex].characterClasses[classLevelindex].hitDiceUsed >= this.characterList[characterIndex].characterClasses[classLevelindex].level) {
        this.characterList[characterIndex].characterClasses[classLevelindex].hitDiceUsed = this.characterList[characterIndex].characterClasses[classLevelindex].level;
      }

      if (this.characterList[characterIndex].characterClasses[classLevelindex].hitDiceUsed < 0) {
        this.characterList[characterIndex].characterClasses[classLevelindex].hitDiceUsed = 0;
      }

      this.setUpdateTimer(characterIndex);
    },
    getHitPointMaximum(index: number) {
      return this.characterList[index].hitPointMaximum - this.characterList[index].maxHitPointReduction;
    },
    adjustDamage(index: number, damage: number) {
      //sutract from tempt hit points first
      if (this.characterList[index].temporaryHitPoints > 0 && damage > 0) {
        this.characterList[index].temporaryHitPoints -= damage;

        //if damage exceeds temp hit points, set temp to 0 and damage to amount that exceeded temp, otherwise no further action is needed
        if (this.characterList[index].temporaryHitPoints < 0) {
          damage = this.characterList[index].temporaryHitPoints * -1;
          this.characterList[index].temporaryHitPoints = 0;
        } else {
          return;
        }
      }

      this.characterList[index].damage += damage;

      if (this.characterList[index].damage > this.characterList[index].hitPointMaximum) {
        this.characterList[index].damage = this.characterList[index].hitPointMaximum;
      }

      if (this.characterList[index].damage < 0) {
        this.characterList[index].damage = 0;
      }

      this.setBaseUpdateTimer(index);
    },
    adjustTemporyHitPoints(index: number, amount: number) {
      this.characterList[index].temporaryHitPoints += amount;

      if (this.characterList[index].temporaryHitPoints < 0) {
        this.characterList[index].temporaryHitPoints = 0;
      }

      this.setBaseUpdateTimer(index);
    },
    adjustAc(index: number, amount: number) {
      this.characterList[index].baseArmorClass += amount;

      if (this.characterList[index].baseArmorClass < 1) {
        this.characterList[index].baseArmorClass = 1;
      }

      this.setBaseUpdateTimer(index);
    },
    adjustAcBonus(index: number, amount: number) {
      this.characterList[index].armorClassBonus += amount;

      if (this.characterList[index].armorClassBonus < 0) {
        this.characterList[index].armorClassBonus = 0;
      }

      this.setBaseUpdateTimer(index);
    },
    resetDeathSaves(index: number) {
      this.characterList[index].deathSaveFailures = 0;
      this.characterList[index].deathSaveSuccesses = 0;
      this.setBaseUpdateTimer(index);
    },
    adjustDeathSaveSuccesses(index: number, amount: number) {
      //do not adjust level if it would go below 0 or above 3
      if ((this.characterList[index].deathSaveSuccesses < 3 && amount > 0) || (this.characterList[index].deathSaveSuccesses > 0 && amount < 0)) {
        this.characterList[index].deathSaveSuccesses += amount;
  
        this.setBaseUpdateTimer(index);
      }
    },
    adjustDeathSaveFailures(index: number, amount: number) {
      //do not adjust level if it would go below 0 or above 3
      if ((this.characterList[index].deathSaveFailures < 3 && amount > 0) || (this.characterList[index].deathSaveFailures > 0 && amount < 0)) {
        this.characterList[index].deathSaveFailures += amount;
  
        this.setBaseUpdateTimer(index);
      }
    },
    getExhaustionLevel(index: number) {
      return this.characterList[index].exhaustionLevel?.id ?? 0;
    },
    getExhaustionDescription(index: number) {
      return this.getExhaustionLevel(index) > 0
        ? this.masterData.exhaustionLevels.filter(x => x.id <= this.getExhaustionLevel(index)).map(x => x.description).join("; ")
        : '';
    },
    adjustExhaustionLevel(index: number, amount: number) {
      const exhaustionLevel = this.getExhaustionLevel(index);
      //do not adjust level if it would go below 0 or above 6
      if ((exhaustionLevel < 6 && amount > 0) || (exhaustionLevel > 0 && amount < 0)) {
        this.characterList[index].exhaustionLevel = this.masterData.exhaustionLevels.find(x => x.id === exhaustionLevel + amount) ?? null;
        console.log(this.characterList[index].exhaustionLevel );
  
        this.setUpdateTimer(index);
      }
    },
    adjustStress(index: number, amount: number) {
      if (this.characterList[index].stress !== null) {
        const preAdjustmentLevel = this.characterList[index].stress!.stressLevel;
        this.characterList[index].stress!.stressLevel += amount;

        if (this.characterList[index].stress!.stressLevel < 0) {
          this.characterList[index].stress!.stressLevel = 0;
        }

        if (this.characterList[index].stress!.stressLevel > this.characterList[index].stress!.stressMaximum) {
          this.characterList[index].stress!.stressLevel = this.characterList[index].stress!.stressMaximum;
        }

        //only update if the amount used actually changed
        if (preAdjustmentLevel != this.characterList[index].stress!.stressLevel) {
          this.setStressUpdateTimer(index);
        }
      }
    },
    adjustMeditationDice(index: number, amount: number) {
      if (this.characterList[index].stress !== null) {
        const preAdjustmentAmountUsed = this.characterList[index].stress!.meditationDiceUsed;
        this.characterList[index].stress!.meditationDiceUsed += amount;

        if (this.characterList[index].stress!.meditationDiceUsed < 0) {
          this.characterList[index].stress!.meditationDiceUsed = 0;
        }

        if (this.characterList[index].stress!.meditationDiceUsed > 10) {
          this.characterList[index].stress!.meditationDiceUsed = 10;
        }

        //only update if the amount used actually changed
        if (preAdjustmentAmountUsed != this.characterList[index].stress!.meditationDiceUsed) {
          this.setStressUpdateTimer(index);
        }        
      }
    },
    getStressTypeName(stressTypeRoll: number) {
      return this.masterData.stressTypes!.find(x => x.minimumRoll <= stressTypeRoll && x.maximumRoll >= stressTypeRoll)?.name;
    },
    getStressStatusMaxRoll(stressTypeRoll: number) {
      const type = this.masterData.stressTypes!.find(x => x.minimumRoll <= stressTypeRoll && x.maximumRoll >= stressTypeRoll);

      return Math.max(...type?.stressStatuses.map(x => x.roll) ?? [-1]) + 1;
    },
    getStressStatusName(stressTypeRoll: number, stressStatusRoll: number) {
      const type = this.masterData.stressTypes!.find(x => x.minimumRoll <= stressTypeRoll && x.maximumRoll >= stressTypeRoll);

      return type?.stressStatuses.find(x => x.roll == stressStatusRoll)?.name;
    },
    applyStressStatus(index: number, stressTypeRoll: number, stressStatusRoll: number) {
      if (this.characterList[index].stress) {
          const type = this.masterData.stressTypes!.find(x => x.minimumRoll <= stressTypeRoll && x.maximumRoll >= stressTypeRoll);

          if (type) {
            const status = type.stressStatuses.find(x => x.roll == stressStatusRoll);

            if (status) {
              this.characterList[index].stress!.stressStatus = status;

              this.setStressUpdateTimer(index);
            }
          }          
      }
    },
    clearStressStatus(index: number) {
      if (this.characterList[index].stress) {
        this.characterList[index].stress!.stressStatus = null;

        this.setStressUpdateTimer(index);
      }
    },
    adjustFirstSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.firstLevel += amount;

        if (this.characterList[index].usedSpellSlots!.firstLevel < 0) {
          this.characterList[index].usedSpellSlots!.firstLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.firstLevel > this.characterList[index].spellSlots!.firstLevel) {
          this.characterList[index].usedSpellSlots!.firstLevel = this.characterList[index].spellSlots!.firstLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustSecondSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.secondLevel += amount;

        if (this.characterList[index].usedSpellSlots!.secondLevel < 0) {
          this.characterList[index].usedSpellSlots!.secondLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.secondLevel > this.characterList[index].spellSlots!.secondLevel) {
          this.characterList[index].usedSpellSlots!.secondLevel = this.characterList[index].spellSlots!.secondLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustThirdSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.thirdLevel += amount;

        if (this.characterList[index].usedSpellSlots!.thirdLevel < 0) {
          this.characterList[index].usedSpellSlots!.thirdLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.thirdLevel > this.characterList[index].spellSlots!.thirdLevel) {
          this.characterList[index].usedSpellSlots!.thirdLevel = this.characterList[index].spellSlots!.thirdLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustFourthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.fourthLevel += amount;

        if (this.characterList[index].usedSpellSlots!.fourthLevel < 0) {
          this.characterList[index].usedSpellSlots!.fourthLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.fourthLevel > this.characterList[index].spellSlots!.fourthLevel) {
          this.characterList[index].usedSpellSlots!.fourthLevel = this.characterList[index].spellSlots!.fourthLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustFifthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.fifthLevel += amount;

        if (this.characterList[index].usedSpellSlots!.fifthLevel < 0) {
          this.characterList[index].usedSpellSlots!.fifthLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.fifthLevel > this.characterList[index].spellSlots!.fifthLevel) {
          this.characterList[index].usedSpellSlots!.fifthLevel = this.characterList[index].spellSlots!.fifthLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustSixthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.sixthLevel += amount;

        if (this.characterList[index].usedSpellSlots!.sixthLevel < 0) {
          this.characterList[index].usedSpellSlots!.sixthLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.sixthLevel > this.characterList[index].spellSlots!.sixthLevel) {
          this.characterList[index].usedSpellSlots!.sixthLevel = this.characterList[index].spellSlots!.sixthLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustSeventhSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.seventhLevel += amount;

        if (this.characterList[index].usedSpellSlots!.seventhLevel < 0) {
          this.characterList[index].usedSpellSlots!.seventhLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.seventhLevel > this.characterList[index].spellSlots!.seventhLevel) {
          this.characterList[index].usedSpellSlots!.seventhLevel = this.characterList[index].spellSlots!.seventhLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustEighthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.eighthLevel += amount;

        if (this.characterList[index].usedSpellSlots!.eighthLevel < 0) {
          this.characterList[index].usedSpellSlots!.eighthLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.eighthLevel > this.characterList[index].spellSlots!.eighthLevel) {
          this.characterList[index].usedSpellSlots!.eighthLevel = this.characterList[index].spellSlots!.eighthLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustNinthSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].spellSlots !== null) {
        this.characterList[index].usedSpellSlots!.ninthLevel += amount;

        if (this.characterList[index].usedSpellSlots!.ninthLevel < 0) {
          this.characterList[index].usedSpellSlots!.ninthLevel = 0;
        }

        if (this.characterList[index].usedSpellSlots!.ninthLevel > this.characterList[index].spellSlots!.ninthLevel) {
          this.characterList[index].usedSpellSlots!.ninthLevel = this.characterList[index].spellSlots!.ninthLevel;
        }

        this.setUpdateTimer(index);
      }
    },
    adjustWarlockSlotsUsed(index: number, amount: number) {
      if (this.characterList[index].usedSpellSlots !== null && this.characterList[index].warlockSpellSlots !== null) {
        this.characterList[index].usedSpellSlots!.warlock += amount;

        if (this.characterList[index].usedSpellSlots!.warlock < 0) {
          this.characterList[index].usedSpellSlots!.warlock = 0;
        }

        if (this.characterList[index].usedSpellSlots!.warlock > this.characterList[index].warlockSpellSlots!.slots) {
          this.characterList[index].usedSpellSlots!.warlock = this.characterList[index].warlockSpellSlots!.slots;
        }

        this.setUpdateTimer(index);
      }
    },
    getTotalLevels(index: number) {
      let totalLevels = 0;
      this.characterList[index].characterClasses.forEach((classLevel) => {
        totalLevels += classLevel.level;
      });

      return totalLevels;
    },
    getProficiencyBonus(index: number) {
      return this.characterList[index].proficiencyBonus.bonus;
    },
    isJackOfAllTrades(index: number) {
      //only calculate if the character is a jack of all trades once
      if (this.characterList[index].isJackOfAllTrades === null) {        
        this.characterList[index].isJackOfAllTrades = this.characterList[index].characterClasses.some(x => x.subclass.jackOfAllTrades)
      }

      return this.characterList[index].isJackOfAllTrades;
    },
    isBeastmaster(index: number) {
      return this.characterList[index].characterClasses.some(x => x.primalCompanion && x.level > 2);
    },
    getPrimalCompanion(index: number) {
      return this.characterList[index].characterClasses.find(x => x.primalCompanion)!.primalCompanion as PrimalCompanion;
    },
    setPrimalCompanion(index: number, primalCompanion: PrimalCompanion) {
      this.characterList[index].characterClasses.map(x => x.primalCompanion ? primalCompanion : null);
    },
    async longRest(index: number) {
      await agent.playerCharacter.longRest(this.characterList[index].playerCharacterId)
        .then((data) => {
          this.characterList[index] = data!;
        });
    },
    levelUp(characterIndex: number, classLevelIndex: number) {
      this.characterList[characterIndex].characterClasses[classLevelIndex].level++;
    },
    getCompanionSenses(index: number) {
      const primalCompanion = this.getPrimalCompanion(index);
      const passivePerception = 10 + Math.floor((primalCompanion.wisdomOverride ?? primalCompanion.primalCompanionType.wisdom - 10) / 2) + this.getProficiencyBonus(index);
      return `Darkvision 60 ft., Passive Perception ${passivePerception}`;
    },
    getBeastmasterLevel(index: number) {
        return this.characterList[index].characterClasses.find(x => x.primalCompanion !== null)?.level ?? 0;
    },
    changePrimalCompanionType(index: number, newTypeId: number) {
      const primalCompanion = this.getPrimalCompanion(index);
      primalCompanion.primalCompanionType = this.masterData.primalCompanionTypes.find(x => x.id == newTypeId) as PrimalCompanionType;

      this.setPrimalCompanion(index, primalCompanion);
    },
    adjustCompanionHitDie(index: number, amount: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);
        primalCompanion.hitDiceUsed += amount;

        if (primalCompanion!.hitDiceUsed < 0) {
          primalCompanion!.hitDiceUsed = 0;
        }
        
        const beastmasterLevel = this.getBeastmasterLevel(index);

        if (primalCompanion!.hitDiceUsed > beastmasterLevel) {
          primalCompanion!.hitDiceUsed = beastmasterLevel;
        }

        //save updates back to character
        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }      
    },
    getCompanionMaxHitPoints(index: number) {
      return this.isBeastmaster(index) ? this.getPrimalCompanion(index).hitPointMaximum - this.getPrimalCompanion(index).maxHitPointReduction : 0;
    },
    adjustCompanionDamage(index: number, damage: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        if (primalCompanion.temporaryHitPoints > 0 && damage > 0) {
          primalCompanion.temporaryHitPoints -= damage;
  
          if (primalCompanion.temporaryHitPoints < 0) {
            damage = primalCompanion.temporaryHitPoints * -1;
            primalCompanion.temporaryHitPoints = 0;
          } else {
            return;
          }
        }
  
        primalCompanion.damage += damage;
        const maxHitPoints = this.getCompanionMaxHitPoints(index);
  
        if (primalCompanion.damage > maxHitPoints) {
          primalCompanion.damage = maxHitPoints;
        }
  
        if (primalCompanion.damage < 0) {
          primalCompanion.damage = 0;
        }

        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }
    },
    adjustCompanionTemporaryHitPoints(index: number, amount: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        primalCompanion.temporaryHitPoints += amount;
  
        if (primalCompanion.temporaryHitPoints < 0) {
          primalCompanion.temporaryHitPoints = 0;
        }

        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }
    },
    getCompanionBaseAc(index: number) {
      const primalCompanion = this.getPrimalCompanion(index);
      
      //primal companions all have base 13 + proficiency AC
      return 13 + primalCompanion.armorClassBonus + this.getProficiencyBonus(index);
    },
    adjustCompanionAcBonus(index: number, amount: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        primalCompanion.armorClassBonus += amount;

        if (primalCompanion.armorClassBonus < 0) {
          primalCompanion.armorClassBonus = 0;
        }

        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }
    },
    resetCompanionDeathSaves(index: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        primalCompanion.deathSaveFailures = 0;
        primalCompanion.deathSaveSuccesses = 0;

        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }
    },
    adjustCompanionDeathSaveSuccesses(index: number, amount: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        primalCompanion.deathSaveSuccesses += amount;

        if (primalCompanion.deathSaveSuccesses < 0) {
          primalCompanion.deathSaveSuccesses = 0;
        }

        if (primalCompanion.deathSaveSuccesses > 3) {
          primalCompanion.deathSaveSuccesses = 3;
        }

        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }
    },
    adjustCompanionDeathSaveFailures(index: number, amount: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        primalCompanion.deathSaveFailures += amount;

        if (primalCompanion.deathSaveFailures < 0) {
          primalCompanion.deathSaveFailures = 0;
        }

        if (primalCompanion.deathSaveFailures > 3) {
          primalCompanion.deathSaveFailures = 3;
        }

        this.setPrimalCompanion(index, primalCompanion);
  
        this.setUpdateTimer(index);
      }
    },
    setCompanionMaxHitPointReduction(index: number, amount: number) {
      const primalCompanion = this.getPrimalCompanion(index);

      const currentHitPoints =  primalCompanion.hitPointMaximum - primalCompanion.maxHitPointReduction - primalCompanion.damage;
      primalCompanion.maxHitPointReduction = amount;
      primalCompanion.damage =  primalCompanion.hitPointMaximum - primalCompanion.maxHitPointReduction - currentHitPoints;

      if (primalCompanion.damage < 0) {
        primalCompanion.damage = 0;
      }

      this.setPrimalCompanion(index, primalCompanion);
    },
    getCompanionAbilityDescription(index: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        const wisSpellSave = 8 + this.getProficiencyBonus(index) + Math.floor((this.characterList[index].wisdom.score - 10) / 2);

        return primalCompanion.primalCompanionType.abilityDescription.replace("<wisSpellSave>", wisSpellSave.toString());
      }

      return "";
    },
    getCompanionActionDescription(index: number) {
      if (this.isBeastmaster(index)) {
        const primalCompanion = this.getPrimalCompanion(index);

        const proficiencyBonus = this.getProficiencyBonus(index);
        const wisdomBonus = Math.floor(( this.characterList[index].wisdom.score - 10) / 2);

        const toHitBonus = proficiencyBonus + wisdomBonus;
        const wisSpellSave = 8 + proficiencyBonus + wisdomBonus;
        const strDamage = Math.floor(( primalCompanion.primalCompanionType.strength - 10) / 2) + proficiencyBonus;
        const dexDamage = Math.floor(( primalCompanion.primalCompanionType.dexterity - 10) / 2) + proficiencyBonus;

        return primalCompanion.primalCompanionType.actionDescription
          .replace("<toHitBonus>", toHitBonus.toString())
          .replace("<wisSpellSave>", wisSpellSave.toString())
          .replace("<strDamage>", strDamage.toString())
          .replace("<dexDamage>", dexDamage.toString());
      }

      return "";
    },
    async cancelEdits(index: number) {
      await agent.playerCharacter.getCharacter(this.characterList[index].playerCharacterId).then((data) => {
        this.characterList[index] = data;
      });
    },
    setUpdateTimer(characterIndex: number) {
      //if base update timer is running, clear it. base props will be updated by this instead
      if (baseUpdateTimer !== 0) {
        clearTimeout(baseUpdateTimer);
        baseUpdateTimer = 0;
      }

      clearTimeout(updateTimer);

      updateTimer = setTimeout(() => {
        this.saveCharacter(characterIndex);
        updateTimer = 0;
      }, updateDelay);
    },
    setBaseUpdateTimer(characterIndex: number) {
      //if non-base changes are staged use that timer instead since it can handle these changes as well
      if (updateTimer !== 0) {
        this.setUpdateTimer(characterIndex);
      } else {
        clearTimeout(baseUpdateTimer);

        baseUpdateTimer = setTimeout(() => {
          this.saveCharacterBase(characterIndex);
          baseUpdateTimer = 0;
        }, updateDelay);
      }     
    },
    setStressUpdateTimer(characterIndex: number) {
      clearTimeout(stressUpdateTimer);

      stressUpdateTimer = setTimeout(() => {
        this.saveStress(characterIndex);
      }, updateDelay);
    },
    async killCharacter(index: number) {
      await agent.playerCharacter.killCharacter(this.characterList[index].playerCharacterId);
    },
    async reviveCharacter(id: number) {
      await agent.playerCharacter.reviveCharacter(id);
    }
  },
  persist: true
});