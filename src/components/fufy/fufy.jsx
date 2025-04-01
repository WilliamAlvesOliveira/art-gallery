import React, { useState, useEffect, useRef } from "react";
import "./fufy.css";

const importImages = async () => {
  const imageModules = import.meta.glob("./fufyimages/*.{png,jpg,jpeg,gif,svg}");
  const imagePromises = Object.keys(imageModules).map(async (path) => {
    const module = await imageModules[path]();
    return module.default;
  });
  return Promise.all(imagePromises);
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

class GlitterParticle {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.reset();
    this.size = Math.random() * 3 + 1;
    this.phase = Math.random() > 0.5 ? 0 : 0.5;
  }

  reset() {
    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height;
    this.opacity = 0;
    this.targetOpacity = Math.random() * 0.8 + 0.2;
    this.speed = Math.random() * 0.02 + 0.01;
    this.isStar = Math.random() > 0.7;
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
  }

  update() {
    this.phase += this.speed;
    if (this.phase >= 1) this.phase = 0;

    if (this.phase < 0.5) {
      this.opacity = Math.sin(this.phase * Math.PI) * this.targetOpacity;
    } else {
      this.opacity = Math.sin((1 - this.phase) * Math.PI) * this.targetOpacity;
    }

    if (this.isStar) {
      this.angle += this.rotationSpeed;
    }

    if (this.opacity < 0.1 && Math.random() > 0.99) {
      this.reset();
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = "#ffffff";

    if (this.isStar) {
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.angle);
      this.drawStar(0, 0, this.size * 0.7, this.size * 1.4, 5);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

const Fufy = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [positions] = useState({
    background: shuffleArray([
      { row: Math.floor(Math.random() * 5) + 1, col: 1 },
      { row: Math.floor(Math.random() * 5) + 1, col: 5 },
      { row: 1, col: Math.floor(Math.random() * 5) + 1 }
    ]),
    middle: shuffleArray([
      { row: Math.floor(Math.random() * 3) + 2, col: 2 },
      { row: Math.floor(Math.random() * 3) + 2, col: 4 },
      { row: Math.floor(Math.random() * 3) + 2, col: 2 }
    ]),
    foreground: [{ row: 3, col: 3 }]
  });

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    importImages().then((urls) => {
      setImageUrls(shuffleArray(urls));
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: 50 }, () => 
          new GlitterParticle(ctx, canvas.width, canvas.height)
        );
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isActive) {
        particlesRef.current.forEach(particle => {
          particle.update();
          particle.draw();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  const handleActivate = () => {
    setIsActive(true);
    if (particlesRef.current.length > 0) {
      particlesRef.current.forEach((p, i) => {
        if (i % 5 === 0) p.reset();
      });
    }
  };

  const handleDeactivate = () => {
    setIsActive(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const relX = x - centerX;
    const relY = y - centerY;
    
    const rotateY = (relX / centerX) * 20;
    const rotateX = (relY / centerY) * -20;
    
    setRotation({ x: rotateX, y: rotateY });

    if (isActive && particlesRef.current.length > 0) {
      particlesRef.current.forEach(p => {
        const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
        if (dist < 100 && Math.random() > 0.8) {
          p.phase += 0.05;
        }
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0]);
    }
  };

  return (
    <section id="fufy">
      <div 
        ref={containerRef}
        className="component3d"
        onMouseEnter={handleActivate}
        onMouseLeave={handleDeactivate}
        onMouseMove={handleMove}
        onTouchStart={handleActivate}
        onTouchEnd={handleDeactivate}
        onTouchMove={handleTouchMove}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isActive ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
        }}
      >
        {imageUrls.slice(0, 7).map((url, index) => {
          let position, layerClass;
          
          if (index < 3) {
            position = positions.background[index];
            layerClass = "layer background";
          } else if (index < 6) {
            position = positions.middle[index - 3];
            layerClass = "layer middle";
          } else {
            position = positions.foreground[0];
            layerClass = "layer foreground";
          }

          return (
            <img
              key={index}
              src={url}
              alt={`Imagem ${index}`}
              className={`${layerClass} ${isActive ? "active" : ""}`}
              style={{
                gridRow: position.row,
                gridColumn: position.col,
              }}
            />
          );
        })}
        <canvas 
          ref={canvasRef} 
          className="glitter-canvas" 
          style={{ opacity: isActive ? 1 : 0 }}
        />
      </div>
    </section>
  );
};

export default Fufy;