<template>
  <h2 class="mt-2">Character Creator</h2>
  
  <div :key="key">
    <CForm @submit.prevent="submit" v-if="mounted">
      <!-- Campiagn Selector -->
      <CRow>
        <CCol xs="3" md="2" class="mt-1">
          <CFormLabel for="campaign" class="fw-bold align-text-bottom">Campaign:</CFormLabel>
        </CCol>
        <CCol xs="9" md="6">
          <CFormSelect @change="setCampaign(parseInt($event.target.value))" id="campaign" :modelValue="campaignStore.selectedCampaign.value.campaignId.toString()">
            <option v-for="(item) in campaignStore.campaignList.value" :value="item.campaignId" :key="item.campaignId">{{ item.name }}</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <!-- Name -->
      <CRow class="mt-1">
        <CCol xs="3" md="2" class="mt-1">
          <CFormLabel for="name" class="fw-bold align-text-bottom">Name:</CFormLabel>
        </CCol>
        <CCol xs="9" sm="8" md="6">
          <CFormInput id="name" v-model="playerCharacter.name" type="text"></CFormInput>
        </CCol>
      </CRow>
    
      <!-- AC -->
      <CRow class="mt-1">
        <CCol xs="4" sm="3" md="2" class="mt-1">
          <CFormLabel for="armorClass" class="fw-bold align-text-bottom">Armor Class:</CFormLabel>
        </CCol>
        <CCol xs="3">
          <CFormInput id="armorClass" min="1" max="30" v-model.number="playerCharacter.baseArmorClass" type="number"></CFormInput>
        </CCol>
      </CRow>

      <!-- Base Class Selector -->
      <CRow>
        <CCol xs="4" md="2" class="mt-2">
          <CFormLabel for="baseclass" class="fw-bold">Base Class:</CFormLabel>
        </CCol>
        <CCol class="mt-1" xs="8" md="4" lg="3">
          <CFormSelect @change="setBaseClass(parseInt($event.target.value))" id="baseclass" :modelValue="campaignStore.selectedCampaign.value.classes[0].id.toString()">
            <option v-for="(item) in campaignStore.selectedCampaign.value.classes" :value="item.id" :key="item.id">{{ item.name }}</option>
          </CFormSelect>
        </CCol>
        <CCol class="mt-1" xs="8" md="4" lg="3">
          <CFormSelect @change="setBaseSubclass(parseInt($event.target.value))" id="subClass">
            <option v-for="(item) in subclassList(playerCharacter.characterClasses[0].subclass.id)" :value="item.id" :key="item.id">{{ item.name }}</option>
          </CFormSelect>
        </CCol>
        <CCol xs="3" md="1" class="mt-2">
          <CFormLabel for="baselevel" class="fw-bold">Level:</CFormLabel>
        </CCol>
        <CCol class="mt-1" xs="3" md="2" lg="1">
          <CFormSelect @change="setBaseLevel(parseInt($event.target.value))" id="baselevel">
            <option v-for="level in numberList" :value="level" :key="level">{{ level }}</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <!-- multiclass -->
      <template v-if="campaignStore.selectedCampaign.value.allowsMulticlassing" >
        <CRow v-for="(multiclass, index) in multiClassList" :id="index.toString()" :key="index" class="mt-1">
          <CCol xs="4" md="2" class="mt-2">
            <CFormLabel :for="'multiClass' + index" class="fw-bold">Multiclass:</CFormLabel>
          </CCol>
          <CCol class="mt-1" xs="8" md="4" lg="3">
            <CFormSelect @change="setMulticlassClass(multiclass, parseInt($event.target.value))" :id="'multiClass' + index" :key="index" :modelValue="multiclass.subclass.id.toString()">
              <option v-for="(item) in campaignStore.selectedCampaign.value.classes" :value="item.id" :key="item.id">{{ item.name }}</option>
            </CFormSelect>
          </CCol>
          <CCol class="mt-1" xs="8" md="4" lg="3">
            <CFormSelect @change="setMulticlassSubclass(multiclass, parseInt($event.target.value))" :id="'multiClass' + index" :key="index" :modelValue="multiclass.subclass.id.toString()">
              <option v-for="(item) in subclassList(multiclass.subclass.id)" :value="item.id" :key="item.id">{{ item.name }}</option>
            </CFormSelect>
          </CCol>
          <CCol xs="3" md="1" class="mt-2">
            <CFormLabel :for="'multiClassLevel' + index" class="fw-bold">Level:</CFormLabel>
          </CCol>
          <CCol class="mt-1" xs="3" md="2" lg="1">
            <CFormSelect @change="($event) => {multiclass.level = parseInt($event.target.value)}" :id="'multiClassLevel' + index" :key="index">
              <option v-for="level in numberList" :value="level" :key="level">{{ level }}</option>
            </CFormSelect>
          </CCol>
          <CCol class="mt-1">
            <CButton color="dark" type="button" @click="removeMulticlass(index)" class="btn btn-primary">Remove Mulitclass</CButton>
          </CCol>
        </CRow>

        <CButton v-if="multiClassList.length < campaignStore.selectedCampaign.value.classes.length - 1" color="dark" type="button" @click="addMulticlass" class="mt-1 btn btn-primary">Add Mulitclass</CButton>
      </template>

      <CFormCheck class="mt-2" :id="'tough'" label="Tough Feat" v-model="playerCharacter.toughFeat" value="true" />

      <!-- Ability Scores -->
      <CRow>
        <!-- Strength -->
        <CCol xs="6" sm="4" v-if="playerCharacter.strength">
          <CCard class="mt-1">
            <CCardHeader>Strength (STR)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setStrength(parseInt($event.target.value))" :modelValue="playerCharacter.strength.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setStrengthSave($event.target.value)" :modelValue="'false'">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Athletics:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setAthletics(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Dexterity -->
        <CCol xs="6" sm="4" v-if="playerCharacter.dexterity">
          <CCard class="mt-1">
            <CCardHeader>Dexterity (DEX)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setDexterity(parseInt($event.target.value))" :modelValue="playerCharacter.dexterity.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setDexteritySave($event.target.value)" :modelValue="'false'">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Acrobatics:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setAcrobatics(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Sleight of Hand:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setSleightOfHand(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Stealth:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setStealth(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Constitution -->
        <CCol xs="6" sm="4" v-if="playerCharacter.constitution">
          <CCard class="mt-1">
            <CCardHeader>Constitution (CON)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setConstitution(parseInt($event.target.value))" :modelValue="playerCharacter.constitution.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setConstitutionSave($event.target.value)" :modelValue="'false'">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Intelligence  -->
        <CCol xs="6" sm="4" v-if="playerCharacter.intelligence">
        <CCard class="mt-1">
        <CCardHeader>Intelligence (INT)</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">Score:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setIntelligence(parseInt($event.target.value))" :modelValue="playerCharacter.intelligence.score.toString()">
                <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setIntelligenceSave($event.target.value)" :modelValue="'false'">
                <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">Arcana:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setArcana(parseInt($event.target.value))" :modelValue="'0'">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">History:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setHistory(parseInt($event.target.value))" :modelValue="'0'">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">Investigation:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setInvestigation(parseInt($event.target.value))" :modelValue="'0'">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">Nature:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setNature(parseInt($event.target.value))" :modelValue="'0'">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-1">
              <CFormLabel class="fw-bold">Religion:</CFormLabel>
            </CCol>
            <CCol sm="auto">
              <CFormSelect @change="setReligion(parseInt($event.target.value))" :modelValue="'0'">
                <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
        </CCard>
        </CCol>

        <!-- Wisdom -->
        <CCol xs="6" sm="4" v-if="playerCharacter.wisdom">
          <CCard class="mt-1">
              <CCardHeader>Wisdom (WIS)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setWisdom(parseInt($event.target.value))" :modelValue="playerCharacter.wisdom.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setWisdomSave($event.target.value)" :modelValue="'false'">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Animal Handling:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setAnimalHandling(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Insight:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setInsight(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Medicine:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setMedicine(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Perception:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setPerception(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Survival:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setSurvival(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Charisma -->
        <CCol xs="6" sm="4" v-if="playerCharacter.charisma">
          <CCard class="mt-1">
            <CCardHeader>Charisma (CHA)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setCharisma(parseInt($event.target.value))" :modelValue="playerCharacter.charisma.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Saving Throws:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setCharismaSave($event.target.value)" :modelValue="'false'">
                    <option v-for="proficiency in savingThrowLevels" :value="proficiency.proficient" :key="proficiency.proficient.toString">{{ proficiency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Deception:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setDeception(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Intimidation:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setIntimidation(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Performance:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setPerformance(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol class="mt-1">
                  <CFormLabel class="fw-bold">Persuasion:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setPersuasion(parseInt($event.target.value))" :modelValue="'0'">
                    <option v-for="profciency in skillProficiencyLevel" :value="profciency.level" :key="profciency.level">{{ profciency.value }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Resolve -->
        <CCol xs="6" sm="4" v-if="playerCharacter.resolve">
          <CCard class="mt-1">
            <CCardHeader>Resolve (RES)</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol  class="mt-1">
                  <CFormLabel class="fw-bold">Score:</CFormLabel>
                </CCol>
                <CCol sm="auto">
                  <CFormSelect @change="setResolve(parseInt($event.target.value))" :modelValue="playerCharacter.resolve!.score.toString()">
                    <option v-for="score in numberList" :value="score" :key="score">{{ score }}</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CButton color="dark" type="submit" class="btn btn-primary mt-1">Create {{ playerCharacter.name }}</CButton>
    </CForm>
  </div>

  <!-- Error Toast -->
  <CToaster placement="top-end">
    <CToast v-for="toast in errorToasts" :key="toast" color="danger">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.body }}
      </CToastBody>
    </CToast>
  </CToaster>

  <!-- Success Toast -->
  <CToaster placement="top-end">
    <CToast v-for="toast in successToasts" :key="toast" color="success">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.body }}
      </CToastBody>
    </CToast>
  </CToaster>

</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/UserStore'
  import { useCampaignStore } from '@/stores/CampaignStore'
  import { useCharacterStore } from '@/stores/CharacterStore'
  import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow, CToast, CToastBody, CToaster, CToastHeader } from '@coreui/vue'
  import { CharacterClass, PlayerCharacter, ProficiencyBonus } from '@/models/PlayerCharacter'
  import agent from '@/api/agent'
  
  export default defineComponent({
    name: "CharacterCreator",
    components: { CFormSelect, CFormLabel, CRow, CCol, CButton, CCard, CCardBody, CCardHeader, CForm, CFormInput, CToast, CToaster, CToastHeader, CToastBody, CFormCheck },
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
        setSelectedCampaign: useCampaignStore().setSelectedCampaign,
        getActiveCampaign: useCampaignStore().getActiveCampaign,
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
        multiClassList: [] as CharacterClass[],
        playerCharacter: { } as PlayerCharacter,
        errorToasts: [] as any,
        successToasts: [] as any,
        key: 0,
        mounted: false
      }
    },
    methods: {
      async setCampaign(id: number) {
        if (id === 0) {
          return;
        }

        useCampaignStore().setSelectedCampaign(id);
        var defaultClass = this.campaignStore.selectedCampaign.value.classes[0].id;
        this.setSelectedCampaign(id);
        this.setBaseClass(defaultClass);
        this.multiClassList.forEach(x => this.setMulticlassClass(x, defaultClass));
      },
      subclassList(subclassId: number) {
        return this.campaignStore.selectedCampaign.value.classes.find(c => c.subclasses.some(s => s.id === subclassId))!.subclasses
      },
      setBaseClass(classId: number) {
        this.playerCharacter.characterClasses[0].subclass
          = this.campaignStore.selectedCampaign.value.classes.find(x => x.id === classId)!.subclasses[0];
      },
      setBaseSubclass(subclassId: number) {
        this.playerCharacter.characterClasses[0].subclass = this.subclassList(subclassId).find(x => x.id === subclassId)!;
      },
      setBaseLevel(level: number) {
        this.playerCharacter.characterClasses[0].level = level;
      },
      addMulticlass() {
        if (this.multiClassList.length < this.campaignStore.selectedCampaign.value.classes.length - 1) {
          let newClassLevel = {
              baseClass: false,
              level: 1,
              subclass: this.campaignStore.selectedCampaign.value.classes[0].subclasses[0]
            } as CharacterClass;
          this.multiClassList.push(newClassLevel);
        }
      },
      removeMulticlass(index: number) {
        this.multiClassList.splice(index, 1);
      },
      setMulticlassClass(multiclass: CharacterClass, classId: number) {
        multiclass.subclass = this.campaignStore.selectedCampaign.value.classes.find(x => x.id === classId)!.subclasses[0];
      },
      setMulticlassSubclass(multiclass: CharacterClass, subclassId: number) {
        multiclass.subclass = this.subclassList(subclassId).find(x => x.id === subclassId)!;
      },
      setStrength(score: number) {
        this.playerCharacter.strength.score = score;
      },
      setStrengthSave(proficient: string) {
        this.playerCharacter.strength.proficient = proficient === "true";
      },
      setAthletics(level: number) {
        this.playerCharacter.strength.athletics = level;
      },
      setDexterity(score: number) {
        this.playerCharacter.dexterity.score = score;
      },
      setDexteritySave(proficient: string) {
        this.playerCharacter.dexterity.proficient = proficient === "true";
      },
      setAcrobatics(level: number) {
        this.playerCharacter.dexterity.acrobatics = level;
      },
      setSleightOfHand(level: number) {
        this.playerCharacter.dexterity.sleightOfHand = level;
      },
      setStealth(level: number) {
        this.playerCharacter.dexterity.stealth = level;
      },
      setConstitution(score: number) {
        this.playerCharacter.constitution.score = score;
      },
      setConstitutionSave(proficient: string) {
        this.playerCharacter.constitution.proficient = proficient === "true";
      },
      setIntelligence(score: number) {
        this.playerCharacter.intelligence.score = score;
      },
      setIntelligenceSave(proficient: string) {
        this.playerCharacter.intelligence.proficient = proficient === "true";
      },
      setArcana(level: number) {
        this.playerCharacter.intelligence.arcana = level;
      },
      setHistory(level: number) {
        this.playerCharacter.intelligence.history = level;
      },
      setInvestigation(level: number) {
        this.playerCharacter.intelligence.investigation = level;
      },
      setNature(level: number) {
        this.playerCharacter.intelligence.nature = level;
      },
      setReligion(level: number) {
        this.playerCharacter.intelligence.religion = level;
      },
      setWisdom(score: number) {
        this.playerCharacter.wisdom.score = score;
      },
      setWisdomSave(proficient: string) {
        this.playerCharacter.wisdom.proficient = proficient === "true";
      },
      setAnimalHandling(level: number) {
        this.playerCharacter.wisdom.animalHandling = level;
      },
      setInsight(level: number) {
        this.playerCharacter.wisdom.insight = level;
      },
      setMedicine(level: number) {
        this.playerCharacter.wisdom.medicine = level;
      },
      setPerception(level: number) {
        this.playerCharacter.wisdom.perception = level;
      },
      setSurvival(level: number) {
        this.playerCharacter.wisdom.survival = level;
      },
      setCharisma(score: number) {
        this.playerCharacter.charisma.score = score;
      },
      setCharismaSave(proficient: string) {
        this.playerCharacter.charisma.proficient = proficient === "true";
      },
      setDeception(level: number) {
        this.playerCharacter.charisma.deception = level;
      },
      setIntimidation(level: number) {
        this.playerCharacter.charisma.intimidation = level;
      },
      setPerformance(level: number) {
        this.playerCharacter.charisma.performance = level;
      },
      setPersuasion(level: number) {
        this.playerCharacter.charisma.persuasion = level;
      },
      setResolve(score: number) {
        if (this.playerCharacter.resolve != null) {
          this.playerCharacter.resolve.score = score;
        }
      },
      initPlayerCharacter() {
        this.playerCharacter = {
          playerCharacterId: 0,
          name: "",
          baseArmorClass: 10,
          armorClassBonus: 0,
          temporaryHitPoints: 0,
          deathSaveSuccesses: 0,
          deathSaveFailures: 0,
          stress: null,
          proficiencyBonus: { level: 1, bonus: 1 } as ProficiencyBonus,
          strength: { 
            score: 10,
            proficient: false,
            athletics: 0
          },
          dexterity: { 
            score: 10,
            proficient: false,
            acrobatics: 0,
            sleightOfHand: 0,
            stealth: 0
          },
          constitution: { 
            score: 10,
            proficient: false
          },
          intelligence: { 
            score: 10,
            proficient: false,
            arcana: 0,
            history: 0,
            investigation: 0,
            nature: 0,
            religion: 0
          },
          wisdom: { 
            score: 10,
            proficient: false,
            animalHandling: 0,
            insight: 0,
            medicine: 0,
            perception: 0,
            survival: 0
          },
          charisma: { 
            score: 10,
            proficient: false,
            deception: 0,
            intimidation: 0,
            performance: 0,
            persuasion: 0
          },
          resolve: this.campaignStore.selectedCampaign.value.usesStress ? { score: 10 } : null,
          characterClasses: [
            {
              baseClass: true,
              level: 1,
              subclass: this.campaignStore.selectedCampaign.value.classes[0].subclasses[0]
            } as CharacterClass
          ] as CharacterClass[]
        } as PlayerCharacter;
      },
      async submit() {
        let error = false;

        //campiagn validator
        if (this.campaignStore.selectedCampaign.value.campaignId === 0) {
          error = true;
          this.errorToasts.push(
            { title: "Submission Error:", body: "No campaign selected"}
          );
        }

        this.playerCharacter.name = this.playerCharacter.name.trim();

        if (this.playerCharacter.name === "") {
          error = true;
          this.errorToasts.push(
            { title: "Submission Error:", body: "Name cannot be blank"}
          );
        }

        //validate base class
        if (this.playerCharacter.characterClasses[0].subclass.id === 0) {
          error = true;
          this.errorToasts.push(
            { title: "Submission Error:", body: "No base class selected"}
          );
        }

        //validate each multiclass
        this.multiClassList.forEach((classLevel, index) => {
          if (classLevel.subclass.id === 0) {
            error = true;
            this.errorToasts.push(
              { title: "Submission Error:", body: "No multiclass selected"}
            );
          } else {
            //check for duplicate multiclasses
            const duplicateMulticlass = this.multiClassList.slice(index + 1, this.multiClassList.length).find(x => x.subclass.id === classLevel.subclass.id);

            if (duplicateMulticlass != undefined) {
              error = true;
              this.errorToasts.push(
                { title: "Submission Error:", body: "Duplicate multiclass selected"}
              );
            }
          }
        });

        //search for duplicates of base class
        const matchBaseClass = this.multiClassList.find(x => x.subclass.id === this.playerCharacter.characterClasses[0].subclass.id);

        if (matchBaseClass != undefined) {
          error = true;
            this.errorToasts.push(
              { title: "Submission Error:", body: "Multiclass cannot match base class"}
            );
        }

        //validate levels
        let totalLevels = this.playerCharacter.characterClasses[0].level;

        this.multiClassList.forEach(classLevel => {
          totalLevels += classLevel.level;
        });

        if (totalLevels > 20) {
          error = true;
          this.errorToasts.push(
            { title: "Submission Error:", body: "Total class levels cannot exceed 20"}
          );
        }
        
        if (!error) {
          this.playerCharacter.characterClasses.push(...this.multiClassList);

          await agent.playerCharacter.addPlayerCharacter(this.playerCharacter, this.userStore.user.value.userId, this.campaignStore.selectedCampaign.value.campaignId).then(() => {
            this.successToasts.push(
              { title: "Success!", body: `${this.playerCharacter.name} created`}
            );
            this.key += 1;
            this.initPlayerCharacter();
            this.multiClassList = [];
          });
          
          useCharacterStore().getCharacterLists(this.userStore.user.value.userId, this.campaignStore.selectedCampaign.value.campaignId);
        }
      }
    },
    async mounted() {
      await this.getCampaignList();
      await this.getActiveCampaign();
      this.initPlayerCharacter();
      this.mounted = true;
    } 
  });
</script>