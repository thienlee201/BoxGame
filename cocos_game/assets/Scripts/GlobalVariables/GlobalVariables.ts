// import { get } from "http";

import { ROOM_TYPE } from "../Networking/NetworkClient";
import Utils from "../Utilities/Utils";

export enum GAME_MODE {
   PVP = "PVP",
   PVE = "PVE",
}

export enum TRAN_HIS_TYPE {
   PVP = "PVP",
   WALLET = "WALLET",
}

export let scoreList = [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2]
export let sizeLimit = 50
export let SNAKE_COLLECTABLE = {}
export let speedConfig = [
   1.05,
   1.10,
   1.15,
   1.20,
   1.20,
   1.25,
   1.25,
   1.30,
   1.30,
]


export const SNAKE_SKIN_CONFIG = [
   {
      name: 'Common',
      speed: 0,
      range: 0,
      type: 0,
      bonus: 0
   },
   {
      name: 'Unique',
      speed: 10,
      range: 10,
      type: 1,
      bonus: 5
   },
   {
      name: 'Rare',
      speed: 15,
      range: 15,
      type: 2,
      bonus: 10
   },
   {
      name: 'Epic',
      speed: 20,
      range: 20,
      type: 3,
      bonus: 15
   },
   {
      name: 'Epic',
      speed: 20,
      range: 20,
      type: 4,
      bonus: 15
   },
   {
      name: 'Mythical',
      speed: 25,
      range: 25,
      type: 5,
      bonus: 20
   },
   {
      name: 'Mythical',
      speed: 25,
      range: 25,
      type: 6,
      bonus: 20
   },
   {
      name: 'Legendary',
      speed: 30,
      range: 30,
      type: 7,
      bonus: 25
   },
   {
      name: 'Legendary',
      speed: 30,
      range: 30,
      type: 8,
      bonus: 25
   },
]
export const SNAKE_MASK = [
   {
      type: 0,
      range: 0,
      speed: 0,
      bonus: 0
   },
   {
      type: 1,
      range: 10,
      speed: 10,
      bonus: 10
   },
   {
      type: 2,
      range: 20,
      speed: 20,
      bonus: 10
   },
   {
      type: 3,
      range: 30,
      speed: 30,
      bonus: 10
   },
]

export class GlobalVar {
   static readonly API_URL: string = 'https://play.snaketon.com/api/requestHandle'
   // static readonly API_URL: string = 'http://localhost:19999/api/requestHandle'
   public static lastGameScore: number = 0;
   public static isTestWin: boolean = false;
   public static avatarUpdated: boolean = false;
   static readonly GAME_NAME: string = 'TON-SNAKE'
   public static playerName = ""
   public static walletAddress = ""
   public static playerUUID: string = ''
   public static clientSession: string = ''
   public static readableWalletAddress = ''
   public static playerTelegramId: string = ''
   public static playerTelegramUsername: string = ''
   public static playerAvatar: string = ''
   public static currentRoomType: ROOM_TYPE
   public static isPause = false
   public static isPvP = false
   public static blockedByMultiDevice = false
   public static tonBalance = 0

   public static currentPlaySessionId
   public static collectableDataOnStart
   public static playersDataOnStart
   public static pvePlayerData
   public static resultData
   public static configSize
   public static spriteSkinIndex = 0
   public static skinIndex = 0
   public static lastConnectionTime = 0

   public static clientTick = 0
   public static serverTick = 0
   public static currentPing = 0

   public static updateInterval = null

   public static skinColors = [
      "#ffaacc", "#aaffaa", "#aaccff", "#ffddaa", "#ddaaff",
      "#aaffdd", "#ffaaaa", "#aaffee", "#ddffaa", "#aaafff",
      "#aaffff", "#ffaaff", "#aabfff", "#ffaaaa", "#aaffbb",
      "#ddaaff", "#ffd4aa", "#aaffd4", "#ffaadd", "#aaeaff",
      "#eaffaa", "#aaccee", "#ffaadd", "#aaffcc", "#ffccdd",
      "#d4ffaa", "#aabfff", "#eaaaee", "#ffd4aa", "#d4eeff"
   ]

   public static gameSceneCacheCallbacks = []
   public static waitingRoomCacheCallbacks = []

   public static coin = -1
   public static point = -1
   public static OPCODE = {
      LOGIN: 196001,
      GET_SHOP_DATA: 196002,
      CREATE_DEPOSIT_ORDER: 196003,
      CREATE_WALLET_DEPOSIT_ORDER: 196030,
      CREATE_WALLET_WITHDRAW_ORDER: 196031,
      AFTER_PAYMENT: 196004,
      BUY_ITEM_SHOP: 196005,
      GET_BAG_DATA: 196006,
      GET_RANK_DATA: 196007,
      GET_TASK_DATA: 196008,
      DO_TASK: 196009,
      CLAIM_TASK: 196010,
      GET_DETAIL_PROFILE: 1960011,
      CHECK_PACKAGE: 1960013,
      CLAIM_PACKAGE: 1960014,
      CLAIM_FIRST_PACKAGE: 1960015,
      PARSE_WALLET: 1960016,
      CALL_INVITE: 1960018,
      UPDATE_AVATAR: 1960019,
      BUY_VSNAKE: 1960020,
      BUY_SKIN: 1960021,
      BUY_MASK: 1960022,
      GET_WALLET_HISTORY: 197001,
      FETCH_PROFILE_BALANCE: 197002,
      REPORT_FAIL_TRANSACTION: 197003,
   }
}
