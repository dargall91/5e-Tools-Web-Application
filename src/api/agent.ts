import { Campaign } from "@/models/Campaign";
import { LoginRegisterRequest } from "@/models/LoginRegisterRequest";
import { User } from "@/models/User";
import { Item, PlayerCharacter, PlayerCharacterMasterData, Stress } from "@/models/PlayerCharacter";
import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import { Combatant } from "@/models/Combatant";
import { ResponseWrapper } from "@/models/ResponseWrapper";

const responseBody = <T>(response: AxiosResponse<ResponseWrapper<T>>) => response.data.data;

const requests = {
  get: <T>(url: string) => axiosInstance.get<ResponseWrapper<T>>(url).then(responseBody),
  postNoBody: <T>(url: string) => axiosInstance.post<ResponseWrapper<T>>(url).then(responseBody),
  post: <T>(url: string, body: any) => axiosInstance.post<ResponseWrapper<T>>(url, body).then(responseBody),
  put: <T>(url: string, body: any) => axiosInstance.put<ResponseWrapper<T>>(url, body).then(responseBody),
  putNoBody: <T>(url: string) => axiosInstance.put<ResponseWrapper<T>>(url).then(responseBody)
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
    return requests.get<Campaign[]>('campaign/all');
  },
  getActiveCampaign() {
    return requests.get<Campaign>('campaign/active');
  }
}

const playerCharacter = {
  getMasterData(campaignId: number) {
    return requests.get<PlayerCharacterMasterData>(`player-character/master-data?campaignId=${campaignId}`);
  },
  getItemList() {
    return requests.get<Item[]>('player-character/items');
  },
  getCharacter(characterId: number) {
    return requests.get<PlayerCharacter>(`player-character/${characterId}`);
  },
  getCharacters(userId: number, campaignId: number, isDead: boolean) {
    return requests.get<PlayerCharacter[]>(`player-character?campaignId=${campaignId}&userId=${userId}&isDead=${isDead}`);
  },  
  addPlayerCharacter(playerCharacter: PlayerCharacter, userId: number, campaignId: number) {
    return requests.put(`player-character?campaignId=${campaignId}&userId=${userId}`, playerCharacter);
  },
  updatePlayerCharacter(playerCharacter: PlayerCharacter) {
    return requests.post<PlayerCharacter>('player-character/', playerCharacter);
  },
  updatePlayerCharacterBase(playerCharacter: PlayerCharacter) {
    return requests.post<PlayerCharacter>('player-character/base', playerCharacter);
  },
  updateStress(characterId: number, stress: Stress) {
    return requests.post<Stress>(`player-character/${characterId}/stress`, stress);
  },
  longRest(playerCharacterId: number) {
    return requests.postNoBody<PlayerCharacter>(`player-character/${playerCharacterId}/rest`);
  },
  killCharacter(characterId: number) {
    return requests.postNoBody<PlayerCharacter>(`player-character/${characterId}/kill`);
  },
  reviveCharacter(characterId: number) {
    return requests.postNoBody<PlayerCharacter>(`player-character/${characterId}/revive`);
  },
  addNewItem(name: string) {
    return requests.putNoBody<Item>(`player-character/items?name=${name}`);
  }
}

const combat = {
  getCombatants() {
    return requests.get<Combatant[]>('combatant');
  }
}

const agent = {
  user,
  campaign,
  playerCharacter,
  combat
};

export default agent;