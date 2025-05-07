
import React, { useEffect, useState } from "react";
import { Position } from "@/types/game";
import { COLORS, PARTICLE_COUNT, PARTICLE_LIFETIME } from "@/constants/gameConstants";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  lifetime: number;
  maxLifetime: number;
  color: string;
}

interface ParticleEffectProps {
  position: Position;
  isActive: boolean;
  type: "jump" | "collect" | "rewind" | "death";
  count?: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  position,
  isActive,
  type,
  count = PARTICLE_COUNT
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles when triggered
  useEffect(() => {
    if (!isActive) return;

    const newParticles: Particle[] = [];
    const baseColor = getColorForType(type);
    
    for (let i = 0; i < count; i++) {
      // Create a particle with random properties
      newParticles.push({
        id: Math.random(),
        x: position.x,
        y: position.y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2, // Bias upward
        size: Math.random() * 4 + 2,
        lifetime: PARTICLE_LIFETIME,
        maxLifetime: PARTICLE_LIFETIME,
        color: baseColor
      });
    }
    
    setParticles(prevParticles => [...prevParticles, ...newParticles]);

    // Cleanup function
    return () => {
      setParticles([]);
    };
  }, [position, isActive, type, count]);
  
  // Update particle positions and lifetimes
  useEffect(() => {
    if (particles.length === 0) return;
    
    const intervalId = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // Add gravity
            lifetime: p.lifetime - 1
          }))
          .filter(p => p.lifetime > 0)
      );
    }, 16); // ~60fps
    
    return () => clearInterval(intervalId);
  }, [particles.length]);
  
  // Get color based on particle type
  const getColorForType = (type: string): string => {
    switch (type) {
      case "jump": return COLORS.player;
      case "collect": return COLORS.energyOrb;
      case "rewind": return COLORS.playerRewind;
      case "death": return COLORS.enemy;
      default: return COLORS.player;
    }
  };
  
  // No particles to render
  if (particles.length === 0) return null;
  
  return (
    <>
      {particles.map(particle => {
        const opacity = (particle.lifetime / particle.maxLifetime) * 0.9;
        
        return (
          <div 
            key={`particle-${particle.id}`}
            className="absolute rounded-full" 
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              zIndex: 10
            }}
          />
        );
      })}
    </>
  );
};

export default ParticleEffect;
