<template>
  <h2 class="mt-2">Manage Characters</h2>
  
  <CRow>
    <CCol xs="3" md="2" class="mt-2">
      <CFormLabel for="campaign" class="fw-bold align-text-bottom">Campaign:</CFormLabel>
    </CCol>
    <CCol xs="9" sm="8" md="6">
      <CFormSelect @change="onCampaignChanged(parseInt($event.target.value))" id="campaign" :model-value="campaignStore.selectedCampaign.value.id.toString()">
        <option v-for="(item) in campaignStore.campaignList.value" :value="item.id" :key="item.id">{{ item.name }}</option>
      </CFormSelect>
    </CCol>
  </CRow>

  <CButton v-show="characterStore.deadCharacterList.value.length > 0" @click="showReviveCharacter()" color="dark">Revive Character</CButton>

  <CAccordion class="mt-2" accordion-color="black" always-open>
    <CAccordionItem v-for="(character, characterIndex) in characterStore.characterList.value" :key="characterIndex" :item-key="characterIndex">
      <CAccordionHeader>
        {{ character.name }}
      </CAccordionHeader>
      <CAccordionBody>
        <CButton class="me-1" size="sm" color="dark" @click="showLongRest(characterIndex)">Long Rest</CButton>
        <CButton class="me-1" size="sm" color="dark" @click="showEditCharacter(characterIndex)">Edit</CButton>
        <CButton size="sm" color="dark" @click="showKillCharacter(characterIndex)">Kill</CButton>

        <!-- Class Info -->
        <CRow class="mt-1" v-for="classLevel, classLevelIndex in character.classLevelList" :key="classLevel.id">
          <CCol xs="6" md="4" lg="3" v-if="classLevel.baseClass">
            <strong>Base Class:</strong> {{ classLevel.characterClass.name }}
          </CCol>
          <CCol xs="6" md="5" lg="3" v-else>
            <strong>Multiclass:</strong> {{ classLevel.characterClass.name }}
          </CCol>
          <CCol xs="3" lg="2">
            <strong>Level:</strong> {{ classLevel.levels }}
          </CCol>
          <CCol xs="12" md="5" lg="7">
            <strong>Hit Dice Used:</strong> {{ classLevel.usedHitDice }} / {{ classLevel.levels }}d{{ classLevel.characterClass.hitDie }}
            <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustHitDie(characterIndex, classLevelIndex, -1)">-1</CButton>
            <CButton size="sm" color="success" @click="characterStoreFunctions.adjustHitDie(characterIndex, classLevelIndex, 1)">+1</CButton>
          </CCol>
        </CRow>
        
        <!-- Hit Points -->
        <CRow class="mt-1">
          <CCol xs="12" sm="7" md="5" lg="4" xl="3">
            <CRow>
              <CCol>
                <strong>Hit Points:</strong> {{ characterStoreFunctions.getMaxHitPoints(characterIndex, campaignStore.selectedCampaign.value) - character.damage }} / {{ characterStoreFunctions.getMaxHitPoints(characterIndex, campaignStore.selectedCampaign.value) }}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustDamage(characterIndex, 10, campaignStore.selectedCampaign.value)">-10</CButton>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustDamage(characterIndex, 5, campaignStore.selectedCampaign.value)">-5</CButton>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustDamage(characterIndex, 1, campaignStore.selectedCampaign.value)">-1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustDamage(characterIndex, -1, campaignStore.selectedCampaign.value)">+1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustDamage(characterIndex, -5, campaignStore.selectedCampaign.value)">+5</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustDamage(characterIndex, -10, campaignStore.selectedCampaign.value)">+10</CButton>
              </CCol>
            </CRow>
          </CCol>
          <CCol xs="12" sm="5">
            <CRow>
              <CCol>
                <strong>Temporary HP:</strong> {{ character.temporaryHitPoints }}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustTemporyHitPoints(characterIndex, -5)">-5</CButton>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustTemporyHitPoints(characterIndex, -1)">-1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustTemporyHitPoints(characterIndex, 1)">+1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustTemporyHitPoints(characterIndex, 5)">+5</CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>

        <!-- AC -->
        <CRow class="mt-1">
          <CCol xs="5" sm="4" md="3" lg="2">
            <strong>AC:</strong> {{ character.ac }} 
            <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustAc(characterIndex, -1)">-1</CButton>
            <CButton size="sm" color="success" @click="characterStoreFunctions.adjustAc(characterIndex, 1)">+1</CButton>
          </CCol>
          <CCol xs="7" sm="5" md="4" lg="3">
            <strong>AC Bonuses:</strong> {{ character.acBonus }} 
            <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustAcBonus(characterIndex, -1)">-1</CButton>
            <CButton size="sm" color="success" @click="characterStoreFunctions.adjustAcBonus(characterIndex, 1)">+1</CButton>
          </CCol>
          <CCol class="mt-1" xs="12" sm="3">
            <strong>Total AC:</strong> {{ character.ac + character.acBonus }} 
          </CCol>
        </CRow>

        <!-- Death Saves -->
        <CRow>
          <CCol  class="mt-1" md="12" lg="4" xl="3">
            <strong>Death Saving Throws: </strong>
            <CButton size="sm" color="dark" @click="characterStoreFunctions.resetDeathSaves(characterIndex)">Reset</CButton>
          </CCol>
          <CCol class="mt-1" xs="12" sm="6" lg="3" xxl="2">
            <strong>Successes:</strong> {{ character.deathSaveSuccesses }}
            <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustDeathSaveSuccesses(characterIndex, -1)">-1</CButton>
            <CButton size="sm" color="success" @click="characterStoreFunctions.adjustDeathSaveSuccesses(characterIndex, 1)">+1</CButton>
          </CCol>
          <CCol class="mt-1" xs="12" sm="6" lg="3" xl="2">
            <strong>Failures:</strong> {{ character.deathSaveFailures }}
            <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustDeathSaveFailures(characterIndex, -1)">-1</CButton>
            <CButton size="sm" color="success" @click="characterStoreFunctions.adjustDeathSaveFailures(characterIndex, 1)">+1</CButton>
          </CCol>
        </CRow>

        <!-- Stress -->
        <CRow v-if="campaignStore.selectedCampaign.value.madness">
          <CCol class="mt-1" xs="12" sm="7" md="5" lg="4" xl="3">
            <CRow>
              <CCol>
                <strong>Stress:</strong> {{ character.stress }} / {{ characterStoreFunctions.getStressThreshold(characterIndex, campaignStore.selectedCampaign.value) }}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustStress(characterIndex, -10, campaignStore.selectedCampaign.value)">-10</CButton>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustStress(characterIndex, -5, campaignStore.selectedCampaign.value)">-5</CButton>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustStress(characterIndex, -1, campaignStore.selectedCampaign.value)">-1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustStress(characterIndex, 1, campaignStore.selectedCampaign.value)">+1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustStress(characterIndex, 5, campaignStore.selectedCampaign.value)">+5</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustStress(characterIndex, 10, campaignStore.selectedCampaign.value)">+10</CButton>
              </CCol>
            </CRow>
          </CCol>
          <CCol class="mt-1" xs="12" sm="5" md="3"  v-if="character.stress >= characterStoreFunctions.getStressThreshold(characterIndex, campaignStore.selectedCampaign.value) && character.stressStatus.id === 1">
            <CRow>
              <CCol>
                <CFormLabel for="stressRoll" class="fw-bold">d100 Roll:</CFormLabel>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormInput id="stressRoll" min="1" max="100" v-model.number="stressRoll" type="number" />
              </CCol>
              <CCol>
                <CButton size="sm" color="dark" @click="characterStoreFunctions.applyAfflictionOrVirtue(characterIndex, stressRoll, campaignStore.selectedCampaign.value); stressRoll = 1;">Enter</CButton>
              </CCol>
            </CRow>
          </CCol>
          <CCol class="mt-1" xs="12" lg="4">
            <CRow>
              <CCol>
                <strong>Meditation Dice Used: </strong> {{ character.meditationDiceUsed }} / 10
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustMeditationDice(characterIndex, -1, campaignStore.selectedCampaign.value)">-1</CButton>
                <CButton size="sm" color="success" @click="characterStoreFunctions.adjustMeditationDice(characterIndex, 1, campaignStore.selectedCampaign.value)">+1</CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        
        <!-- Affliction/Virtue -->
        <CCard class="mt-1" v-if="character.stressStatus.id > 1">
          <CCardHeader>
            {{ character.stressStatus.type }}: {{ character.stressStatus.name }}
            <CButton size="sm" color="dark" @click="characterStoreFunctions.applyAfflictionOrVirtue(characterIndex, 0, campaignStore.selectedCampaign.value)">Clear</CButton>
          </CCardHeader>
          <CCardBody>
            <span v-html="character.stressStatus.description"></span>
          </CCardBody>
        </CCard>

        <!-- Ability Scores, Spell Slots, Primal Companion -->
        <CAccordion class="mt-1" always-open>
          <!-- Ability Scores -->
          <CAccordionItem>
            <CAccordionHeader>Ability Scores</CAccordionHeader>
            <CAccordionBody>
              <CRow>
                <!-- Strength -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>Strength (STR): {{ character.strength.score }} ({{ getScoreModifierString(character.strength.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.strength.score, character.strength.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Athletics: </strong> {{ getSkillBonus(character.strength.score, character.strength.athletics, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <!-- Dexterity -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>Dexterity (DEX): {{ character.dexterity.score }} ({{ getScoreModifierString(character.dexterity.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.dexterity.score, character.dexterity.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Acrobatics: </strong> {{ getSkillBonus(character.dexterity.score, character.dexterity.acrobatics, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Sleight of Hand: </strong> {{ getSkillBonus(character.dexterity.score, character.dexterity.sleightOfHand, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Stealth: </strong> {{ getSkillBonus(character.dexterity.score, character.dexterity.stealth, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <!-- Constitution -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>Constitution (CON): {{ character.constitution.score }} ({{ getScoreModifierString(character.constitution.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.constitution.score, character.constitution.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <!-- Intelligence  -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>Intelligence (INT): {{ character.intelligence.score }} ({{ getScoreModifierString(character.intelligence.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.intelligence.score, character.intelligence.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Arcana: </strong> {{ getSkillBonus(character.intelligence.score, character.intelligence.arcana, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>History: </strong> {{ getSkillBonus(character.intelligence.score, character.intelligence.history, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Investigation: </strong> {{ getSkillBonus(character.intelligence.score, character.intelligence.investigation, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Nature: </strong> {{ getSkillBonus(character.intelligence.score, character.intelligence.nature, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Religion: </strong> {{ getSkillBonus(character.intelligence.score, character.intelligence.religion, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <!-- Wisdom -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>Wisdom (WIS): {{ character.wisdom.score }} ({{ getScoreModifierString(character.wisdom.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.wisdom.score, character.wisdom.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Animal Handling: </strong> {{ getSkillBonus(character.wisdom.score, character.wisdom.animalHandling, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Insight: </strong> {{ getSkillBonus(character.wisdom.score, character.wisdom.insight, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Medicine: </strong> {{ getSkillBonus(character.wisdom.score, character.wisdom.medicine, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Perception: </strong> {{ getSkillBonus(character.wisdom.score, character.wisdom.perception, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Survival: </strong> {{ getSkillBonus(character.wisdom.score, character.wisdom.survival, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Passive Perception: </strong> {{ getPassiveTotal(character.wisdom.score, character.wisdom.survival, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <!-- Charisma -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>Charisma (CHA): {{ character.charisma.score }} ({{ getScoreModifierString(character.charisma.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.charisma.score, character.charisma.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Deception: </strong> {{ getSkillBonus(character.charisma.score, character.charisma.deception, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Intimidation: </strong> {{ getSkillBonus(character.charisma.score, character.charisma.intimidation, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Performance: </strong> {{ getSkillBonus(character.charisma.score, character.charisma.performance, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol class="mt-1">
                          <strong>Persuasion: </strong> {{ getSkillBonus(character.charisma.score, character.charisma.persuasion, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex), characterStoreFunctions.isJackOfAllTrades(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <!-- Resolve -->
                <CCol xs="6" sm="4" v-if="campaignStore.selectedCampaign.value.madness">
                  <CCard class="mt-2">
                    <CCardHeader>Resolve (RES): {{ character.resolve!.score }} ({{ getScoreModifierString(character.resolve!.score) }})</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Saving Throws: </strong> {{ getSavingThrowBonus(character.resolve!.score, character.resolve!.proficient, 
                                  characterStoreFunctions.getProficiencyBonus(characterIndex)) }}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CAccordionBody>
          </CAccordionItem>

          <!-- Spell Slots -->
          <CAccordionItem v-if="character.spellSlots != null || character.warlockSpellSlots != null">
            <CAccordionHeader>Spell Slots</CAccordionHeader>
            <CAccordionBody>
              <CRow>
                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.first > 0">
                  <CCard>
                    <CCardHeader>1st-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.first - character.firstSlotsUsed }} / {{ character.spellSlots.first }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustFirstSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustFirstSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.second > 0">
                  <CCard>
                    <CCardHeader>2nd-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.second - character.secondSlotsUsed }} / {{ character.spellSlots.second }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustSecondSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustSecondSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.third > 0">
                  <CCard>
                    <CCardHeader>3rd-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.third - character.thirdSlotsUsed }} / {{ character.spellSlots.third }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustThirdSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustThirdSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.fourth > 0">
                  <CCard>
                    <CCardHeader>4th-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.fourth - character.fourthSlotsUsed }} / {{ character.spellSlots.fourth }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustFourthSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustFourthSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.fifth > 0">
                  <CCard>
                    <CCardHeader>5th-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.fifth - character.fifthSlotsUsed }} / {{ character.spellSlots.fifth }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustFifthSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustFifthSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.sixth > 0">
                  <CCard>
                    <CCardHeader>6th-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.sixth - character.sixthSlotsUsed }} / {{ character.spellSlots.sixth }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustSixthSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustSixthSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.seventh > 0">
                  <CCard>
                    <CCardHeader>7th-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.seventh - character.seventhSlotsUsed }} / {{ character.spellSlots.seventh }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustSeventhSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustSeventhSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null && character.spellSlots.eighth > 0">
                  <CCard>
                    <CCardHeader>8th-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.eighth - character.eighthSlotsUsed }} / {{ character.spellSlots.eighth }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustEighthSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustEighthSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" class="mb-1" v-if="character.spellSlots != null  && character.spellSlots.ninth > 0">
                  <CCard>
                    <CCardHeader>9th-Level</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.spellSlots.ninth - character.ninthSlotsUsed }} / {{ character.spellSlots.ninth }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustNinthSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustNinthSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs="6" sm="6" md="4" lg="3" xl="2" v-if="character.warlockSpellSlots != null">
                  <CCard>
                    <CCardHeader>Warlock Slots</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <strong>Slot Level: </strong> {{ character.warlockSpellSlots.slotLevel }}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <strong>Remaining: </strong> {{ character.warlockSpellSlots.quantity - character.warlockSlotsUsed }} / {{ character.warlockSpellSlots.quantity }}
                        </CCol>
                      </CRow>
                        <CRow>
                          <CCol>
                          <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustWarlockSlotsUsed(characterIndex, 1)">-1</CButton>
                          <CButton size="sm" color="success" @click="characterStoreFunctions.adjustWarlockSlotsUsed(characterIndex, -1)">+1</CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CAccordionBody>
          </CAccordionItem>

          <!-- Primal Companion -->
          <CAccordionItem v-if="character.primalCompanion != null && characterStoreFunctions.isBeastmaster(characterIndex)">
            <CAccordionHeader>Primal Companion - {{ character.primalCompanion.name }}</CAccordionHeader>
            <CAccordionBody>
              <CButton size="sm" color="dark" @click="showEditCompanion(characterIndex)">Edit</CButton>

              <!-- Description -->
              <CRow class="mt-1">
                <CCol xs="12" sm="6" lg="3">
                  <strong>Type:</strong> {{ character.primalCompanion.primalCompanionType.name }}
                </CCol>
                <CCol xs="12" sm="6" lg="3">
                  <strong>Speed:</strong> {{ character.primalCompanion.primalCompanionType.speed }}
                </CCol>
                <CCol sm="6" lg="3">
                  <strong>Size:</strong> {{ character.primalCompanion.primalCompanionType.size }} {{ character.primalCompanion.type }}
                </CCol>
                <CCol sm="6" lg="3">
                  <strong>Alignment:</strong> {{ character.primalCompanion.alignment }}
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="12" lg="6" xl="5">
                  <strong>Senses:</strong> {{ characterStoreFunctions.getCompanionSenses(characterIndex) }}
                </CCol>
                <CCol sm="12" lg="6" xl="5">
                  <strong>Languages:</strong> {{ character.primalCompanion.languages }}
                </CCol>
              </CRow>

              <!-- Hit Points -->
              <CRow>
                <CCol>
                  <strong>Hit Dice Used:</strong> {{ character.primalCompanion.hitDiceUsed }} / {{ characterStoreFunctions.getBeastmasterLevel(characterIndex) }}d{{ character.primalCompanion.primalCompanionType.hitDie }}
                  <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionHitDie(characterIndex, -1)">-1</CButton>
                  <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionHitDie(characterIndex, 1)">+1</CButton>
                </CCol>
              </CRow>
              <CRow class="mt-1">
                <CCol xs="12" md="5" lg="4" xl="3">
                  <CRow>
                    <CCol>
                      <strong>Hit Points:</strong> {{ characterStoreFunctions.getCompanionMaxHitPoints(characterIndex) - character.primalCompanion.damage }} / {{ characterStoreFunctions.getCompanionMaxHitPoints(characterIndex)! }}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionDamage(characterIndex, 10)">-10</CButton>
                      <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionDamage(characterIndex, 5)">-5</CButton>
                      <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionDamage(characterIndex, 1)">-1</CButton>
                      <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionDamage(characterIndex, -1)">+1</CButton>
                      <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionDamage(characterIndex, -5)">+5</CButton>
                      <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionDamage(characterIndex, -10)">+10</CButton>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol xs="12" sm="5">
                  <CRow>
                    <CCol>
                      <strong>Temporary HP:</strong> {{ character.primalCompanion.temporaryHitPoints }}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionTemporaryHitPoints(characterIndex, -5)">-5</CButton>
                      <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionTemporaryHitPoints(characterIndex, -1)">-1</CButton>
                      <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionTemporaryHitPoints(characterIndex, 1)">+1</CButton>
                      <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionTemporaryHitPoints(characterIndex, 5)">+5</CButton>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>

              <!-- AC -->
              <CRow class="mt-1">
                <CCol class="mt-1" xs="12" sm="4" md="4" lg="2">
                  <strong>Base AC:</strong> {{ characterStoreFunctions.getCompanionBaseAc(characterIndex) }} 
                </CCol>
                <CCol xs="12" sm="6" md="4" lg="3">
                  <strong>AC Bonuses:</strong> {{ character.primalCompanion.acBonus }} 
                  <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionAcBonus(characterIndex, -1)">-1</CButton>
                  <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionAcBonus(characterIndex, 1)">+1</CButton>
                </CCol>
                <CCol class="mt-1" xs="12" md="4">
                  <strong>Total AC:</strong> {{ characterStoreFunctions.getCompanionBaseAc(characterIndex) + character.primalCompanion.acBonus }} 
                </CCol>
              </CRow>

              <!-- Death Saves -->
              <CRow>
                <CCol  class="mt-1" md="12" lg="4" xl="3">
                  <strong>Death Saving Throws: </strong>
                  <CButton size="sm" color="dark" @click="characterStoreFunctions.resetCompanionDeathSaves(characterIndex)">Reset</CButton>
                </CCol>
                <CCol  class="mt-1" xs="12" sm="6" lg="3" xxl="2">
                  <strong>Successes:</strong> {{ character.primalCompanion.deathSaveSuccesses }}
                  <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionDeathSaveSuccesses(characterIndex, -1)">-1</CButton>
                  <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionDeathSaveSuccesses(characterIndex, 1)">+1</CButton>
                </CCol>
                <CCol class="mt-1" xs="12" lg="3" xl="2">
                  <strong>Failures:</strong> {{ character.primalCompanion.deathSaveFailures }}
                  <CButton size="sm" color="danger" @click="characterStoreFunctions.adjustCompanionDeathSaveFailures(characterIndex, -1)">-1</CButton>
                  <CButton size="sm" color="success" @click="characterStoreFunctions.adjustCompanionDeathSaveFailures(characterIndex, 1)">+1</CButton>
                </CCol>
              </CRow>

              <!-- Ability -->
              <CRow class="mt-1">
                <CCol>
                  <strong>Ability:</strong>
                </CCol>
                <CCol xs="12">
                  <strong>{{ character.primalCompanion.primalCompanionType.abilityName }}:</strong> {{ characterStoreFunctions.getCompanionAbilityDescription(characterIndex) }} 
                </CCol>
              </CRow>

              <!-- Action -->
              <CRow class="mt-1">
                <CCol xs="12">
                  <strong>Action:</strong>
                </CCol>
                <CCol>
                  <strong>{{ character.primalCompanion.primalCompanionType.actionName }}:</strong> <span v-html="characterStoreFunctions.getCompanionActionDescription(characterIndex)" ></span>
                </CCol>

              </CRow>

              <!-- Ability Scores -->
              <CRow>
                <!-- Strength -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>STR: {{ character.primalCompanion.primalCompanionType.strength }} ({{ getScoreModifierString(character.primalCompanion.primalCompanionType.strength) }})</CCardHeader>
                    <CCardBody>
                      <strong>Skill/Save Bonus:</strong> {{ getCompanionSkillSaveBonus(characterIndex, character.primalCompanion.primalCompanionType.strength) }}
                    </CCardBody>
                  </CCard>
                </CCol>
                <!-- Dexterity -->
                <CCol  xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>DEX: {{ character.primalCompanion.primalCompanionType.dexterity }} ({{ getScoreModifierString(character.primalCompanion.primalCompanionType.dexterity) }})</CCardHeader>
                    <CCardBody>
                      <strong>Skill/Save Bonus:</strong> {{ getCompanionSkillSaveBonus(characterIndex, character.primalCompanion.primalCompanionType.dexterity) }}
                    </CCardBody>
                  </CCard>
                </CCol>
                <!-- Constitution -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>CON: {{ character.primalCompanion.primalCompanionType.constitution }} ({{ getScoreModifierString(character.primalCompanion.primalCompanionType.constitution) }})</CCardHeader>
                    <CCardBody>
                      <strong>Skill/Save Bonus:</strong> {{ getCompanionSkillSaveBonus(characterIndex, character.primalCompanion.primalCompanionType.constitution) }}
                    </CCardBody>
                  </CCard>
                </CCol>
                <!-- Intelligence -->
                <CCol  xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>INT: {{ character.primalCompanion.primalCompanionType.intelligence }} ({{ getScoreModifierString(character.primalCompanion.primalCompanionType.intelligence) }})</CCardHeader>
                    <CCardBody>
                      <strong>Skill/Save Bonus:</strong> {{ getCompanionSkillSaveBonus(characterIndex, character.primalCompanion.primalCompanionType.intelligence) }}
                    </CCardBody>
                  </CCard>
                </CCol>
                <!-- Wisdom -->
                <CCol xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>WIS: {{ character.primalCompanion.primalCompanionType.wisdom }} ({{ getScoreModifierString(character.primalCompanion.primalCompanionType.wisdom) }})</CCardHeader>
                    <CCardBody>
                      <strong>Skill/Save Bonus:</strong> {{ getCompanionSkillSaveBonus(characterIndex, character.primalCompanion.primalCompanionType.wisdom) }}
                    </CCardBody>
                  </CCard>
                </CCol>
                <!-- Charisma -->
                <CCol  xs="6" sm="4">
                  <CCard class="mt-2">
                    <CCardHeader>CHA: {{ character.primalCompanion.primalCompanionType.charisma }} ({{ getScoreModifierString(character.primalCompanion.primalCompanionType.charisma) }})</CCardHeader>
                    <CCardBody>
                      <strong>Skill/Save Bonus:</strong> {{ getCompanionSkillSaveBonus(characterIndex, character.primalCompanion.primalCompanionType.charisma) }}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>

  <!-- Long Rest Modal -->
  <CModal :visible="longRest" @close="() => { longRest = false; }">
    <CModalHeader>
      <CModalTitle>Long Rest</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Long rest to automatically apply the following effects to {{ characterStore.characterList.value[indexToModify].name }}:
      <ul>
        <li>Recover all hit points (any temporary hit points will be lost)</li>
        <li v-if="characterStore.characterList.value[indexToModify].primalCompanion != null">Your Primal Companion recovers all hit points (any temporary hit points will be lost)</li>
        <li>Recover hit dice equal to half of your total level (minimum of 1, if multiclassed your largest hit dice are prioritized)</li>
        <li v-if="characterStore.characterList.value[indexToModify].primalCompanion != null">Your Primal Companion recovers hit dice equal to half of your Ranger level (minimum of 1)</li>
        <li>Recover all expended spell slots</li>
        <li v-if="campaignStore.selectedCampaign.value.madness">If your stress level is greater than your stress threshold, it becomes equal to your threshold</li>
        <li v-if="campaignStore.selectedCampaign.value.madness">If your stress level is less than or equal to your stress threshold, you lose 50 stress</li>
        <li v-if="campaignStore.selectedCampaign.value.madness">Lose your Affliction or Virtue if you have one</li>
        <li v-if="campaignStore.selectedCampaign.value.madness">Recover 5 meditation dice</li>
      </ul>

      *Decimals are always rounded down unless specified otherwise
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { longRest = false; }">Cancel</CButton>
      <CButton color="dark" @click="() => { characterStoreFunctions.longRest(indexToModify, campaignStore.selectedCampaign.value); longRest = false; }">Long Rest</CButton>
    </CModalFooter>
  </CModal>

  <!-- Edit Character Modal -->
  <CModal size="xl" :visible="editCharacter" @close="closeCharacterEditorAndCancelEdits()" >
    <CModalHeader>
      <CModalTitle>Edit {{ characterStore.characterList.value[indexToModify].name }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <!-- Classes -->
      <CRow class="mb-1" v-for="classLevel, classLevelIndex in characterStore.characterList.value[indexToModify].classLevelList" :key="classLevel.id">
        <CCol xs="4" sm="3" v-if="classLevel.baseClass">
          <strong>Base Class:</strong> {{ classLevel.characterClass.name }}
        </CCol>
        <CCol xs="4" sm="3" v-else>
          <strong>Multiclass:</strong> {{ classLevel.characterClass.name }}
        </CCol>
        <CCol xs="4" sm="3">
          <strong>Level:</strong> {{ classLevel.levels }}
        </CCol>
        <CCol xs="4" sm="3" v-if="canBeEldritchNight(classLevel)">
          <CFormCheck label="Eldtritch Knight" v-model="classLevel.eldritchKnight" value="true"/>
        </CCol>
        <CCol xs="4" sm="3" v-if="canBeArcaneTrickster(classLevel)">
          <CFormCheck label="Arcane Trickster" v-model="classLevel.arcaneTrickster" value="true" />
        </CCol>
        <CCol xs="4" sm="3" v-if="canBeBeastmaster(classLevel)">
          <CFormCheck label="Beastmaster" v-model="classLevel.beastMaster" value="true" />
        </CCol>
        <CCol xs="4" sm="3" v-if="!levelUp && characterStoreFunctions.getTotalLevels(indexToModify) < 20">
          <CButton size="sm" color="dark" @click="() => { levelUp = true; characterStoreFunctions.levelUp(indexToModify, classLevelIndex)}">Level Up</CButton>
        </CCol>
      </CRow>
      <CButton size="sm" v-if="!levelUp && characterStore.characterList.value[indexToModify].classLevelList.length < characterStore.masterData.value.characterClasses.length &&
                                newMulticlass.characterClass.id === 0 && characterStoreFunctions.getTotalLevels(indexToModify) < 20" color="dark" 
        @click="setNewMulticlass(1)">Add Multiclass</CButton>
      <CRow v-if="newMulticlass.characterClass.id != 0">
        <CCol xs="3" lg="2" xl="1">
          <strong>Multiclass: </strong>
        </CCol>
        <CCol xs="5" sm="3">
          <CFormSelect @change="setNewMulticlass(parseInt($event.target.value))" :id="'multiClass'">
            <option v-for="(item) in characterStore.masterData.value.characterClasses" :value="item.id" :key="item.id">{{ item.name }}</option>
          </CFormSelect>
        </CCol>
        <CCol>
          <strong>Level:</strong> {{ newMulticlass.levels }}
        </CCol>
      </CRow>

      <CFormCheck class="mt-1" label="Tough Feat" v-model="characterStore.characterList.value[indexToModify].toughFeat" value="true" />
      <CRow>
        <CCol sm="5" lg="3" xl="2">
          <CFormLabel class="fw-bold align-text-bottom" for="reduction">Max HP Reduction:</CFormLabel>
        </CCol>
        <CCol lg="2" xl="1">
          <CFormInput id="reduction" v-model.number="characterStore.characterList.value[indexToModify].maxHpReduction" type="number" />
        </CCol>
      </CRow>

      <!-- Ability Scores -->
      <CRow>
        <!-- Strength -->
        <CCol xs="6" sm="4">
          <CCard class="mt-2">
            <CCardHeader>Strength (STR)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setStrength(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].strength.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setStrengthSave($event.target.value, indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].strength.proficient.toString()">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString()">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Athletics:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setAthletics(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].strength.athletics.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Dexterity -->
        <CCol xs="6" sm="4">
          <CCard class="mt-2">
            <CCardHeader>Dexterity (DEX)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setDexterity(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].dexterity.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setDexteritySave($event.target.value, indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].dexterity.proficient.toString()">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Acrobatics:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setAcrobatics(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].dexterity.acrobatics.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Sleight of Hand:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setSleightOfHand(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].dexterity.sleightOfHand.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Stealth:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setStealth(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].dexterity.stealth.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Constitution -->
        <CCol xs="6" sm="4">
          <CCard class="mt-2">
            <CCardHeader>Constitution (CON)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setConstitution(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].constitution.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setConstitutionSave($event.target.value, indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].constitution.proficient.toString()">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Intelligence  -->
        <CCol xs="6" sm="4">
        <CCard class="mt-2">
        <CCardHeader>Intelligence (INT)</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">Score:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setIntelligence(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.score.toString()">
                <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setIntelligenceSave($event.target.value, indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.proficient.toString()">
                <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">Arcana:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setArcana(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.arcana.toString()">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">History:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setHistory(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.history.toString()">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">Investigation:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setInvestigation(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.investigation.toString()">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">Nature:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setNature(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.nature.toString()">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-2">
              <CFormLabel class="fw-bold">Religion:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="characterStoreFunctions.setReligion(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].intelligence.religion.toString()">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
        </CCard>
        </CCol>

        <!-- Wisdom -->
        <CCol xs="6" sm="4">
          <CCard class="mt-2">
              <CCardHeader>Wisdom (WIS)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setWisdom(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].wisdom.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setWisdomSave($event.target.value, indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].wisdom.proficient.toString()">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Animal Handling:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setAnimalHandling(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].wisdom.animalHandling.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Insight:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setInsight(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].wisdom.insight.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Medicine:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setMedicine(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].wisdom.medicine.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
              <CCol class="mt-2">
                <CFormLabel class="fw-bold">Perception:</CFormLabel>
              </CCol>
              <CCol sm="auto">
                <CFormSelect @change="characterStoreFunctions.setPerception(parseInt($event.target.value), indexToModify)" :modelValue="'0'">
                  <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                </CFormSelect>
              </CCol>
            </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Survival:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setSurvival(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].wisdom.survival.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Charisma -->
        <CCol xs="6" sm="4">
          <CCard class="mt-2">
            <CCardHeader>Charisma (CHA)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setCharisma(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].charisma.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setCharismaSave($event.target.value, indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].charisma.proficient.toString()">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Deception:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setDeception(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].charisma.deception.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Intimidation:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setIntimidation(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].charisma.intimidation.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Performance:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setPerformance(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].charisma.performance.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-2">
                  <CFormLabel class="fw-bold">Persuasion:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setPersuasion(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].charisma.persuasion.toString()">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Resolve -->
        <CCol xs="6" sm="4" v-if="campaignStore.selectedCampaign.value.madness">
          <CCard class="mt-2">
            <CCardHeader>Resolve (RES)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol  class="mt-2">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="characterStoreFunctions.setResolve(parseInt($event.target.value), indexToModify)" :modelValue="characterStore.characterList.value[indexToModify].resolve?.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeCharacterEditorAndCancelEdits()">Cancel</CButton>
      <CButton color="dark" @click="closeCharacterEditorAndSaveEdits()">Save</CButton>
    </CModalFooter>
  </CModal>

  <!-- Edit Primal Companion Modal -->
  <CModal :visible="editCompanion" @close="closeCompanionEditorAndCancelEdits()" >
    <CModalHeader>
      <CModalTitle>Edit Primal Companion</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <!-- Name -->
      <CRow>
        <CCol>
          <CFormLabel class="mt-1 fw-bold" for="companionName">Name:</CFormLabel>
        </CCol>
        <CCol>
          <CFormInput id="companionName" v-model="characterStore.characterList.value[indexToModify].primalCompanion!.name" />
        </CCol>
      </CRow>

      <!-- Type -->
      <CRow class="mt-1">
        <CCol>
          <CFormLabel class="mt-1 fw-bold">Primal Companion Type:</CFormLabel>
        </CCol>
        <CCol>
          <CFormSelect @change="characterStoreFunctions.setCompanionType(indexToModify, parseInt($event.target.value))" :id="'companionType'"
            :model-value="characterStore.characterList.value[indexToModify].primalCompanion!.primalCompanionType.id.toString()">
            <option v-for="(item) in characterStore.masterData.value.primalCompanionTypes" :value="item.id" :key="item.id">{{ item.name }}</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <!-- Max HP Reduction -->
      <CRow class="mt-1">
        <CCol>
          <CFormLabel class="mt-1 fw-bold" for="reduction">Max HP Reduction:</CFormLabel>
        </CCol>
        <CCol>
          <CFormInput id="reduction" v-model.number="characterStore.characterList.value[indexToModify].primalCompanion!.maxHpReduction" type="number" />
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeCompanionEditorAndCancelEdits()">Cancel</CButton>
      <CButton color="dark" @click="closeCompanionEditorAndSaveEdits()">Save</CButton>
    </CModalFooter>
  </CModal>

  <!-- Kill Character -->
  <CModal :visible="killCharacter" @close="closeAndCancelKillCharacter()">
    <CModalHeader>
      <CModalTitle>Kill Character</CModalTitle>
    </CModalHeader>
    <CModalBody class="fw-bold">Kill {{ characterStore.characterList.value[indexToModify].name }}?</CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeAndCancelKillCharacter()">Cancel</CButton>
      <CButton color="dark" @click="closeKillCharacterAndSave()">Kill</CButton>
    </CModalFooter>
  </CModal>

  <!-- Revive Character -->
  <CModal :visible="reviveCharacter" @close="closeReviveCharacter()">
    <CModalHeader>
      <CModalTitle>Revive Character</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CFormSelect @change="setIdToRevive(parseInt($event.target.value))" :id="'multiClass'" :model-value="idToRevive.toString()">
        <option v-for="(character) in characterStore.deadCharacterList.value" :value="character.id" :key="character.id">{{ character.name }}</option>
      </CFormSelect>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeReviveCharacter()">Cancel</CButton>
      <CButton color="dark" @click="closeReviveCharacterAndRevive()">Revive</CButton>
    </CModalFooter>
  </CModal>

</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/UserStore'
  import { useCampaignStore } from '@/stores/CampaignStore'
  import { useCharacterStore } from '@/stores/CharacterStore'
  import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCard, CCardBody, CCardHeader, CCol, CFormCheck, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/vue'
  import { CharacterClass, ClassLevel, PlayerCharacter } from '@/models/PlayerCharacter'
  import { Campaign } from '@/models/Campaign'
  
  export default defineComponent({
    name: "ManageCharacters",
    components: { CFormSelect, CAccordion, CRow, CCol, CFormLabel, CAccordionHeader, CAccordionBody, CAccordionItem, CButton, CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormCheck, CFormInput },
    setup() {
      return {
        userStore: storeToRefs(useUserStore()),
        campaignStore: storeToRefs(useCampaignStore()),
        characterStore: storeToRefs(useCharacterStore())
      };
    },
    data() {
      return {
        getCampaignList: useCampaignStore().getCampaignList,
        getActiveCampaign: useCampaignStore().getActiveCampaign,
        characterStoreFunctions: useCharacterStore(),
        getCharacterList: useCharacterStore().getCharacterLists,
        setSelectedCampaign: useCampaignStore().setSelectedCampaign,
        clearCharacterList: useCharacterStore().clearCharacterList,
        numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                    11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        savingThrowLevels: [
          { proficient: false, value: "None" },
          { proficient: true, value: "Proficient" }
        ],
        skillProficiencyLevel: [
          { level: 0, value: "None"},
          { level: 1, value: "Proficient"},
          { level: 2, value: "Expertise"},
        ],
        longRest: false,
        editCharacter: false,
        editCompanion: false,
        killCharacter: false,
        reviveCharacter: false,
        levelUp: false,
        newMulticlass: { characterClass: { id: 0 } as CharacterClass } as ClassLevel,
        stressRoll: 1,
        characterToEdit: {} as PlayerCharacter,
        indexToModify: -1,
        idToRevive: 0
      }
    },
    methods: {
      async onCampaignChanged(id: number) {
        this.setSelectedCampaign(id);
        if (id != 0) {
          await this.getCharacterList(this.userStore.user.value?.id as number, this.campaignStore.activeCampaign.value.id);
        } else {
          this.clearCharacterList();
        }
      },
      canBeEldritchNight(classLevel: ClassLevel) {
        return classLevel.characterClass.name === "Fighter" && classLevel.levels >= 3;
      },
      canBeArcaneTrickster(classLevel: ClassLevel) {
        return classLevel.characterClass.name === "Rogue" && classLevel.levels >= 3;
      },
      canBeBeastmaster(classLevel: ClassLevel) {
        return classLevel.characterClass.name === "Ranger" && classLevel.levels >= 3;
      },
      setNewMulticlass(classId: number) {
        this.levelUp = true;
        this.newMulticlass.characterClass = { id: classId } as CharacterClass;
        this.newMulticlass.levels = 1;
        this.newMulticlass.baseClass = false;
      },
      async closeCharacterEditorAndCancelEdits() {
        this.editCharacter = false;
        this.levelUp = false;
        this.newMulticlass = { characterClass: { id: 0 } as CharacterClass } as ClassLevel;
        await this.characterStoreFunctions.cancelEdits(this.indexToModify);
        this.indexToModify = -1;
      },
      async closeCharacterEditorAndSaveEdits() {
        this.editCharacter = false;
        this.levelUp = false;
        if (this.newMulticlass.characterClass.id != 0) {
          this.characterStore.characterList.value[this.indexToModify].classLevelList.push(this.newMulticlass);
        }

        await this.characterStoreFunctions.saveCharacter(this.indexToModify);
        this.newMulticlass = { characterClass: { id: 0 } as CharacterClass } as ClassLevel;
        this.indexToModify = -1;
      },
      async closeCompanionEditorAndCancelEdits() {
        this.editCompanion = false;
        await this.characterStoreFunctions.cancelEdits(this.indexToModify);
        this.indexToModify = -1;
      },
      async closeCompanionEditorAndSaveEdits() {
        this.editCompanion = false;
        await this.characterStoreFunctions.saveCharacter(this.indexToModify);
        this.indexToModify = -1;
      },
      showLongRest(index: number) {
        this.longRest = true;
        this.indexToModify = index;
      },
      closeLongRestAndApplyRest(campaign: Campaign) {
        this.characterStoreFunctions.longRest(this.indexToModify, campaign);
        this.closeLongRest();
      },
      closeLongRest() {
        this.longRest = false;
        this.indexToModify = -1;
      },
      getScoreModifier(score: number) {
        return Math.floor((score - 10) / 2.0);
      },
      getScoreModifierString(score: number) {
        let modNum = this.getScoreModifier(score);

        var modString: string;

        if (modNum < 0) {
          modString = modNum.toString();
        } else {
          modString = "+" + modNum;
        }

        return modString;
      },
      getCompanionSkillSaveBonus(index: number, score: number) {
        let bonus = Math.floor((score - 10) / 2);
        bonus += this.characterStoreFunctions.getProficiencyBonus(index);

        return "+" + bonus;
      },
      getSavingThrowBonus(score: number, proficient: boolean, proficiencyBonus: number) {
        var bonus = this.getScoreModifier(score);
        var bonusString: string;

        if (proficient) {
          bonus += proficiencyBonus;
        }

        if (bonus < 0) {
          bonusString = bonus.toString();
        } else {
          bonusString = "+" + bonus;
        }

        return bonusString;
      },
      getSkillBonus(score: number, proficiencyLevel: number, proficiencyBonus: number, jackOfAllTrades: boolean) {
        var bonus = this.getScoreModifier(score);
        var bonusString: string;

        if (proficiencyLevel === 2) {
          bonus += proficiencyBonus * 2;
        } else if (proficiencyLevel === 1) {
          bonus += proficiencyBonus;
        } else if (jackOfAllTrades) {
          bonus += Math.floor(proficiencyBonus / 2);
        }

        if (bonus < 0) {
          bonusString = bonus.toString();
        } else {
          bonusString = "+" + bonus;
        }

        return bonusString;
      },
      getPassiveTotal(score: number, proficiencyLevel: number, proficiencyBonus: number, jackOfAllTrades: boolean) {
        var bonus = 10 + this.getScoreModifier(score);
        
        if (proficiencyLevel === 2) {
          bonus += proficiencyBonus * 2;
        } else if (proficiencyLevel === 1) {
          bonus += proficiencyBonus;
        } else if (jackOfAllTrades) {
          bonus += Math.floor(proficiencyBonus / 2);
        }

        return bonus;
      },
      showEditCharacter(index: number) {
        this.editCharacter = true;
        this.indexToModify = index;
      },
      showEditCompanion(index: number) {
        if (this.characterStore.characterList.value[index].primalCompanion != null) {
          this.editCompanion = true;
          this.indexToModify = index;
        }
      },
      showKillCharacter(index: number) {
        this.killCharacter = true;
        this.indexToModify = index;
      },
      closeAndCancelKillCharacter() {
        this.killCharacter = false;
        this.indexToModify = -1;
      },
      async closeKillCharacterAndSave() {
        this.killCharacter = false;
        await this.characterStoreFunctions.killCharacter(this.indexToModify);
        await this.characterStoreFunctions.getCharacterLists(this.userStore.user.value.id, this.campaignStore.selectedCampaign.value.id);
        this.indexToModify = -1;
      },
      showReviveCharacter() {
        this.reviveCharacter = true;
        this.idToRevive = this.characterStore.deadCharacterList.value[0].id;
      },
      closeReviveCharacter() {
        this.reviveCharacter = false;
        this.idToRevive = 0;
      },
      setIdToRevive(id: number) {
        this.idToRevive = id;
      },
      async closeReviveCharacterAndRevive() {
        await this.characterStoreFunctions.reviveCharacter(this.idToRevive);
        await this.characterStoreFunctions.getCharacterLists(this.userStore.user.value.id, this.campaignStore.selectedCampaign.value.id);
        this.reviveCharacter = false;
        this.idToRevive = 0;
      }
    },
    async mounted() {
      if (this.campaignStore.activeCampaign.value.id === 0) {
        await this.getCampaignList();
        await this.getActiveCampaign();
      }
      
      await this.characterStoreFunctions.getMasterData();
      await this.getCharacterList(this.userStore.user.value.id as number, this.campaignStore.selectedCampaign.value.id);
    }
  });
</script>

<style>
  .accordion-button:focus {
      box-shadow: none;
      border-color: rgba(0,0,0,.125);
  }

  .accordion-button.collapsed {
    background: lightgray;
  }

  .accordion-button:not(.collapsed) {
      color: white;
      background-color: black;

  }

  .accordion-button.collapsed::before {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000000'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
  }

  .accordion-button:not(.collapsed)::after {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFFFFF'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
  }

  .accordion-button {
    font-weight: bold;
  }

  .card-header {
    font-weight: bold;
  }

  .modal-title {
    font-weight: bold;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>