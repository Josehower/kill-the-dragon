import BattleControl from '../components/BattleControl';
import Menu from '../components/Menu';
import Store from '../components/Store';

export default function Home() {
  return (
    <>
      <hr />
      <hr />
      <h2>Menu</h2>
      <Store />
      <Menu />

      <h2>Go to Combat</h2>
      <BattleControl />
    </>
  );
}
