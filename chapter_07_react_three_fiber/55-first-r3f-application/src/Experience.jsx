export default function Experience() {
  return (
    <>
      <mesh rotation-y={Math.PI * 0.25} position-x={2} scale={1.5}>
        {/* <torusKnotGeometry /> */}
        {/* <sphereGeometry args={[1.5, 32, 32]} /> */}
        <boxGeometry />
        {/* <meshNormalMaterial /> */}
        <meshBasicMaterial color="mediumpurple" wireframe />
      </mesh>
    </>
  );
}
