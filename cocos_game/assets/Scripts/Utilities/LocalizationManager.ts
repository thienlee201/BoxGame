
export enum LANGUAGE {
   EN = "EN",
   JP = "JP",
   SP = "SP",
   KR = "KR",
   PO = "PO",
   RU = "RU"
}

export class LocalizationManager {
   static language: LANGUAGE = LANGUAGE.EN
   private static getLanguageData(forceType?: LANGUAGE) {
      if (forceType && forceType == LANGUAGE.EN) return EN_DATA

      switch (this.language) {
         case LANGUAGE.EN: {
            return EN_DATA;
            break;
         }
         case LANGUAGE.JP: {
            return JP_DATA;
            break;
         }
         case LANGUAGE.SP: {
            return SP_DATA;
            break;
         }
         case LANGUAGE.KR: {
            return KR_DATA;
            break;
         }
         case LANGUAGE.PO: {
            return PO_DATA;
            break;
         }
         case LANGUAGE.RU: {
            return RU_DATA;
            break;
         }
      }
   }

   static getLanguageIndex() {
      switch (this.language) {
         case LANGUAGE.EN:
            return 0
         case LANGUAGE.RU:
            return 1
      }
   }

   static getText(key: string) {
      let data = this.getLanguageData()

      if (cc.isValid(data[key])) {
         return data[key]
      } else if (cc.isValid(this.getLanguageData(LANGUAGE.EN)[key]))
         return this.getLanguageData(LANGUAGE.EN)[key]

      return null;
   }
}
const EN_DATA = {
   lb_shop: "Shop",
   lb_rank: "Ranking",
   lb_task: "Tasks",
   lb_wallet: "Wallet",
   lb_my_skin: "My Skins",
   lb_pvp: "PvP",
   lb_pvp_beta: "PvP (Beta)",
   lb_play_pve: "Play PvE",
   lb_custom_match: "Custom Match",
   lb_beta: "(Beta)",
   lb_pvp_played: "PvP Game Played",
   lb_pve_played: "PvE Game Played",
   lb_gold_chest: "Gold Chest Collected",
   lb_friend_invited: "Friend Invited",
   lb_your_reward: "Your Reward:",
   lb_your_total_affiliate: "Your Affiliate Reward:",
   lb_personal_link: "Your Personal Link:",
   lb_invite_friend: "Invited Friends",
   lb_vsnake: "$vSnake",
   lb_mouse: "$Mouse",
   lb_mask: "Mask",
   lb_skin: "Skin",
   lb_egg: "Egg",
   lb_bag: "Bag",
   lb_hatch: "Hatch",
   lb_claim: "Claim",
   lb_wallet_not_connected: "Wallet not connected",
   lb_coming_soon: "Coming Soon..",

   lb_rarity_common: "Common",
   lb_rarity_unique: "Unique",
   lb_rarity_rare: "Rare",
   lb_rarity_epic: "Epic",
   lb_rarity_mythical: "Mythical",
   lb_rarity_legendary: "Legendary",

   lb_my_skins_view: "My Skins View--",
   lb_skins: "Skins",
   lb_mask_view: "Mask",
   lb_skin_view: "Skin",

   lb_ranking_view: "RankingView--",
   lb_ranking: "Ranking",
   lb_daily: "Daily",
   lb_weekly: "Weekly",
   lb_monthly: "Monthly",
   lb_pve: "PvE",

   lb_tasks_view: "TasksView--",
   lb_tasks: "Tasks",
   lb_snake_ton_task: "SnakeTon task",
   lb_achievement: "Achievement",
   lb_login_to_game: "Login to Game",
   lb_invite_a_friend: "Invite a Friend",
   lb_retweet_x_post: "Retweet X post",
   lb_check_in_daily: "Check-in daily",
   lb_follow_our_x: "Follow our X",
   lb_join_channel: "Join our Channel",
   lb_purchase_mouse: "Purchase $MOUSE",

   lb_settings_view: "SettingView--",
   lb_settings: "Settings",
   lb_music: "Music",
   lb_sound: "Sound",
   lb_on: "On",
   lb_off: "Off",

   lb_multiple_login_view: "MultipleLoginView:",
   lb_multiple_login_warning: "Account is logged in on another device!",
   lb_leave: "Leave",

   lb_disconnected_view: "DisconnectedView--",
   lb_disconnected_message: "\"Please check your network and try again!\"",
   lb_retry: "Retry",

   lb_game_scene: "GameScene--",
   lb_setting_paused: "Setting: Paused!",
   lb_continue: "Continue",
   lb_back_to_lobby: "Back to Lobby",
   lb_spectate: "Spectate",

   lb_game_over_popup: "GameOverPopup--",
   lb_game_over: "GAME OVER!",

   lb_waiting_room_view: "WaitingRoomView---",
   lb_waiting_for_players: "Waiting for other players",
   lb_joined: "joined",
   lb_keep_waiting: "Keep waiting",
   lb_back_lobby: "Back to Lobby",
   friend_total_deposit: "Friend Total Deposit",
   claimable: "Claimable:",
   deposited_friend_list: "Deposited Friend List:",
   claimable_guide: "Min Claim Amount:",

   lb_withdraw: "Withdraw",
   lb_deposit: "Deposit",
   lb_history_pvp: "PvP History",
   lb_history_transaction: "Transactions History",

   transaction_withdraw: "Withdraw",
   transaction_deposit: "Deposit",
   transaction_pvp_win: "PvP Win",
   transaction_pvp_fee: "PvP Join Fee",

   continue: "Continue",
   processing: "Processing..",
   deposit_process_success: "Create Deposit success!",
   deposit_process_failed: "Create Deposit failed!",
   withdraw_process_success: "Create Withdraw success!",
   withdraw_process_failed: "Create Withdraw failed!",
   withdraw_multiple_request: "There's a Withdraw going on!",
   transaction_failed: "Transaction failed!",
   insufficient_fund: "Insufficient Funds!",
   withdraw_amount_too_low: "Amount too low!",
   something_wrong: "Who are you!?",
}

const RU_DATA = {
   lb_shop: "Магазин",
   lb_rank: "Рейтинг",
   lb_task: "Задания",
   lb_wallet: "кошелёк",
   lb_my_skin: "Мои Скины",
   lb_pvp: "PvP",
   lb_pvp_beta: "PvP (Бета)",
   lb_play_pve: "Играть PvE",
   lb_pvp_played: "Сыгранная игра PvP",
   lb_pve_played: "Сыгранная игра PvE",
   lb_custom_match: "Обычай",
   lb_beta: "(Бета)",
   lb_gold_chest: "Собранный Золотой Сундук",
   lb_friend_invited: "Друг Приглашен",
   lb_your_reward: "Ваша Награда",
   lb_your_total_affiliate: "Ваша партнерская награда:",
   lb_personal_link: "Ваша Личная Ссылка:",
   lb_invite_friend: "Приглашенные Друзья",
   lb_vsnake: "$vSnake",
   lb_mouse: "$Mouse",
   lb_mask: "Маска",
   lb_skin: "Скин",
   lb_egg: "Яйцо",
   lb_bag: "Сумка",
   lb_hatch: "Люк",
   lb_claim: "Требовать",
   lb_wallet_not_connected: "Кошелек не подключен",
   lb_coming_soon: "Скоро будет..",

   lb_rarity_common: "Обычный",
   lb_rarity_unique: "Уникальный",
   lb_rarity_rare: "Редкий",
   lb_rarity_epic: "Эпический",
   lb_rarity_mythical: "Мифический",
   lb_rarity_legendary: "Легендарный",

   lb_my_skins_view: "Просмотр Моих Скинов--",
   lb_skins: "Скины",
   lb_mask_view: "Маска",
   lb_skin_view: "Скин",

   lb_ranking_view: "Просмотр Рейтинга--",
   lb_ranking: "Рейтинг",
   lb_daily: "Ежедневно",
   lb_weekly: "Еженедельно",
   lb_monthly: "Ежемесячно",
   lb_pve: "PvE",

   lb_tasks_view: "Просмотр Заданий--",
   lb_tasks: "Задания",
   lb_snake_ton_task: "Задание SnakeTon",
   lb_achievement: "Достижение",
   lb_login_to_game: "Вход в Игру",
   lb_invite_a_friend: "Пригласить Друга",
   lb_retweet_x_post: "Ретвитнуть X пост",
   lb_check_in_daily: "Ежедневная Регистрация",
   lb_follow_our_x: "Подписаться на наш X",
   lb_join_channel: "Присоединяйтесь к нашему каналу",
   lb_purchase_mouse: "Покупка $MOUSE",

   lb_settings_view: "Просмотр Настроек--",
   lb_settings: "Настройки",
   lb_music: "Музыка",
   lb_sound: "Звук",
   lb_on: "Вкл",
   lb_off: "Выкл",

   lb_multiple_login_view: "Множественный Вход:",
   lb_multiple_login_warning: "Аккаунт уже используется на другом устройстве!",
   lb_leave: "Выйти",

   lb_disconnected_view: "Просмотр Отключения--",
   lb_disconnected_message: "\"Пожалуйста, проверьте ваше сетевое соединение и попробуйте снова!\"",
   lb_retry: "Повторить",

   lb_game_scene: "Игровая Сцена--",
   lb_setting_paused: "Настройки: Пауза!",
   lb_continue: "Продолжить",
   lb_back_to_lobby: "Вернуться в Лобби",
   lb_spectate: "Наблюдать",

   lb_game_over_popup: "Всплывающее Окно Окончания Игры--",
   lb_game_over: "ИГРА ОКОНЧЕНА!",

   lb_waiting_room_view: "Просмотр Комнаты Ожидания---",
   lb_waiting_for_players: "Ожидание других игроков",
   lb_joined: "присоединился",
   lb_keep_waiting: "Продолжать ожидание",
   lb_back_lobby: "Вернуться в Лобби",
   friend_total_deposit: "Общий депозит друга",
   claimable: "подлежащий выплате:",
   deposited_friend_list: "Список друзей, совершивших депозит:",
   claimable_guide: "Минимальная сумма для вывода:",
   affiliate_percentage: "Ваш процент партнёрских вознаграждений:",
}


const JP_DATA = {
   btn_setting: "設定",
   btn_shop: "お店",

}
const SP_DATA = {
   btn_setting: "Configuración",
   btn_shop: "Tienda",

}
const KR_DATA = {
   btn_setting: "설정",
   btn_shop: "상점",

}

const PO_DATA = {
   btn_setting: "Configurações",
   btn_shop: "Loja",

}
