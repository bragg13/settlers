/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 num_10.glb --types -k --shadows --transform
Files: num_10.glb [156.69KB] > /Users/andrea/Desktop/settlers/packages/frontend/public/models/numbers/num_10-transformed.glb [19.32KB] (88%)
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Text007: THREE.Mesh;
    Text008: THREE.Mesh;
  };
  materials: {
    ['materiale.008']: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/numbers/num_10.glb'
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        name="Text007"
        castShadow
        receiveShadow
        geometry={nodes.Text007.geometry}
        material={nodes.Text007.material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        name="Text008"
        castShadow
        receiveShadow
        geometry={nodes.Text008.geometry}
        material={materials['materiale.008']}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('/models/numbers/num_10.glb');
