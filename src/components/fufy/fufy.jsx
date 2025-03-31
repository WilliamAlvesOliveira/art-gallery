import React, { useEffect } from "react";
import "./fufy.css";
import abelinha from "./fufyimages/abelinha.png";

const Fufy = () => {
  useEffect(() => {
    // Seleciona os elementos essenciais
    const container = document.getElementById("container-3d");
    const layers = document.querySelectorAll(".camada");
    const canvas = document.getElementById("glitter-canvas");
    let ctx;
    if (canvas) {
      ctx = canvas.getContext("2d");
      canvas.width = 1000;
      canvas.height = 700;
    }

    // Função auxiliar para desenhar uma estrela de 5 pontas
    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        const xOuter = cx + Math.cos(rot) * outerRadius;
        const yOuter = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(xOuter, yOuter);
        rot += step;
        const xInner = cx + Math.cos(rot) * innerRadius;
        const yInner = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(xInner, yInner);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    }

    // Constantes de deslocamento (em radianos) para os três grupos:
    // Grupo 1: sem deslocamento; Grupo 2: 120°; Grupo 3: 240°
    const GROUP1_OFFSET = 0;
    const GROUP2_OFFSET = (2 * Math.PI) / 3;
    const GROUP3_OFFSET = (4 * Math.PI) / 3;

    // Arrays que armazenarão as partículas de cada grupo
    const group1Particles = [];
    const group2Particles = [];
    const group3Particles = [];

    // Classe que define cada partícula de glitter
    // O segundo parâmetro "alwaysStar" faz com que, para o grupo 2, a partícula
    // seja sempre uma estrela, realçando o efeito de rotação.
    class GlitterParticle {
      constructor(groupOffset, alwaysStar = false, initialPhase = 0) {
        this.groupOffset = groupOffset;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Tamanho entre 1 e 3
        this.phase = initialPhase; // Para sincronizar o grupo, usamos 0
        // Frequência determina a velocidade do ciclo – experimente ajustar se necessário
        this.frequency = Math.random() * 0.002 + 0.005;
        this.isCircle = alwaysStar ? false : Math.random() < 0.5;
      }
      update(deltaTime) {
        // Atualiza a fase com base no tempo decorrido
        this.phase += this.frequency * deltaTime;
        if (this.phase >= 2 * Math.PI) {
          this.phase -= 2 * Math.PI;
          // A cada ciclo completo, reposiciona a partícula para um novo local aleatório
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }
      draw(ctx) {
        // A fase efetiva combina a fase interna com o deslocamento do grupo
        const effectivePhase = this.phase + this.groupOffset;
        // Calcula a opacidade oscilante entre 0 e 1
        const alpha = 0.5 + 0.5 * Math.sin(effectivePhase);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "white";
        if (this.isCircle) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Para o grupo 2, aplicamos rotação para realçar o efeito (grupoOffset === GROUP2_OFFSET)
          if (this.groupOffset === GROUP2_OFFSET) {
            ctx.translate(this.x, this.y);
            ctx.rotate(effectivePhase);
            drawStar(ctx, 0, 0, 5, this.size * 2, this.size);
          } else {
            drawStar(ctx, this.x, this.y, 5, this.size * 2, this.size);
          }
        }
        ctx.restore();
      }
    }

    // Inicializa as partículas para cada um dos três grupos
    function initializeParticles() {
      group1Particles.length = 0;
      group2Particles.length = 0;
      group3Particles.length = 0;
      const count = 20; // Número de partículas por grupo (ajuste conforme necessário)
      for (let i = 0; i < count; i++) {
        // Grupo 1: partículas com comportamento padrão (círculo ou estrela)
        group1Particles.push(new GlitterParticle(GROUP1_OFFSET, false, 0));
        // Grupo 2: partículas sempre do tipo estrela para evidenciar a rotação
        group2Particles.push(new GlitterParticle(GROUP2_OFFSET, true, 0));
        // Grupo 3: partículas padrão (círculo ou estrela)
        group3Particles.push(new GlitterParticle(GROUP3_OFFSET, false, 0));
      }
    }

    let glitterActive = false;
    let animationFrameId;
    let lastTime = null;

    // Loop de animação usando requestAnimationFrame para fluidez
    function animateGlitter(now) {
      if (!glitterActive) return;
      if (lastTime === null) lastTime = now;
      const deltaTime = now - lastTime;
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Atualiza e desenha cada grupo de partículas
      group1Particles.forEach((particle) => {
        particle.update(deltaTime);
        particle.draw(ctx);
      });
      group2Particles.forEach((particle) => {
        particle.update(deltaTime);
        particle.draw(ctx);
      });
      group3Particles.forEach((particle) => {
        particle.update(deltaTime);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animateGlitter);
    }

    function startGlitter() {
      if (!ctx) return;
      initializeParticles();
      glitterActive = true;
      lastTime = null;
      animationFrameId = requestAnimationFrame(animateGlitter);
    }

    function stopGlitter() {
      glitterActive = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Funções para manipular a rotação do container 3D
    function handleMove(x, y, width, height) {
      const relativeX = x - width / 2;
      const relativeY = y - height / 2;
      const rotateX = (relativeY / height) * 15;
      const rotateY = (relativeX / width) * -15;
      container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    function handleMouseMove(e) {
      const { left, top, width, height } = container.getBoundingClientRect();
      handleMove(e.clientX - left, e.clientY - top, width, height);
    }
    function handleTouchMove(e) {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { left, top, width, height } = container.getBoundingClientRect();
        handleMove(touch.clientX - left, touch.clientY - top, width, height);
      }
    }
    function handleEnter() {
      container.classList.add("active-3d");
      layers[0].classList.add("back");
      layers[1].classList.add("mid");
      layers[2].classList.add("front");
      startGlitter();
    }
    function handleLeave() {
      container.classList.remove("active-3d");
      container.style.transform = "rotateX(0deg) rotateY(0deg)";
      layers[0].classList.remove("back");
      layers[1].classList.remove("mid");
      layers[2].classList.remove("front");
      stopGlitter();
    }
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("mouseenter", handleEnter);
      container.addEventListener("mouseleave", handleLeave);
      container.addEventListener("touchstart", handleEnter);
      container.addEventListener("touchend", handleLeave);
    }

    // Cleanup: remove os event listeners e interrompe a animação quando o componente for desmontado
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("mouseenter", handleEnter);
        container.removeEventListener("mouseleave", handleLeave);
        container.removeEventListener("touchstart", handleEnter);
        container.removeEventListener("touchend", handleLeave);
      }
      stopGlitter();
    };
  }, []);

  return (
    <section id="fufy">
      <div id="container-3d" className="container-3d">
        <div className="camada">
          <img className="img1" src={abelinha} alt="Abelha camada 1" />
        </div>
        <div className="camada">
          <img className="img2" src={abelinha} alt="Abelha camada 2" />
        </div>
        <div className="camada">
          <img className="img3" src={abelinha} alt="Abelha camada 3" />
        </div>
        <canvas id="glitter-canvas" className="glitter"></canvas>
      </div>
    </section>
  );
};

export default Fufy;