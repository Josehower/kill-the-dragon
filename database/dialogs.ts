type PromptSection = {
  name: string;
  message: string;
};

export type GameDialog = {
  id: number;
  dialog: PromptSection[];
};

export const gameDialogs: GameDialog[] = [
  {
    id: 1,
    dialog: [
      { name: 'Cortana', message: 'Hi i am Cortana' },
      { name: 'Cortana', message: 'How are you doing today' },
      { name: 'Cortana', message: 'Have a nice one' },
    ],
  },
  {
    id: 2,
    dialog: [
      { name: 'Heggart', message: 'Hi i am Heggart' },
      {
        name: 'Heggart',
        message:
          'Do you know the creator of this game play magic the gathering?',
      },
      { name: 'Heggart', message: 'now you know it!' },
    ],
  },
];
