export const games = [
  // Add games in this format:
  // {
  //   slug: 'example-game',
  //   game: 'mario',
  //   title: 'Example Game',
  //   core: 'gba',
  //   platform: 'Game Boy Advance',
  //   description: 'Short game description',
  //   // Set ROM_MARIO in your environment variables to the OneDrive share link.
  // },
  {
    slug: 'loz-mc',
    game: 'loz-minish-cap',
    title: 'Legend of Zelda: Minish Cap',
    core: 'gba',
    platform: 'Game Boy Advance',
    description: 'The Legend of Zelda: The Minish Cap (GBA, 2004/2005) follows Link, aided by the talking cap Ezlo, to save Hyrule and Princess Zelda from the sorcerer Vaati.',
  },
  {
    slug: 'kirby-nidl',
    game: 'kirby-nightmare-in-dreamland',
    title: "Kirby's Nightmare in Dream Land",
    core: 'gba',
    platform: 'Game Boy Advance',
    description: "Kirby's Nightmare in Dream Land (GBA, 2002) is a remake of the original Kirby's Adventure. Join Kirby as he battles Nightmare to save Dream Land, with new features and enhanced graphics.",
  }
];

export function getGameBySlug(slug) {
  return games.find((game) => game.slug === slug) ?? null;
}
