'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(8, 8, 12)
    camera.lookAt(0, 4, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Helper function to create pixel cubes
    const createCube = (x: number, y: number, z: number, color: number) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(x, y, z)
      cube.castShadow = true
      cube.receiveShadow = true
      return cube
    }

    // Create pixel boy group
    const boy = new THREE.Group()

    // Skin color
    const skinColor = 0xffdbac
    const hairColor = 0x8b4513
    const shirtColor = 0x4169e1
    const pantsColor = 0x2f4f4f
    const shoeColor = 0x1a1a1a
    const eyeColor = 0x000000

    // Head (3x3x3)
    for (let x = -1; x <= 1; x++) {
      for (let y = 0; y <= 2; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip corners for rounder head
          if (Math.abs(x) + Math.abs(z) <= 1.5) {
            boy.add(createCube(x, y + 6, z, skinColor))
          }
        }
      }
    }

    // Hair
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        if (Math.abs(x) + Math.abs(z) <= 1.5) {
          boy.add(createCube(x, 8, z, hairColor))
          if (x === 0 && z === 1) {
            boy.add(createCube(x, 7, z + 1, hairColor)) // Front hair
          }
        }
      }
    }

    // Eyes
    boy.add(createCube(-0.5, 7, 1, eyeColor))
    boy.add(createCube(0.5, 7, 1, eyeColor))

    // Body (2x3x2)
    for (let x = -1; x <= 1; x++) {
      for (let y = 0; y <= 2; y++) {
        for (let z = -0.5; z <= 0.5; z += 1) {
          if (Math.abs(x) <= 1) {
            boy.add(createCube(x, y + 3, z, shirtColor))
          }
        }
      }
    }

    // Arms
    // Left arm
    for (let y = 0; y <= 2; y++) {
      boy.add(createCube(-2, y + 5, 0, skinColor))
    }
    // Right arm
    for (let y = 0; y <= 2; y++) {
      boy.add(createCube(2, y + 5, 0, skinColor))
    }

    // Legs
    // Left leg
    for (let y = 0; y <= 2; y++) {
      boy.add(createCube(-0.5, y, 0, pantsColor))
    }
    // Right leg
    for (let y = 0; y <= 2; y++) {
      boy.add(createCube(0.5, y, 0, pantsColor))
    }

    // Shoes
    boy.add(createCube(-0.5, 0, 0.5, shoeColor))
    boy.add(createCube(0.5, 0, 0.5, shoeColor))

    scene.add(boy)

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20)
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.5
    ground.receiveShadow = true
    scene.add(ground)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Rotate the boy
      boy.rotation.y = Math.sin(time * 0.5) * 0.3

      // Gentle bounce
      boy.position.y = Math.abs(Math.sin(time)) * 0.3

      // Arm swing
      const leftArm = boy.children.find(
        (child) => child.position.x === -2 && child.position.y === 5
      )
      const rightArm = boy.children.find(
        (child) => child.position.x === 2 && child.position.y === 5
      )

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div ref={mountRef} />
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        3D Pixel Boy
      </div>
    </div>
  )
}
