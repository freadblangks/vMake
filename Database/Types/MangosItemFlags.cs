﻿namespace vMake.Database.Types;

[Flags]
public enum MangosItemFlags
{
    ITEM_FLAG_RESERVED_0 = 0x00000001,
    ITEM_FLAG_CONJURED = 0x00000002,
    ITEM_FLAG_LOOTABLE = 0x00000004,
    ITEM_FLAG_WRAPPED = 0x00000008,
    ITEM_FLAG_DEPRECATED = 0x00000010,
    ITEM_FLAG_INDESTRUCTIBLE = 0x00000020,
    ITEM_FLAG_USABLE = 0x00000040,
    ITEM_FLAG_NO_EQUIP_COOLDOWN = 0x00000080,
    ITEM_FLAG_RESERVED_1 = 0x00000100,
    ITEM_FLAG_WRAPPER = 0x00000200,
    ITEM_FLAG_STACKABLE = 0x00000400,
    ITEM_FLAG_PARTY_LOOT = 0x00000800,
    ITEM_FLAG_RESEVERD_2 = 0x00001000,
    ITEM_FLAG_CHARTER = 0x00002000,
    ITEM_FLAG_LETTER = 0x00004000,
    ITEM_FLAG_PVP_REWARD = 0x00008000,
    ITEM_FLAG_UNK16 = 0x00010000,
    ITEM_FLAG_UNK17 = 0x00020000
}
