import { defineStore } from 'pinia'
import agent from '@/api/agent';
import { Campaign } from '@/models/Campaign';

export const useCampaignStore = defineStore({
  id: 'campaign',
  state: () => ({
    campaignList: [] as Campaign[],
    activeCampaign: { id: 0 } as Campaign,
    selectedCampaign: { id: 0 } as Campaign,
  }),
  actions: {
    async getCampaignList() {
      await agent.campaign.getCampaignList().then((data) => {
        this.campaignList = data;
      })
    },
    async getActiveCampaign() {
      await agent.campaign.getActiveCampaign().then((data) => {
        this.activeCampaign = data;
        this.selectedCampaign = data;
      })
    },
    setSelectedCampaign(id: number) {
      this.selectedCampaign = { id: 0} as Campaign;
    }
  }
});