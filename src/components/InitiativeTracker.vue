<template>
    <ul class="combat mt-2">
      <li v-for="(combatant) in combatants" :key="combatant.order">{{ combatant.order }}. {{ combatant.name }}</li>
    </ul>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Combatant } from '@/models/Combatant'
  import agent from '@/api/agent'

  export default defineComponent({
    data() {
      return {
        combatants: [] as Combatant[],
        delay: 1000,
        timer: undefined as number | undefined
      }
    },
    methods: {
      async getCombatants() {
        await agent.combat.getCombatants().then((data) => {
          this.combatants = data;
        });

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.getCombatants();
        }, this.delay)
      }
    },
    async mounted() {
      this.getCombatants();
    },
    unmounted() {
      clearTimeout(this.timer);
    }
  })
</script>

<style>
  .combat {
    list-style-type: none;
    padding: 0;
    margin: auto;
    font-size: 3em;
    text-align: left;
    grid-template-columns: repeat(3, 32%);
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 25px;
    grid-column-gap: 2%;
  }

  @media (max-width: 480px) {
    .combat {
      font-size: 1.5em;
      grid-template-columns: repeat(2, 48%);
      grid-row-gap: 10px;
      grid-column-gap: 4%;
    }
  }
</style>