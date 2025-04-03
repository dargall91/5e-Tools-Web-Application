import { Campaign } from "@/models/Campaign";
import { LoginRegisterRequest } from "@/models/LoginRegisterRequest";
import { User } from "@/models/User";
import { PlayerCharacter, PlayerCharacterMasterData } from "@/models/PlayerCharacter";
import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import { Combatant } from "@/models/Combatant";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axiosInstance.get<T>(url).then(responseBody),
  post: <T>(url: string, body: any) => axiosInstance.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: any) => axiosInstance.put<T>(url, body).then(responseBody)
};

const user = {
  login(user: LoginRegisterRequest) {
    return requests.post<User>('user/login', user);
  },
  register(user: LoginRegisterRequest) {
    return requests.put<User>('user/register', user);
  }
};

const campaign = {
  getCampaignList() {
    return requests.get<Campaign[]>('campaign/list');
  },
  getActiveCampaign() {
    return requests.get<Campaign>('campaign/getActive');
  }
}

const playerCharacter = {
  getMasterData() {
    return requests.get<PlayerCharacterMasterData>('pc/masterdata');
  },
  addPlayerCharacter(playerCharacter: PlayerCharacter) {
    return requests.put('pc/add', playerCharacter);
  },
  getAliveCharacterList(userId: number, campaignId: number) {
    return requests.get<PlayerCharacter[]>(`pc/${userId}/${campaignId}/alive`);
  },
  getDeadCharacterList(userId: number, campaignId: number) {
    return requests.get<PlayerCharacter[]>(`pc/${userId}/${campaignId}/dead`);
  },
  getCharacter(characterId: number) {
    return requests.get<PlayerCharacter>(`pc/${characterId}`);
  },
  updatePlayerCharacter(playerCharacter: PlayerCharacter) {
    return requests.post<PlayerCharacter>('pc/update', playerCharacter);
  },
  killCharacter(characterId: number) {
    return requests.post<PlayerCharacter>(`pc/${characterId}/kill`, null);
  },
  reviveCharacter(characterId: number) {
    return requests.post<PlayerCharacter>(`pc/${characterId}/revive`, null);
  }
}

const combat = {
  getCombatants() {
    return requests.get<Combatant[]>('combat/combatants');
  }
}

const agent = {
  user,
  campaign,
  playerCharacter,
  combat
};

export default agent;