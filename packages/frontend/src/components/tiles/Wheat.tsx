/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 wheat.glb --types -k --shadows --transform
Files: wheat.glb [12.6KB] > /Users/andrea/Documents/models/wheat-transformed.glb [3.39KB] (73%)
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    ground002: THREE.Mesh;
    ground002_1: THREE.Mesh;
    grain: THREE.Mesh;
  };
  materials: {
    grass: THREE.MeshStandardMaterial;
    dirt: THREE.MeshStandardMaterial;
    sand: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function Wheat3DTile(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/wheat-transformed.glb'
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        name="grain"
        castShadow
        receiveShadow
        geometry={nodes.grain.geometry}
        material={materials.sand}
        position={[0.05, 0.2, 0.087]}
        rotation={[0, -Math.PI / 3, 0]}
      />
      <mesh
        name="ground002"
        castShadow
        receiveShadow
        geometry={nodes.ground002.geometry}
        material={materials.grass}
      />
      <mesh
        name="ground002_1"
        castShadow
        receiveShadow
        geometry={nodes.ground002_1.geometry}
        material={materials.dirt}
      />
    </group>
  );
}

useGLTF.preload('/models/wheat-transformed.glb');
