import { OrbitControls, useGLTF } from "@react-three/drei";

export default function Experience() {
  const computer = useGLTF("/models/macbook_model.gltf");

  return (
    <>
      <color args={["#241a1a"]} attach="background" />

      <OrbitControls makeDefault />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>

      <primitive object={computer.scene} />
    </>
  );
}
