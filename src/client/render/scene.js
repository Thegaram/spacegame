import renderLoadScreen from './load';
import renderShip from './ship';
import renderProjectile from './projectile';
import renderCrosshair from './crosshair';
import renderSpace from './space';
import renderMap from './map';

export default (ctx, scene, decorations, particles, viewport) => {
  ctx.save();
  ctx.clearRect(0, 0, 1000, 500);
  ctx.translate(500.5, 250.5);
  if (!scene) {
    renderLoadScreen(ctx);
    ctx.restore();
    return;
  }
  ctx.scale(1, -1);
  ctx.rotate(-viewport.orientation);
  ctx.scale(viewport.scale, viewport.scale);
  ctx.translate(-viewport.position.x, -viewport.position.y);

  renderSpace(ctx, viewport, particles);

  for (const ship of scene.ships) {
    renderShip(ctx, ship, viewport);
  }

  for (const projectile of scene.projectiles) {
    renderProjectile(ctx, projectile);
  }

  for (const decoration of decorations) {
    if (scene.time > decoration.time + 5000) {
      continue;
    }
    const progress = (scene.time - decoration.time) / 5000;
    ctx.save();
    ctx.fillStyle = `rgba(255, 0, 0, ${0.5 - progress / 2})`;
    ctx.translate(decoration.position.x, decoration.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, progress * 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (!viewport.alive) {
    ctx.save();
    ctx.font = '72px Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.baseLine = 'middle';
    ctx.scale(1, -1);
    ctx.fillText('You\'re dead!  ͡° ͜ʖ ͡°', 0, 0);
    ctx.restore();
  } else {
    renderCrosshair(ctx, viewport);
    renderMap(ctx, scene, viewport);
  }
  ctx.restore();
};
