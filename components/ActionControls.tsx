import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { CombatAction } from '../database/actions';
import { Ally } from '../database/party';
import { getCombatAction } from '../utils/combat';
import { getRandomFromArray } from '../utils/miscelaneous';
import { ActionToPerform } from './Battle';
import { Foes, Persona } from './BattlePersona';
import { PlayerInventory } from './structures/DomBasedComponent';

type Props<T, O> = {
  setIsSelectingAction: Dispatch<SetStateAction<boolean>>;
  setActionArr: Dispatch<SetStateAction<ActionToPerform<Persona>[]>>;
  persona: T;
  foeOptions: Foes<T, O>;
  allyActionQueue?: number[];
  setAllyActionQueue?: Dispatch<SetStateAction<number[]>>;
  inventory?: [PlayerInventory, Dispatch<SetStateAction<PlayerInventory>>];
};

export default function ActionControls<T extends Persona, O extends Persona>({
  setIsSelectingAction,
  setActionArr,
  persona,
  foeOptions,
  allyActionQueue,
  setAllyActionQueue,
  inventory,
}: Props<T, O>) {
  const [selectedAction, setSelectedAction] = useState<CombatAction>();

  const setAction = useCallback(
    (action: CombatAction, foe: Persona) => {
      setActionArr((current) => [
        ...current,
        {
          action,
          performer: persona,
          foe: foe,
        },
      ]);
      setIsSelectingAction(false);
      if (setAllyActionQueue) {
        setAllyActionQueue((current) => current.filter((a, i) => i !== 0));
      }
    },
    [persona, setActionArr, setAllyActionQueue, setIsSelectingAction],
  );

  useEffect(() => {
    if (!persona.isAlly) {
      const action = getCombatAction(persona);

      if (action.isFlee) {
        setAction(action, persona);
        return;
      }

      const foe = action.isFriendly
        ? getRandomFromArray(foeOptions.friendly)
        : getRandomFromArray(foeOptions.unfriendly);

      setAction(action, foe);
    }
  }, [foeOptions.friendly, persona, foeOptions.unfriendly, setAction]);

  if (
    !persona.isAlly ||
    (allyActionQueue && allyActionQueue[0] !== persona.id)
  ) {
    return null;
  }

  return (
    <>
      {/* action selection */}
      {!selectedAction &&
        (persona as Ally).actions.map((action) => {
          return (
            <button
              key={'button-action-' + persona.id + action.id}
              onClick={() => {
                if (action.isFlee) {
                  setAction(action, persona);
                  return;
                }
                setSelectedAction(action);
              }}
            >
              {action.name}
            </button>
          );
        })}

      {!selectedAction &&
        inventory &&
        inventory[0].items.map(({ item, qty }) => (
          <button
            key={'button-item-action' + persona.id + item.id}
            onClick={() => {
              const itemAction = item.useItem(inventory);
              if (itemAction) setSelectedAction(itemAction);
            }}
          >
            {item.name} x {qty}
          </button>
        ))}

      {/* foe selection */}
      {selectedAction &&
        (selectedAction.isFriendly
          ? foeOptions.friendly.map((foe) => {
              return (
                <button
                  key={'button-foe-friend-' + persona.id + foe.id}
                  onClick={() => setAction(selectedAction, foe)}
                >
                  {foe.name}
                </button>
              );
            })
          : foeOptions.unfriendly.map((foe) => {
              return (
                <button
                  key={'button-foe-unfriend-' + persona.id + foe.id}
                  onClick={() => setAction(selectedAction, foe)}
                >
                  {foe.name}
                </button>
              );
            }))}
    </>
  );
}
