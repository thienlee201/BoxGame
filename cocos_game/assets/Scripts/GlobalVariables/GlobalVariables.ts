export class GlobalVar {
   public static avatarUpdated: boolean = false;
   public static playerName = ""
   public static walletAddress = ""
   public static playerUUID: string = ''
   public static clientSession: string = ''
   public static readableWalletAddress = ''
   public static playerTelegramId: string = ''
   public static playerTelegramUsername: string = ''
   public static playerAvatar: string = ''
}

export class GlobalVariables {
   public static lastGameScore: number = 0;
   public static isTestWin: boolean = false;
   static readonly GAME_NAME: string = 'Pocket-Champion'
   
   public static coatInfo = {
       "offensive": [ 
               [ [ 280, 398 ], [ 187, 255 ], [ 374, 255 ], [ 89, 147 ], [ 280, 147 ], [ 471, 147 ] ],
               [ [ 280, 398 ], [ 182, 261 ], [ 378, 261 ], [ 280, 186 ], [ 182, 114 ], [ 378, 114 ] ],
               [ [ 280, 398 ], [ 115, 222 ], [ 280, 255 ], [ 445, 222 ], [ 195, 130 ], [ 365, 130 ] ],
               [ [ 280, 398 ], [ 169, 235 ], [ 391, 235 ], [ 106, 186 ], [ 454, 186 ], [ 280, 143 ] ],
               [ [ 280, 398 ], [ 189, 195 ], [ 371, 195 ], [ 106, 106 ], [ 454, 106 ], [ 280, 275 ] ]
           ],
       "defensive": [ 
               [ [ 280, 398 ], [ 89, 255 ], [ 280, 255 ], [ 471, 255 ], [ 187, 147 ], [ 374, 147 ] ],
               [ [ 280, 398 ], [ 187, 317 ], [ 374, 317 ], [ 280, 245 ], [ 187, 173 ], [ 374, 173 ] ],
               [ [ 280, 398 ], [ 105, 357 ], [ 455, 357 ], [ 280, 305 ], [ 187, 173 ], [ 374, 173 ] ],
               [ [ 280, 398 ], [ 185, 317 ], [ 375, 317 ], [ 280, 245 ], [ 137, 237 ], [ 414, 237 ] ],
               [ [ 280, 398 ], [ 209, 353 ], [ 351, 353 ], [ 155, 310 ], [ 405, 310 ], [ 280, 173 ] ]
           ]
   }
}
