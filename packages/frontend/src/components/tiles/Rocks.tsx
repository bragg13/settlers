/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 rocks.glb --types -k --shadows --transform
Files: rocks.glb [24.98KB] > /Users/andrea/Documents/models/rocks-transformed.glb [3.16KB] (87%)
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Mesh_stone_rocks: THREE.Mesh;
    Mesh_stone_rocks_1: THREE.Mesh;
  };
  materials: {
    dirt: THREE.MeshStandardMaterial;
    stone: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function Rocks3DTile(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/rocks-transformed.glb'
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        name="Mesh_stone_rocks"
        castShadow
        receiveShadow
        geometry={nodes.Mesh_stone_rocks.geometry}
        material={materials.dirt}
      />
      <mesh
        name="Mesh_stone_rocks_1"
        castShadow
        receiveShadow
        geometry={nodes.Mesh_stone_rocks_1.geometry}
        material={materials.stone}
      />
    </group>
  );
}

useGLTF.preload('/models/rocks-transformed.glb');
