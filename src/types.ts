export type DrashaLength = 'Short (~5 minutes)' | 'Medium (~10 minutes)' | 'Long (~15 minutes)';
export const drashaLengths: DrashaLength[] = ['Short (~5 minutes)', 'Medium (~10 minutes)', 'Long (~15 minutes)'];

export const CUSTOM_RABBI_STYLE = 'Other (Specify below)';

const famousRabbis = [
  'Rabbi Lord Jonathan Sacks',
  'Rabbi Joseph B. Soloveitchik',
  'The Lubavitcher Rebbe',
  'Rabbi Shlomo Carlebach',
  'Rabbi Abraham Isaac Kook',
  'Rabbi Samson Raphael Hirsch',
  'Rabbi Farhi',
  'Rashi',
  'Rambam (Maimonides)',
  'Ramban (Nachmanides)',
  'Sforno',
  CUSTOM_RABBI_STYLE,
] as const;

export type RabbinicStyle = (typeof famousRabbis)[number];
export const rabbinicStyles: RabbinicStyle[] = [...famousRabbis];

export const torahPortionsAndHolidays = [
  {
    label: "Bereishit",
    options: ["Bereishit", "Noach", "Lech-Lecha", "Vayera", "Chayei Sarah", "Toldot", "Vayetzei", "Vayishlach", "Vayeshev", "Miketz", "Vayigash", "Vayechi"],
  },
  {
    label: "Shemot",
    options: ["Shemot", "Va'eira", "Bo", "Beshalach", "Yitro", "Mishpatim", "Terumah", "Tetzaveh", "Ki Tisa", "Vayakhel", "Pekudei"],
  },
  {
    label: "Vayikra",
    options: ["Vayikra", "Tzav", "Shemini", "Tazria", "Metzora", "Acharei Mot", "Kedoshim", "Emor", "Behar", "Bechukotai"],
  },
  {
    label: "Bamidbar",
    options: ["Bamidbar", "Nasso", "Beha'alotcha", "Sh'lach", "Korach", "Chukat", "Balak", "Pinchas", "Matot", "Masei"],
  },
  {
    label: "Devarim",
    options: ["Devarim", "Va'etchanan", "Eikev", "Re'eh", "Shoftim", "Ki Teitzei", "Ki Tavo", "Nitzavim", "Vayelech", "Ha'azinu", "V'Zot HaBerachah"],
  },
  {
    label: "Chaggim",
    options: ["Rosh Hashanah", "Yom Kippur", "Sukkot", "Shemini Atzeret/Simchat Torah", "Pesach", "Shavuot", "Yom HaShoah", "Yom HaZikaron", "Yom HaAtzmaut"],
  },
] as const;

// This creates a union type of all possible Torah portions and holidays from the nested structure
type TorahPortionsAndHolidays = typeof torahPortionsAndHolidays;
type OptionsOf<T> = T extends { readonly options: readonly (infer U)[] } ? U : never;
export type TorahPortion = OptionsOf<TorahPortionsAndHolidays[number]>;
