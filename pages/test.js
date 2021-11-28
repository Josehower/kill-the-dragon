import { Html } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Myhtml(props) {
  return (
    <div className='content'>
      jose
      <button onClick={() => console.log('tesdt')}>clik</button>
    </div>
  );
}

function Dodecahedron({ time, ...props }) {
  const htmlRef = useRef();
  const number = useRef(0);

  useFrame(() => {
    htmlRef.current.firstChild.style.width = `${number.current % 100}px`;
    number.current += 1;
  });

  return (
    <mesh {...props}>
      <dodecahedronBufferGeometry />
      <meshStandardMaterial roughness={0.75} emissive='#404057' />
      <Html ref={htmlRef} distanceFactor={10}>
        <Myhtml />
      </Html>
    </mesh>
  );
}

function Content() {
  const ref = useRef();
  useFrame(
    () =>
      (ref.current.rotation.x =
        ref.current.rotation.y =
        ref.current.rotation.z +=
          0.01)
  );
  return (
    <group ref={ref}>
      <Dodecahedron position={[-2, 0, 0]} />
      <Dodecahedron position={[0, -2, -3]} />
      <Dodecahedron position={[2, 0, 0]} />
    </group>
  );
}

export default function Test() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7.5] }}>
      {console.log('render')}
      <pointLight color='indianred' />
      <pointLight position={[10, 10, -10]} color='orange' />
      <pointLight position={[-10, -10, 10]} color='lightblue' />
      <Content />
    </Canvas>
  );
}
