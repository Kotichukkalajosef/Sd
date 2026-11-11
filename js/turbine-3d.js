/**
 * SD ENTERPRISES - 3D Turbomachinery Suite
 * Powered by Three.js (r128)
 *
 * Contains 2 High-Fidelity 3D Engines:
 * 1. HERO ROTOR 3D ENGINE (#gl, .scene-card):
 *    - High-detail gap-free solid forged rotor shaft with integral discs
 *    - All 8 stages with 44-72 precision blades per stage (instanced meshes)
 *    - 8 stationary diaphragms with 240 nozzle guide vanes
 *    - Coupling flange with 8 high-tensile bolts, labyrinth seal rings, bearing pedestals, and lower casing
 *    - 360° drag rotation and mouse responsiveness
 *
 * 2. COMPLETE TURBINE & GENERATOR ASSEMBLY BAY (#stg-canvas, #stg-stage-wrapper):
 *    - Full horizontal power train: HP Turbine, IP Turbine, LP1 Turbine, LP2 Turbine,
 *      Overhead Crossover Steam Piping, Generator, and Exciter
 *    - 3D Disassembly & Exploded View animation with ease-out timing
 *    - Interactive 3D SVG Leader Lines with numbered badge markers
 *    - Module selector: HP, IP, LP1, LP2, Crossover, Generator
 *    - Outage QA checklist & component inspection panel
 *    - 9-step Outage & Overhaul sequence guide
 *    - 360° drag orbit, auto-spin toggle, zoom buttons (+/−)
 */

/* ==========================================================================
   ENGINE 1: HERO ROTOR 3D (Fixed Background / Card Projection)
   ========================================================================== */
(function () {
  'use strict';

  var W = window, D = document;
  var canvas = D.getElementById('gl');
  var heroCard = D.querySelector('.scene-card');
  var metricsSection = D.querySelector('.metrics-strip');

  if (!canvas || !heroCard || !W.THREE) return;

  var THREE = W.THREE;
  var rm = W.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'default'
    });
  } catch (e) {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false
    });
  }
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(W.devicePixelRatio || 1, 1.25));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, W.innerWidth / W.innerHeight, 0.1, 100);
  camera.position.z = 12;

  // Lighting
  scene.add(new THREE.AmbientLight(0x8fb4de, 0.9));

  var keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(0x4aa3ff, 1.8);
  rimLight.position.set(-6, 3, -5);
  scene.add(rimLight);

  var goldLight = new THREE.PointLight(0xF5B94A, 3.0, 30);
  goldLight.position.set(-4, -2, 5);
  scene.add(goldLight);

  // Materials
  var metalMat = new THREE.MeshStandardMaterial({ color: 0xcfd9e4, metalness: 0.7, roughness: 0.33 });
  var darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x3a5f86, metalness: 0.8, roughness: 0.4 });
  var goldMat = new THREE.MeshStandardMaterial({ color: 0xF5B94A, metalness: 0.8, roughness: 0.28, emissive: 0x3a2600 });
  var brightSteelMat = new THREE.MeshStandardMaterial({ color: 0xeef3f8, metalness: 0.9, roughness: 0.18 });
  var diaphragmMat = new THREE.MeshStandardMaterial({
    color: 0x2f6fa8,
    metalness: 0.6,
    roughness: 0.5,
    transparent: true,
    opacity: 0.78,
    side: THREE.DoubleSide
  });

  var masterGroup = new THREE.Group();
  var rotorGroup = new THREE.Group();
  var stages = [];
  var diaphragms = [];

  scene.add(masterGroup);
  masterGroup.add(rotorGroup);

  function makeCyl(r, len, x, mat, parent) {
    var geom = new THREE.CylinderGeometry(r, r, len, 40);
    var m = new THREE.Mesh(geom, mat);
    m.rotation.z = Math.PI / 2;
    m.position.x = x;
    (parent || rotorGroup).add(m);
    return m;
  }

  function makeTorus(r, t, x, mat, parent) {
    var geom = new THREE.TorusGeometry(r, t, 8, 64);
    var m = new THREE.Mesh(geom, mat);
    m.rotation.y = Math.PI / 2;
    m.position.x = x;
    (parent || rotorGroup).add(m);
    return m;
  }

  // 1. Continuous Gap-Free Rotor Shaft
  makeCyl(0.42, 6.9, 0, metalMat);
  makeCyl(0.34, 0.4, -3.65, darkSteelMat);
  makeCyl(0.34, 0.4, 3.65, darkSteelMat);
  makeCyl(0.27, 0.7, -4.15, brightSteelMat);
  makeCyl(0.27, 0.7, 4.15, brightSteelMat);
  makeCyl(0.30, 0.45, -4.60, metalMat); // Continuous shoulder
  makeCyl(0.82, 0.16, -4.85, metalMat); // Coupling flange
  makeCyl(0.62, 0.10, -3.30, metalMat); // Thrust collar

  // 8 High-Tensile Coupling Bolts
  for (var k = 0; k < 8; k++) {
    var bolt = makeCyl(0.06, 0.34, -4.85, brightSteelMat);
    var angle = (k / 8) * Math.PI * 2;
    bolt.position.y = Math.cos(angle) * 0.62;
    bolt.position.z = Math.sin(angle) * 0.62;
  }

  // Labyrinth Oil Baffle Rings
  [-3.25, -3.10, 3.10, 3.25].forEach(function (x) {
    makeTorus(0.46, 0.03, x, metalMat);
  });

  // Diaphragm Lathe Ring Template
  var rin = 0.50, rout = 1.95;
  var pts = [
    new THREE.Vector2(rin, -0.09),
    new THREE.Vector2(rout, -0.09),
    new THREE.Vector2(rout, 0.09),
    new THREE.Vector2(rin, 0.09),
    new THREE.Vector2(rin, -0.09)
  ];
  var diaGeom = new THREE.LatheGeometry(pts, 48, Math.PI, Math.PI);
  var dummyObj = new THREE.Object3D();

  // 8 Turbine Stages with Blading & Guide Vanes
  for (var i = 0; i < 8; i++) {
    var stageGrp = new THREE.Group();
    var mat = (i === 5) ? goldMat : metalMat;
    var baseR = 0.72 + i * 0.07;
    var bLen = 0.22 + i * 0.04;
    var numBlades = 44 + i * 4;
    var posX = -2.55 + i * 0.73;

    stageGrp.userData.origX = posX;
    stageGrp.position.x = posX;

    makeCyl(baseR, 0.10, 0, mat, stageGrp);
    makeCyl(0.56, 0.26, 0, mat, stageGrp);

    var bladeMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.20, bLen, 0.03), mat, numBlades);
    for (var j = 0; j < numBlades; j++) {
      var bAngle = (j / numBlades) * Math.PI * 2;
      var rad = baseR + bLen / 2 - 0.02;
      dummyObj.position.set(0, Math.cos(bAngle) * rad, Math.sin(bAngle) * rad);
      dummyObj.rotation.set(bAngle, 0.55, 0);
      dummyObj.updateMatrix();
      bladeMesh.setMatrixAt(j, dummyObj.matrix);
    }
    stageGrp.add(bladeMesh);

    var shroudRing = new THREE.Mesh(new THREE.TorusGeometry(baseR + bLen, 0.02, 8, 72), mat);
    shroudRing.rotation.y = Math.PI / 2;
    stageGrp.add(shroudRing);

    rotorGroup.add(stageGrp);
    stages.push(stageGrp);

    // Diaphragm with Stationary Guide Vanes
    var diaGrp = new THREE.Group();
    var diaX = -2.55 + (i - 0.5) * 0.73;
    diaGrp.userData.origX = diaX;
    diaGrp.position.x = diaX;

    var diaHalf = new THREE.Mesh(diaGeom, diaphragmMat);
    diaHalf.rotation.z = Math.PI / 2;
    diaGrp.add(diaHalf);

    var vaneMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.30, 0.025), brightSteelMat, 30);
    for (var v = 0; v < 30; v++) {
      var vAngle = Math.PI / 2 + (v / 29) * Math.PI;
      var vRad = baseR + 0.12;
      dummyObj.position.set(0, Math.cos(vAngle) * vRad, Math.sin(vAngle) * vRad);
      dummyObj.rotation.set(vAngle, -0.55, 0);
      dummyObj.updateMatrix();
      vaneMesh.setMatrixAt(v, dummyObj.matrix);
    }
    diaGrp.add(vaneMesh);
    masterGroup.add(diaGrp);
    diaphragms.push(diaGrp);
  }

  // Lower Transparent Casing & Pedestals
  var casingGeom = new THREE.CylinderGeometry(2.05, 2.05, 7.6, 40, 1, true, Math.PI, Math.PI);
  var casingMesh = new THREE.Mesh(
    casingGeom,
    new THREE.MeshStandardMaterial({ color: 0x1d5a8e, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
  );
  casingMesh.rotation.z = Math.PI / 2;
  masterGroup.add(casingMesh);

  var casingWire = new THREE.Mesh(
    casingGeom,
    new THREE.MeshBasicMaterial({ color: 0x7fb4e6, wireframe: true, transparent: true, opacity: 0.22 })
  );
  casingWire.rotation.z = Math.PI / 2;
  masterGroup.add(casingWire);

  [-1, 1].forEach(function (s) {
    var flange = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.05, 0.16), darkSteelMat);
    flange.position.z = s * 2.05;
    masterGroup.add(flange);
  });

  [-4.15, 4.15].forEach(function (bx) {
    var bearingHalf = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 24, 1, false, Math.PI, Math.PI), darkSteelMat);
    bearingHalf.rotation.z = Math.PI / 2;
    bearingHalf.position.x = bx;
    masterGroup.add(bearingHalf);

    var pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 1.2), darkSteelMat);
    pedestal.position.set(bx, -0.8, 0);
    masterGroup.add(pedestal);
  });

  // Interaction State
  var mx = 0, my = 0;
  var px = -9999, py = -9999;
  var yaw = -0.55, pitch = 0.28;
  var isHovered = false;
  var u0 = 0, yaw0 = 0;
  var lastTime = performance.now();

  W.addEventListener('pointermove', function (e) {
    px = e.clientX;
    py = e.clientY;
    mx = px / W.innerWidth - 0.5;
    my = py / W.innerHeight - 0.5;
  }, { passive: true });

  var cachedCardRect = heroCard.getBoundingClientRect();

  function updateCardRect() {
    cachedCardRect = heroCard.getBoundingClientRect();
  }
  W.addEventListener('scroll', updateCardRect, { passive: true });

  function onResize() {
    renderer.setSize(W.innerWidth, W.innerHeight, false);
    camera.aspect = W.innerWidth / W.innerHeight;
    camera.updateProjectionMatrix();
    updateCardRect();
  }
  W.addEventListener('resize', onResize);
  onResize();

  function ease(x) { return x * x * (3 - 2 * x); }

  function renderLoop(now) {
    var dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    var scrollY = W.scrollY || W.pageYOffset || 0;
    var vh = W.innerHeight;
    var cardRect = cachedCardRect;

    var isHeroVisible = cardRect && cardRect.bottom > -50 && cardRect.top < vh + 50 && scrollY < vh * 1.5;

    if (!isHeroVisible) {
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      requestAnimationFrame(renderLoop);
      return;
    }

    var pixelsPerUnit = vh / (2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z);
    var targetWidth = Math.max((cardRect && cardRect.width) || 0, W.innerWidth * 0.28);

    var cardCenterX = ((cardRect && cardRect.left) || 0) + ((cardRect && cardRect.width) || 0) / 2;
    var cardCenterY = ((cardRect && cardRect.top) || 0) + ((cardRect && cardRect.height) || 0) / 2;
    masterGroup.position.set(
      (cardCenterX - W.innerWidth / 2) / pixelsPerUnit,
      -(cardCenterY - vh / 2) / pixelsPerUnit,
      0
    );
    masterGroup.scale.setScalar(targetWidth / pixelsPerUnit / 10.6);

    // Interactive Drag / Hover inside the Hero Card
    var insideCard = !rm && cardRect && px >= cardRect.left - 20 && px <= cardRect.right + 20 &&
      py >= cardRect.top - 20 && py <= cardRect.bottom + 20 && scrollY < vh * 0.9;
    var u = cardRect && cardRect.width ? (px - cardRect.left) / cardRect.width : 0.5;
    var v = cardRect && cardRect.height ? (py - cardRect.top) / cardRect.height : 0.5;
    var targetYaw, targetPitch;
    var TWO_PI = Math.PI * 2;

    if (insideCard) {
      if (!isHovered) {
        isHovered = true;
        u0 = u;
        yaw0 = yaw;
      }
      targetYaw = yaw0 + (u - u0) * TWO_PI;
      targetPitch = 0.28 + (v - 0.5) * 0.7;
    } else {
      isHovered = false;
      var restYaw = -0.55 + mx * 0.4;
      targetYaw = restYaw + Math.round((yaw - restYaw) / TWO_PI) * TWO_PI;
      targetPitch = 0.28 + my * 0.25;
    }

    yaw += (targetYaw - yaw) * 0.10;
    pitch += (targetPitch - pitch) * 0.10;

    masterGroup.rotation.y = yaw;
    masterGroup.rotation.x = pitch;

    rotorGroup.rotation.x += rm ? 0 : dt * 0.55;

    // Responsive Fade: Fade out smoothly ONLY when the rotor card actually leaves the viewport!
    // On mobile, hero content comes first and card is below it, so tying fade directly to card position
    // prevents the rotor from fading prematurely while the user is still scrolling down to inspect it.
    var cardCenter = (cardRect ? cardRect.top + cardRect.height / 2 : 0);
    var fadeOpacity = 1;
    if (cardRect) {
      if (cardRect.bottom < 100) {
        fadeOpacity = Math.max(0, cardRect.bottom / 100);
      } else if (cardRect.top > vh - 60) {
        fadeOpacity = Math.max(0, (vh - cardRect.top) / 100);
      }
    }
    canvas.style.opacity = fadeOpacity.toFixed(2);
    canvas.style.pointerEvents = (insideCard && fadeOpacity > 0.2) ? 'auto' : 'none';

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  }

  lastTime = performance.now();
  requestAnimationFrame(renderLoop);
})();

/* ==========================================================================
   ENGINE 2: COMPLETE TURBINE & GENERATOR ASSEMBLY BAY (#stg-canvas, #stg-stage-wrapper)
   ========================================================================== */
(function () {
  'use strict';

  var W = window, D = document;
  var stage = D.getElementById('stg-stage-wrapper');
  var canvas = D.getElementById('stg-canvas');

  if (!stage || !canvas || !W.THREE) return;

  var THREE = W.THREE;
  var PI = Math.PI;

  // DOM Elements
  var labsEl = D.getElementById('stg-labs');
  var lnEl = D.getElementById('stg-ln');
  var tip = D.getElementById('stg-tip');
  var list = D.getElementById('stg-list');
  var gd = D.getElementById('stg-guide');
  var bExp = D.getElementById('bExp');
  var bAsm = D.getElementById('bAsm');
  var bRot = D.getElementById('bRot');
  var bRst = D.getElementById('bRst');
  var bLab = D.getElementById('bLab');
  var bGd = D.getElementById('bGd');
  var bZmIn = D.getElementById('bZmIn');
  var bZmOut = D.getElementById('bZmOut');
  var iSec = D.getElementById('stg-iSec');
  var iName = D.getElementById('stg-iName');
  var iDesc = D.getElementById('stg-iDesc');
  var iChk = D.getElementById('stg-iChk');

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'default'
    });
  } catch (e) {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      alpha: false
    });
  }
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(W.devicePixelRatio || 1, 1.25));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  var scene = new THREE.Scene();
  var bgCol = 0x0c253d;
  scene.background = new THREE.Color(bgCol);
  scene.fog = new THREE.Fog(bgCol, 85, 210);

  var camera = new THREE.PerspectiveCamera(38, 1, 0.5, 500);

  // PMREM Environment Map
  try {
    var es = new THREE.Scene();
    es.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0x1f3c5c, side: THREE.BackSide })
    ));
    [
      [0, 40, 0, 30, 2, 30, 0xffffff],
      [40, 10, 20, 2, 20, 30, 0xcfe0ff],
      [-40, 10, -10, 2, 20, 30, 0xffe2b8],
      [0, -20, 0, 60, 1, 60, 0x0e1f30]
    ].forEach(function (a) {
      var b = new THREE.Mesh(new THREE.BoxGeometry(a[3], a[4], a[5]), new THREE.MeshBasicMaterial({ color: a[6] }));
      b.position.set(a[0], a[1], a[2]);
      es.add(b);
    });
    var pmremGen = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGen.fromScene(es, 0.03).texture;
    pmremGen.dispose();
  } catch (err) {}

  // Lights
  scene.add(new THREE.HemisphereLight(0xe0f0ff, 0x162c42, 1.0));

  var sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(25, 50, 35);
  scene.add(sun);

  var fill = new THREE.DirectionalLight(0x93c5fd, 1.0);
  fill.position.set(-30, 20, -25);
  scene.add(fill);

  var frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
  frontLight.position.set(0, 15, 45);
  scene.add(frontLight);

  var rim = new THREE.DirectionalLight(0x38bdf8, 0.7);
  rim.position.set(0, -20, 30);
  scene.add(rim);

  var grid = new THREE.GridHelper(200, 80, 0x2b6cb0, 0x143452);
  grid.position.y = -4.3;
  scene.add(grid);

  // 3D Floor Watermark: Company Name ONLY (SD ENTERPRISES)
  var watermarkCanvas = D.createElement('canvas');
  watermarkCanvas.width = 2048;
  watermarkCanvas.height = 512;
  var wctx = watermarkCanvas.getContext('2d');
  wctx.clearRect(0, 0, 2048, 512);

  wctx.textAlign = 'center';
  wctx.textBaseline = 'middle';
  wctx.fillStyle = 'rgba(56, 189, 248, 0.88)'; // luminous cyan watermark
  wctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
  wctx.shadowBlur = 28;
  wctx.font = '900 145px "Manrope", "Segoe UI", Arial, sans-serif';
  wctx.letterSpacing = '18px';
  wctx.fillText('SD ENTERPRISES', 1024, 256);

  var watermarkTex = new THREE.CanvasTexture(watermarkCanvas);
  watermarkTex.anisotropy = Math.min((renderer.capabilities && renderer.capabilities.getMaxAnisotropy()) || 1, 8);

  var watermarkMat = new THREE.MeshBasicMaterial({
    map: watermarkTex,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending
  });

  var watermarkPlane = new THREE.Mesh(new THREE.PlaneGeometry(70, 17.5), watermarkMat);
  watermarkPlane.rotation.x = -PI / 2;
  watermarkPlane.position.set(0, -4.28, 11);
  scene.add(watermarkPlane);

  var root = new THREE.Group();
  scene.add(root);

  var noRayFn = function () {};
  function M(c, o) {
    return new THREE.MeshStandardMaterial(
      Object.assign({ color: c, metalness: 0.5, roughness: 0.38, side: THREE.DoubleSide }, o || {})
    );
  }

  function noRay(m) {
    m.raycast = noRayFn;
    m.frustumCulled = false;
    return m;
  }

  function mesh(g, m, x, y, z) {
    var o = new THREE.Mesh(g, m);
    o.position.set(x || 0, y || 0, z || 0);
    return o;
  }

  function box(w, h, d, m, x, y, z) {
    return mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
  }

  function cylX(r, len, m, x) {
    var g = new THREE.CylinderGeometry(r, r, len, 40);
    g.rotateZ(PI / 2);
    return mesh(g, m, x);
  }

  function ringX(r1, r2, t, x, m) {
    var p = [
      [r1, -t / 2],
      [r2, -t / 2],
      [r2, t / 2],
      [r1, t / 2],
      [r1, -t / 2]
    ].map(function (a) { return new THREE.Vector2(a[0], a[1]); });
    var g = new THREE.LatheGeometry(p, 56);
    g.rotateZ(PI / 2);
    return mesh(g, m, x);
  }

  function radial(n, x, r0, r1, w, d, m, tw) {
    var im = new THREE.InstancedMesh(new THREE.BoxGeometry(w, r1 - r0, d), m, n);
    var o = new THREE.Object3D();
    var rm = (r0 + r1) / 2;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * PI * 2;
      o.position.set(x, rm * Math.cos(a), rm * Math.sin(a));
      o.rotation.set(a, 0, tw || 0);
      o.updateMatrix();
      im.setMatrixAt(i, o.matrix);
    }
    return noRay(im);
  }

  function casing(len, R, upper, col, o) {
    var g = new THREE.Group();
    var m = M(col);
    var s = upper ? 1 : -1;
    var fw = 0.55;

    var cg = new THREE.CylinderGeometry(R, R, len, 56, 1, true, upper ? 0 : PI, PI);
    cg.rotateZ(PI / 2);
    g.add(mesh(cg, m));

    [-1, 1].forEach(function (z) {
      g.add(box(len, 0.16, fw, m, 0, s * 0.08, z * (R + fw / 2 - 0.05)));
    });

    if (o.walls) {
      var rg = new THREE.RingGeometry(o.sr + 0.08, R, 48, 1, upper ? 0 : PI, PI);
      rg.rotateY(PI / 2);
      [-1, 1].forEach(function (e) {
        g.add(mesh(rg, m, e * len / 2));
      });
    }

    for (var i = 0; i < 6; i++) {
      var tg = new THREE.TorusGeometry(R, 0.07, 8, 48, PI);
      if (!upper) tg.rotateZ(PI);
      tg.rotateY(PI / 2);
      g.add(mesh(tg, m, -len / 2 + len * (i + 0.5) / 6));
    }

    var nb = 12;
    var im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8), M(0x20262e), nb * 2);
    var d = new THREE.Object3D();
    for (var k = 0; k < nb; k++) {
      [-1, 1].forEach(function (z, j) {
        d.position.set(-len / 2 + 0.4 + k * (len - 0.8) / (nb - 1), s * 0.24, z * (R + fw / 2 - 0.05));
        d.updateMatrix();
        im.setMatrixAt(k * 2 + j, d.matrix);
      });
    }
    g.add(noRay(im));

    if (upper) {
      (o.pipes || []).forEach(function (p) {
        g.add(mesh(new THREE.CylinderGeometry(p.r, p.r, 1.5, 24), m, p.x, R + 0.55, 0));
        g.add(p.r < 0.5
          ? mesh(new THREE.SphereGeometry(p.r * 1.35, 20, 14), m, p.x, R + 1.3, 0)
          : mesh(new THREE.CylinderGeometry(p.r * 1.5, p.r * 1.5, 0.2, 28), m, p.x, R + 1.3, 0)
        );
      });
    } else {
      [-1, 1].forEach(function (z) {
        [-0.3, 0.3].forEach(function (x) {
          g.add(box(0.8, 3.9 - 0.16, 0.4, m, x * len, -(3.9 + 0.16) / 2, z * (R + 0.25)));
        });
      });
      if (o.exhaust) {
        g.add(box(len * 0.6, 3.9 - 0.6 * R, R * 1.6, m, 0, -(0.6 * R + 3.9) / 2, 0));
      }
    }
    return g;
  }

  function rotor(o) {
    var g = new THREE.Group();
    var m = M(0xaab4be, { metalness: 0.72, roughness: 0.28 });
    var bm = M(0xd9b44e, { metalness: 0.82, roughness: 0.26 });
    var xs = -(o.len / 2 + 1.2);
    var xe = o.len / 2 + 1.2 + (o.ext || 0);

    g.add(cylX(o.sr, xe - xs, m, (xs + xe) / 2));
    [-1, 1].forEach(function (e) {
      g.add(cylX(o.sr * 1.2, 0.5, m, e * (o.len / 2 + 0.9)));
    });
    g.add(cylX(o.sr * 2.2, 0.2, m, xs + 0.1));
    if (!o.ext) g.add(cylX(o.sr * 2.2, 0.2, m, xe - 0.1));

    o.stages.forEach(function (st) {
      g.add(cylX(st.rd, 0.14, m, st.x));
      g.add(radial(44, st.x, st.rd, st.tip, 0.09, 0.2, bm, 0.45));
    });
    return g;
  }

  function diaphragm(st) {
    var g = new THREE.Group();
    var m = M(0xb8864a, { metalness: 0.55 });
    var vm = M(0xe0c98a, { metalness: 0.6 });
    g.add(ringX(st.tip + 0.02, st.tip + 0.4, 0.3, 0, m));
    g.add(radial(36, 0, st.rd + 0.03, st.tip + 0.02, 0.07, 0.22, vm, -0.5));
    g.position.x = st.x + st.vd;
    return g;
  }

  function bearing() {
    var g = new THREE.Group();
    var m = M(0x5d6c7e);
    var sr = 0.5;
    g.add(box(0.5, 3.9 - sr, 1.5, m, 0, -(3.9 + sr) / 2, 0));
    g.add(box(0.5, 0.6, 1.5, m, 0, sr + 0.3, 0));
    return g;
  }

  var sections = [];
  var pickables = [];
  var X = 0;

  function section(id, name, color, fp, off, h) {
    var c = X + fp / 2 + (off || 0);
    var s = {
      id: id,
      name: name,
      color: color,
      cx: c,
      h: h,
      g: new THREE.Group(),
      parts: [],
      k: 0,
      locked: false
    };
    s.g.position.x = c;
    root.add(s.g);
    X += fp;
    sections.push(s);
    return s;
  }

  function part(s, name, desc, obj, ex, delay) {
    var p = {
      name: name,
      desc: desc,
      obj: obj,
      ex: new THREE.Vector3(ex[0] || 0, ex[1] || 0, ex[2] || 0),
      delay: delay || 0,
      sec: s,
      mats: new Set()
    };
    obj.traverse(function (o) {
      if (o.material) {
        p.mats.add(o.material);
        if (o.raycast !== noRayFn) {
          o.userData.part = p;
          pickables.push(o);
        }
      }
    });
    obj.updateMatrixWorld(true);
    p.c = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
    s.g.add(obj);
    s.parts.push(p);
    mkLab(p, s.parts.length);
    return p;
  }

  function mkLab(p, i) {
    if (!labsEl || !lnEl) return;
    var d = D.createElement('div');
    d.className = 'stg-lab';
    d.innerHTML = '<b>' + i + '</b><em>' + p.sec.id.toUpperCase() + ' · </em>' +
      p.name.replace(p.sec.name + ' – ', '').replace(/^Generator – /, '');
    labsEl.appendChild(d);

    var g = D.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = '<line stroke="#38bdf8" stroke-width="1.25" stroke-dasharray="2,2"/><circle r="3" fill="#38bdf8"/>';
    lnEl.appendChild(g);

    p.lab = d;
    p.ln = g;
    p.i = i;
  }

  function turbine(id, name, col, len, R, sr, stages, pipes, exhaust, h) {
    var s = section(id, name, col, len + 2.4, 0, h);
    var cm = col;
    var maxTip = Math.max.apply(null, stages.map(function (t) { return t.tip; }));
    var maxDia = maxTip + 0.4;
    var dD = maxDia + 0.3;
    var dR = dD + maxDia + 0.3 + maxTip;
    var dU = dR + maxTip + 0.3;
    var o = { sr: sr, walls: true, pipes: pipes, exhaust: exhaust };

    part(s, name + ' – lower casing', 'Lower half-casing with foot supports, steam path and flange studs. Check joint faces, distortion and cracks.', casing(len, R, false, cm, o), [0, 0, 0], 0);
    part(s, name + ' – upper casing', 'Upper half-casing with steam inlet pipes. Lift first at outage; inspect inner surfaces and nozzle blocks.', casing(len, R, true, cm, o), [0, dU, 0], 0);

    var dg = new THREE.Group();
    stages.forEach(function (st) { dg.add(diaphragm(st)); });
    part(s, name + ' – diaphragms', 'Stationary nozzle/vane rings between rotor stages. Check vane erosion, cracks and seal clearances.', dg, [0, dD, 0], 0.25);

    part(s, name + ' – rotor & shaft', 'Forged shaft with integral discs and moving blades. Inspect journals, blade roots, shroud and runout.', rotor({ len: len, sr: sr, stages: stages }), [0, dR, 0], 0.12);

    var bh = len / 2 + 0.9;
    [-1, 1].forEach(function (e, i) {
      var b = bearing();
      b.position.x = e * bh;
      part(s, name + (i ? ' – bearing (outboard)' : ' – bearing (inlet end)'), 'Journal bearing pedestal with lower and upper shell. Check babbitt, clearances and oil supply.', b, [e * 1.4, 0, 0], 0.3);
    });

    if (id === 'hp') {
      var vg = new THREE.Group();
      var vm = M(0x8d4b3b);
      var dk = M(0x2f3a46);
      [-0.9, 0.9].forEach(function (x) {
        vg.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.6, 16), vm, x, R + 2.0, 0));
        vg.add(box(1.1, 1.0, 1.1, vm, x, R + 2.8, 0));
        vg.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.8, 16), dk, x, R + 4.0, 0));
        vg.add(mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 20), dk, x, R + 5.0, 0));
      });
      part(s, name + ' – stop & control valves', 'Main stop valve and control valve chest feeding the HP steam inlets, with hydraulic servo actuators.', vg, [0, dU + 3, 0], 0);
    }
    return s;
  }

  var flow = function (n, len, rd, t0, dt) {
    return Array.from({ length: n }, function (_, i) {
      return { x: -len / 2 + 0.5 + i * (len - 1) / (n - 1), rd: rd, tip: t0 + dt * i, vd: -0.27 };
    });
  };

  var lpflow = function () {
    var a = [];
    for (var i = 0; i < 5; i++) {
      [-1, 1].forEach(function (e) {
        a.push({ x: e * (0.6 + 0.5 * i), rd: 1.05, tip: 1.5 + 0.22 * i, vd: -e * 0.22 });
      });
    }
    return a;
  };

  turbine('hp', 'HP turbine', 0x6f8296, 4.0, 1.8, 0.38, flow(7, 4.0, 0.7, 0.95, 0.05), [{ x: -0.9, r: 0.28 }, { x: 0.9, r: 0.28 }], false, 10);
  turbine('ip', 'IP turbine', 0x728a9c, 4.6, 2.0, 0.42, flow(8, 4.6, 0.85, 1.1, 0.045), [{ x: -0.5, r: 0.45 }], false, 10.6);
  turbine('lp1', 'LP turbine 1', 0x7a8fa0, 5.6, 2.95, 0.55, lpflow(), [{ x: 0, r: 0.8 }], true, 16);
  turbine('lp2', 'LP turbine 2', 0x7a8fa0, 5.6, 2.95, 0.55, lpflow(), [{ x: 0, r: 0.8 }], true, 16);

  // Crossover Piping
  (function () {
    var gs = function (id) { return sections.find(function (s) { return s.id === id; }); };
    var ip = gs('ip'), l1 = gs('lp1'), l2 = gs('lp2');
    var s = section('xo', 'Crossover piping', 0xc2703a, 0, 0, 14);
    var mid = (ip.cx + l2.cx) / 2;
    s.cx = mid;
    s.g.position.x = mid;

    var ia = ip.cx + 1.5 - mid, b = l1.cx - mid, c = l2.cx - mid;
    var yH = 7.2, r = 0.8, R = 1.5, yB = 4.46, yT = 2.0;
    var pm = M(0xb9c2cb, { metalness: 0.6, roughness: 0.45 });
    var fm = M(0xb0653a, { metalness: 0.6, roughness: 0.4 });
    var sm = M(0x6c7884);
    var bk = M(0x20262e);

    var cylY = function (rr, h, m, x, y) { return mesh(new THREE.CylinderGeometry(rr, rr, h, 28), m, x, y, 0); };
    var elb = function (x, y, mir) {
      var t = new THREE.TorusGeometry(R, r, 18, 28, PI / 2);
      if (mir) t.scale(-1, 1, 1);
      return mesh(t, pm, x, y, 0);
    };
    var flg = function (x, y) { return cylY(1.2, 0.22, fm, x, y); };

    var g1 = new THREE.Group();
    g1.add(cylY(r, yH - R - yT, pm, ia, (yT + yH - R) / 2), elb(ia + R, yH - R, 1), flg(ia, yT), cylY(1.05, 0.9, fm, ia, 1.65));
    part(s, 'Crossover – IP exhaust riser & elbow', 'IP exhaust nozzle riser turning into the crossover. Carries IP exhaust steam to the LP turbines.', g1, [0, 13, 0], 0);

    var g2 = new THREE.Group();
    var x0 = ia + R, x1 = c - R;
    var hp = cylX(r, x1 - x0, pm, (x0 + x1) / 2);
    hp.position.y = yH;
    g2.add(hp);
    for (var i = 0; i < 9; i++) {
      var bd = ringX(r, r + 0.1, 0.18, x0 + 0.7 + i * (x1 - x0 - 1.4) / 8, sm);
      bd.position.y = yH;
      g2.add(bd);
    }
    part(s, 'Crossover – horizontal pipe', 'Large-bore insulated pipe (low pressure, high volume) with lagging straps, running from IP exhaust over the LP casings.', g2, [0, 13, 0], 0.05);

    var g3 = new THREE.Group();
    g3.add(cylY(r, yH - yB, pm, b, (yH + yB) / 2), flg(b, yB), mesh(new THREE.SphereGeometry(r * 1.05, 20, 14), pm, b, yH, 0));
    part(s, 'Crossover – LP1 inlet branch (tee)', 'Tee branch dropping steam into the centre inlet of LP turbine 1.', g3, [0, 13, 0], 0.05);

    var g4 = new THREE.Group();
    g4.add(elb(c - R, yH - R), cylY(r, yH - R - yB, pm, c, (yH - R + yB) / 2), flg(c, yB));
    part(s, 'Crossover – LP2 elbow & inlet drop', 'End elbow and drop into the centre inlet of LP turbine 2.', g4, [0, 13, 0], 0.05);

    var g5 = new THREE.Group();
    [x0 + 1.4, (b + c) / 2].forEach(function (bx) {
      for (var i = 0; i < 7; i++) {
        var t = new THREE.TorusGeometry(r + 0.12, 0.12, 10, 36);
        t.rotateY(PI / 2);
        var q = mesh(t, sm, bx + (i - 3) * 0.17, yH, 0);
        g5.add(q);
      }
      for (var k = 0; k < 4; k++) {
        var a = k * PI / 2 + PI / 4;
        var rj = mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8), bk, bx, yH + Math.cos(a) * (r + 0.45), Math.sin(a) * (r + 0.45));
        rj.rotation.z = PI / 2;
        g5.add(rj);
      }
    });
    part(s, 'Crossover – expansion bellows', 'Metal bellows with tie rods absorbing thermal growth so pipe loads never reach the turbine casings.', g5, [0, 16, 0], 0.1);

    var im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 8), bk, 42);
    var d = new THREE.Object3D();
    var n = 0;
    [[ia, yT], [b, yB], [c, yB]].forEach(function (f) {
      for (var i = 0; i < 14; i++) {
        var a = (i / 14) * PI * 2;
        d.position.set(f[0] + 1.02 * Math.cos(a), f[1] + 0.1, 1.02 * Math.sin(a));
        d.updateMatrix();
        im.setMatrixAt(n++, d.matrix);
      }
    });
    part(s, 'Crossover – flange studs & gaskets', 'Flange studs and nuts joining the crossover to each turbine casing. Renew gaskets at every outage.', noRay(im), [0, 6, 0], 0);
  })();

  // Generator
  (function () {
    var s = section('gen', 'Generator', 0x2f7f86, 10, 0, 12.6);
    s.g.position.x = s.cx - (10 / 2) + 4.0;
    s.cx = s.g.position.x;

    var fm = 0x2f7f86;
    var o = { sr: 0.45, walls: false };
    var dC = 2.4, dRt = 5.85, dU = 7.3;

    part(s, 'Generator – lower frame', 'Stator frame (lower half) with foundation supports. Check frame, seals and hydrogen casing tightness.', casing(5.6, 2.6, false, fm, o), [0, 0, 0], 0);
    part(s, 'Generator – upper cover', 'Frame cover. Lift to open the generator; inspect gaskets and bolting.', casing(5.6, 2.6, true, fm, o), [0, dU, 0], 0);

    var cg = new THREE.Group();
    var cm = M(0x7e8995, { metalness: 0.7, roughness: 0.35 });
    cg.add(ringX(1.25, 2.0, 4.4, 0, cm));
    for (var i = 0; i < 10; i++) {
      cg.add(ringX(2.0, 2.06, 0.1, -1.9 + i * 0.42, M(0x4d5865)));
    }
    part(s, 'Generator – stator core', 'Laminated stator core with slot windings. Check core tightness, hot spots and wedges.', cg, [0, dC, 0], 0.2);

    var wg = new THREE.Group();
    var wm = M(0xb87333, { metalness: 0.75, roughness: 0.35 });
    [-1, 1].forEach(function (e) {
      var t = new THREE.TorusGeometry(1.65, 0.28, 14, 48);
      t.rotateY(PI / 2);
      wg.add(mesh(t, wm, e * 2.5));
    });
    part(s, 'Generator – stator end-windings', 'Copper end-winding bundles. Inspect insulation, bracing and for oil or dust contamination.', wg, [0, dC + 0.1, 0], 0.3);

    var rg = rotor({ len: 5.6, sr: 0.45, stages: [], ext: 1.8 });
    var sm = M(0x9aa5b1, { metalness: 0.7, roughness: 0.3 });
    rg.add(cylX(1.1, 4.2, sm, 0));

    var sl = new THREE.InstancedMesh(new THREE.BoxGeometry(4.0, 0.06, 0.16), M(0x20262e), 16);
    var d = new THREE.Object3D();
    for (var i = 0; i < 16; i++) {
      var a = (i / 16) * PI * 2;
      d.position.set(0, 1.1 * Math.cos(a), 1.1 * Math.sin(a));
      d.rotation.set(a, 0, 0);
      d.updateMatrix();
      sl.setMatrixAt(i, d.matrix);
    }
    rg.add(noRay(sl));
    [-1, 1].forEach(function (e) {
      rg.add(radial(14, e * 2.75, 0.55, 1.0, 0.07, 0.2, M(0xd9b44e), 0.4));
    });
    part(s, 'Generator – rotor & shaft', 'Forged field rotor with winding slots and fans. Inspect shaft, slot wedges, fans and rotor winding.', rg, [0, dRt, 0], 0.1);

    [-1, 1].forEach(function (e) {
      part(s, 'Generator – retaining ring' + (e < 0 ? ' (turbine end)' : ' (exciter end)'), 'Shrunk-on ring holding the rotor end-windings. Requires NDT for cracks at every major outage.', ringX(1.0, 1.18, 0.5, e * 2.0, M(0xc9a24a, { metalness: 0.8 })), [e * 2.2, dRt, 0], 0.35);
    });

    [-1, 1].forEach(function (e) {
      part(s, 'Generator – end shield' + (e < 0 ? ' (turbine end)' : ' (exciter end)'), 'End shield with gas seals. Check seal rings and oil-ring clearances.', ringX(0.55, 2.6, 0.3, e * 2.95, M(0x3a8d94)), [e * 2.4, 0, 0], 0.4);
    });

    [-1, 1].forEach(function (e, i) {
      var b = bearing();
      b.position.x = e * 3.7;
      part(s, 'Generator – bearing' + (i ? ' (exciter end)' : ' (turbine end)'), 'Journal bearing with electrical insulation. Check babbitt, shaft voltage insulation and oil supply.', b, [e * 1.2, 0, 0], 0.5);
    });

    var cl = new THREE.Group();
    [-1.5, 1.5].forEach(function (x) {
      cl.add(box(2.2, 0.9, 2.2, M(0x4a5a6c), x, 3.05, 0));
    });
    part(s, 'Generator – H₂ gas coolers', 'Hydrogen coolers on the frame top. Check tube leaks and fouling.', cl, [0, dU + 1.6, 0], 0.25);

    part(s, 'Generator – terminal box', 'Main terminal box with bushings and CTs. Check bushings, insulation and connections.', box(1.4, 1.3, 1.1, M(0x5a6b7d), -1, -0.9, -3.15), [0, 0, -2.6], 0.4);

    var ex = new THREE.Group();
    var em = M(0x6b7a8a);
    ex.add(ringX(0.6, 1.1, 1.6, 5.0, em));
    ex.add(cylX(1.1, 0.2, em, 5.9));
    ex.add(box(1.4, 3.0, 1.6, em, 5.0, -2.4, 0));
    part(s, 'Exciter', 'Exciter housing around the shaft end. Inspect brushes or rotating rectifier, and bearings.', ex, [2.2, 0, 0], 0.45);

    X += 2.0;
  })();

  // Foundation
  var fdn = box(X + 1, 0.2, 9.5, M(0x18344e, { metalness: 0.1, roughness: 0.8 }), X / 2, -4.0, 0);
  fdn.raycast = noRayFn;
  root.add(fdn);

  root.position.x = -X / 2 + 1;
  sections.forEach(function (s) { s.cx += root.position.x; });
  sections.forEach(function (s) {
    s.parts.forEach(function (p) {
      p.mats.forEach(function (mt) {
        mt.emissive = mt.emissive || new THREE.Color();
      });
    });
  });

  // QA Checklist Details
  var DET = [
    ['lower casing', ['Joint-face flatness, steam cutting and cracks (DPT/MPI)', 'Foot keys, centring pads and guide-key clearances', 'Stud and nut threads: replace cracked or stretched studs', 'Clean steam path; inspect nozzle-box erosion']],
    ['lower frame', ['Frame, foundation bolts and grouting integrity', 'Hydrogen seals and frame leak test', 'Keybar and stator lifting-lug condition']],
    ['upper casing', ['MPI at inlet bosses and flanges', 'Nozzle blocks and inner-ring grooves', 'Record lift level and bolt-loosening sequence', 'New gaskets / sealing compound at box-up']],
    ['upper cover', ['Renew gaskets and verify sealing faces', 'Clean gas passages and check for oil mist', 'Verify bolting torque specification']],
    ['diaphragm', ['Vane erosion, cracks and deposits (UT/DPT)', 'Radial and axial clearances to rotor: record as-found', 'Gland-seal fins: renew worn packing', 'Key/support alignment and horizontal-joint tightness']],
    ['rotor', ['Journal ovality and scoring; shaft runout check', 'MPI/DPT blade roots and shrouds; UT on shaft and bore', 'Blade natural frequency check; replace damaged blades', 'Coupling-face runout and dynamic trim balance']],
    ['bearing', ['Babbitt bond integrity (UT), wipe, pitting inspection', 'Oil clearance (plastigauge) and shell crush check', 'Oil orifice, jacking-oil line cleanliness', 'RTD and vibration-probe verification; alignment signoff']],
    ['stator core', ['Core tightness and hot spots check (EL-CID)', 'Winding IR / PI, tan δ, partial discharge analysis', 'Wedge tap test for loose stator wedges', 'Verify stator cooling ducts free of blockage']],
    ['end-winding', ['Bracing, blocking and lashing looseness check', 'Inspect for oil, coal dust, or corona powdering', 'DC resistance and AC high-pot electrical tests']],
    ['retaining', ['Ultrasonic / fluorescent dye-penetrant testing for stress corrosion', 'Shrink-fit and locking key alignment check', 'Replace if operating hours or limits exceed OEM thresholds']],
    ['end shield', ['H₂ shaft-seal rings and babbitt contact check', 'Seal-oil clearances; replace worn rings', 'Joint compound and pressure leak test']],
    ['cooler', ['Tube leak test (hydrostatic) and tube plugging', 'Chemical cleaning of fouled tube nests', 'Inspect tube sheets and renew rubber gaskets']],
    ['terminal', ['High-voltage bushings and current transformer tests, tan δ', 'Torque connections; thermal imaging inspection post startup', 'Hydrogen gas sealing of bushings']],
    ['exciter', ['Brush gear or rotating-rectifier diodes and fuses', 'Collector-ring surface condition, runout and ovality', 'Exciter bearings and air cooler maintenance']],
    ['valve', ['Seat and disc lapping, blue contact check (min 85%)', 'Stem bushings and servo hydraulic actuator test', 'Emergency trip / fast-closure time verification']],
    ['riser', ['IP exhaust flange face flatness and gasket seating', 'Weld NDT; inspect thermal expansion travel path', 'Spring hanger and support load verification']],
    ['horizontal', ['Borescope inspection for scale and magnetite oxide', 'Weld NDT (MPI / ultrasonic testing)', 'Hanger load indicators and insulation check']],
    ['inlet', ['Flange face, gasket and high-tensile studs check', 'Alignment to turbine casing inlet; zero cold spring', 'Inlet steam strainer / screen integrity check']],
    ['bellows', ['Convolutions inspection for cracks and distortion', 'Tie rods, spherical washers and travel stops check', 'Replace at fatigue-life design limit']],
    ['stud', ['Measure stud elongation; replace aged studs by life', 'Apply anti-seize paste; tighten in calibrated star pattern', 'Fit new spiral-wound gaskets']]
  ];

  function det(n) {
    n = n.toLowerCase();
    var k = DET.find(function (d) { return n.indexOf(d[0]) !== -1; });
    return k ? k[1] : [];
  }

  var labelsOn = true;
  var xoOn = function () {
    return ['ip', 'lp1', 'lp2'].some(function (id) {
      var a = sections.find(function (z) { return z.id === id; });
      return a && (a.locked || a === hoverSec);
    });
  };

  var secSymbols = {
    'hp': 'HP',
    'ip': 'IP',
    'lp1': 'LP1',
    'lp2': 'LP2',
    'xo': 'XO',
    'gen': 'GEN'
  };

  if (list) {
    sections.forEach(function (s) {
      var b = D.createElement('button');
      b.type = 'button';
      b.className = 'stg-sec-btn';
      b.title = s.name;
      b.setAttribute('aria-label', s.name);
      var sym = secSymbols[s.id] || s.name.substring(0, 2).toUpperCase();
      b.innerHTML = '<i style="background:#' + s.color.toString(16).padStart(6, '0') + '; color:#' + s.color.toString(16).padStart(6, '0') + '"></i><span class="stg-sec-sym">' + sym + '</span>';
      b.onclick = function () { toggle(s); };
      s.btn = b;
      list.appendChild(b);
    });
  }

  var hoverSec = null;
  var hoverPart = null;
  var releaseAt = 0;
  var focus = null;
  var auto = true;
  var dragging = false;

  var T = {
    az: 0.55,
    el: 0.28,
    d: 46,
    dd: 46,
    tx: 0,
    ty: 1,
    tz: 0,
    gx: 0,
    gy: 1
  };

  function toggle(s) {
    s.locked = !s.locked;
    if (s.btn) s.btn.classList.toggle('on', s.locked);
    setFocus(s.locked ? s : sections.find(function (x) { return x.locked; }));
  }

  function setFocus(s) {
    focus = s || null;
    if (s) {
      T.gx = s.cx;
      T.gy = s.h * 0.35;
      T.dd = Math.max(26, s.h * 1.95);
    } else {
      T.gx = 0;
      T.gy = 1;
      T.dd = 46;
    }
  }

  if (bExp) {
    bExp.onclick = function () {
      sections.forEach(function (s) {
        s.locked = true;
        if (s.btn) s.btn.classList.add('on');
      });
      setFocus(null);
      T.dd = 60;
      T.gy = 2;
    };
  }

  if (bAsm) {
    bAsm.onclick = function () {
      sections.forEach(function (s) {
        s.locked = false;
        if (s.btn) s.btn.classList.remove('on');
      });
      hoverSec = null;
      setFocus(null);
    };
  }

  if (bLab) {
    bLab.onclick = function (e) {
      labelsOn = !labelsOn;
      e.currentTarget.classList.toggle('on', labelsOn);
    };
  }

  if (bRot) {
    bRot.onclick = function (e) {
      auto = !auto;
      e.currentTarget.classList.toggle('on', auto);
    };
  }

  if (bRst) {
    bRst.onclick = function () {
      if (bAsm) bAsm.click();
      T.az = 0.55;
      T.el = 0.28;
      T.dd = 46;
    };
  }

  if (bZmIn) {
    bZmIn.onclick = function () {
      T.dd = Math.max(16, T.dd * 0.82);
    };
  }

  if (bZmOut) {
    bZmOut.onclick = function () {
      T.dd = Math.min(130, T.dd * 1.22);
    };
  }



  var ray = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var pend = false;
  var mx = 0, my = 0;
  var moved = 0;
  var ptrs = new Map();
  var pinch = 0;

  var el = canvas;

  el.addEventListener('pointerdown', function (e) {
    el.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    moved = 0;
    dragging = false;
    if (ptrs.size === 2) {
      var a = Array.from(ptrs.values());
      pinch = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]);
    }
  });

  el.addEventListener('pointermove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (ptrs.has(e.pointerId)) {
      var p = ptrs.get(e.pointerId);
      var dx = e.clientX - p[0];
      var dy = e.clientY - p[1];
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      moved += Math.abs(dx) + Math.abs(dy);

      if (ptrs.size === 2) {
        var a = Array.from(ptrs.values());
        var n = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]);
        T.dd = Math.min(130, Math.max(14, T.dd * pinch / (n || 1)));
        pinch = n;
      } else if (moved > 6) {
        dragging = true;
        T.az -= dx * 0.006;
        T.el = Math.min(1.45, Math.max(-0.2, T.el + dy * 0.005));
        if (tip) tip.style.display = 'none';
      }
    } else {
      pend = true;
    }
  });

  el.addEventListener('pointerup', function (e) {
    ptrs.delete(e.pointerId);
    if (!dragging && moved <= 6) {
      mx = e.clientX;
      my = e.clientY;
      pick();
      if (hoverPart) {
        toggle(hoverPart.sec);
      } else {
        sections.forEach(function (s) {
          s.locked = false;
          if (s.btn) s.btn.classList.remove('on');
        });
        setFocus(null);
      }
    }
    dragging = false;
  });

  el.addEventListener('pointerleave', function () {
    setHoverPart(null);
    if (tip) tip.style.display = 'none';
  });

  var cachedElRect = { left: 0, top: 0, width: 1, height: 1 };
  function updateElRect() {
    if (el) cachedElRect = el.getBoundingClientRect();
  }
  W.addEventListener('resize', updateElRect, { passive: true });
  W.addEventListener('scroll', updateElRect, { passive: true });
  el.addEventListener('pointerenter', updateElRect, { passive: true });
  updateElRect();

  el.addEventListener('wheel', function (e) {
    e.preventDefault();
    T.dd = Math.min(130, Math.max(14, T.dd * Math.exp(e.deltaY * 0.001)));
  }, { passive: false });

  function pick() {
    var r = cachedElRect;
    if (!r.width || !r.height) updateElRect();
    mouse.set((mx - r.left) / r.width * 2 - 1, -(my - r.top) / r.height * 2 + 1);
    ray.setFromCamera(mouse, camera);
    var h = ray.intersectObjects(pickables, false)[0];
    var p = h ? h.object.userData.part : null;
    setHoverPart(p);
  }

  function setHoverPart(p) {
    if (p) {
      releaseAt = 0;
      hoverSec = p.sec;
    } else if (hoverSec && !releaseAt) {
      releaseAt = performance.now() + 700;
    }

    if (p === hoverPart) return;

    if (hoverPart) {
      hoverPart.mats.forEach(function (m) {
        m.emissive.setHex(0);
      });
    }

    hoverPart = p;

    if (p) {
      p.mats.forEach(function (m) {
        m.emissive.setHex(0x1a4a75);
      });
      if (tip) {
        tip.style.display = 'block';
        tip.textContent = p.name;
      }
      if (iSec) iSec.textContent = p.sec.name;
      if (iName) iName.textContent = p.name.replace(p.sec.name + ' – ', '').replace(/^Generator – /, '');
      if (iDesc) iDesc.textContent = p.desc;
      if (iChk) {
        var dt = det(p.name);
        iChk.innerHTML = dt.length
          ? '<div style="margin-top:8px; font-size:11px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em;">Overhaul QA &amp; Inspection Checks</div>' +
            '<ul style="margin:4px 0 0; padding-left:17px; color:#cbd5e1; font-size:12px; line-height:1.5;">' +
            dt.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'
          : '';
      }
    } else {
      if (tip) tip.style.display = 'none';
    }
  }

  function resize() {
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  if ('ResizeObserver' in W) {
    new ResizeObserver(resize).observe(stage);
  } else {
    W.addEventListener('resize', resize);
  }
  resize();

  var _v = new THREE.Vector3();
  var labelsRendered = true;
  function updLabs() {
    if (!labsEl || !lnEl || !stage) return;
    if (!labelsOn) {
      if (labelsRendered) {
        sections.forEach(function (s) {
          s.parts.forEach(function (p) {
            if (p.lab) p.lab.style.opacity = '0';
            if (p.ln) p.ln.style.display = 'none';
          });
        });
        labsEl.classList.remove('multi');
        labelsRendered = false;
      }
      return;
    }
    labelsRendered = true;

    var w = stage.clientWidth;
    var h = stage.clientHeight;
    var V = [];
    var ids = new Set();

    sections.forEach(function (s) {
      var a = labelsOn ? Math.min(1, Math.max(0, (s.k - 0.45) / 0.4)) : 0;
      s.parts.forEach(function (p) {
        if (!p.lab || !p.ln) return;
        p.lab.style.opacity = 0;
        p.ln.style.display = 'none';
        if (a < 0.02) return;

        _v.copy(p.c).addScaledVector(p.ex, p.kp || 0);
        s.g.localToWorld(_v);
        _v.project(camera);
        if (_v.z > 1) return;

        V.push({
          p: p,
          a: a,
          sx: (_v.x + 1) / 2 * w,
          sy: (1 - _v.y) / 2 * h
        });
        ids.add(s.id);
      });
    });

    labsEl.classList.toggle('multi', ids.size > 1);
    if (!V.length) return;

    var xs = V.map(function (o) { return o.sx; });
    var mn = Math.min.apply(null, xs);
    var mxPos = Math.max.apply(null, xs);
    var med = (mn + mxPos) / 2;

    var xl = Math.min(Math.max(mn - 80, 75), w * 0.5 - 20);
    var xr = Math.max(Math.min(mxPos + 80, w - 75), w * 0.5 + 20);

    var L = V.filter(function (o) { return o.sx < med; });
    var R = V.filter(function (o) { return o.sx >= med; });

    [[L, xl, 1], [R, xr, 0]].forEach(function (c) {
      var A = c[0].sort(function (p, q) { return p.sy - q.sy; });
      var n = A.length;
      if (!n) return;

      var gap = Math.min(27, (h - 60) / n);
      var top = 30;
      var bot = h - 30;

      A.forEach(function (o, i) {
        o.ly = Math.max(o.sy, i ? A[i - 1].ly + gap : top);
      });

      var ov = A[n - 1].ly - bot;
      if (ov > 0) {
        A.forEach(function (o) { o.ly -= ov; });
        for (var i = n - 2; i >= 0; i--) {
          A[i].ly = Math.min(A[i].ly, A[i + 1].ly - gap);
        }
        A.forEach(function (o, i) {
          if (i && o.ly < A[i - 1].ly + gap) o.ly = A[i - 1].ly + gap;
        });
      }

      A.forEach(function (o) {
        var p = o.p;
        var l = p.ln.firstChild;
        var k = p.ln.lastChild;

        p.lab.style.transform = 'translate(' + c[1] + 'px,' + o.ly + 'px) translate(' + (c[2] ? '-100%' : '0') + ',-50%)';
        p.lab.style.opacity = o.a;
        p.ln.style.display = '';
        p.ln.style.opacity = o.a;

        l.setAttribute('x1', o.sx);
        l.setAttribute('y1', o.sy);
        l.setAttribute('x2', c[1]);
        l.setAttribute('y2', o.ly);

        k.setAttribute('cx', o.sx);
        k.setAttribute('cy', o.sy);
      });
    });
  }

  var ease = function (x) { return x * x * (3 - 2 * x); };
  var last = performance.now();
  var engine2Active = true;
  var engine2Running = false;

  function frame(now) {
    if (!engine2Active) {
      engine2Running = false;
      return;
    }
    engine2Running = true;

    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (pend && !dragging) {
      pend = false;
      pick();
    }

    if (releaseAt && now > releaseAt) {
      hoverSec = null;
      releaseAt = 0;
    }

    if (hoverPart || hoverSec) {
      if (tip) {
        var r = cachedElRect;
        tip.style.left = (mx - r.left + 14) + 'px';
        tip.style.top = (my - r.top + 14) + 'px';
      }
    }

    var maxK = 0;
    sections.forEach(function (s) {
      var tg = (s.locked || s === hoverSec || (s.id === 'xo' && xoOn())) ? 1 : 0;
      s.k += Math.sign(tg - s.k) * Math.min(Math.abs(tg - s.k), dt / 1.5);
      if (s.k > maxK) maxK = s.k;
      s.parts.forEach(function (p) {
        var kp = ease(Math.min(1, Math.max(0, (s.k - p.delay) / (1 - p.delay))));
        p.obj.userData.base = p.obj.userData.base || p.obj.position.clone();
        p.obj.position.copy(p.obj.userData.base).addScaledVector(p.ex, p.kp = kp);
      });
    });

    if (!dragging && auto && !hoverSec) {
      T.az += dt * 0.15;
    }

    // Dynamic vertical lift tracking: when parts disassemble into the air,
    // raise camera target Y and distance so upper casings/valves never clip off the top!
    var liftY = maxK * 4.5;
    var currentGy = T.gy + liftY;
    var currentDd = focus ? T.dd : (T.dd + maxK * 16);

    var f = 1 - Math.exp(-dt * 4);
    T.d += (currentDd - T.d) * f;
    T.tx += (T.gx - T.tx) * f;
    T.ty += (currentGy - T.ty) * f;

    camera.position.set(
      T.tx + T.d * Math.cos(T.el) * Math.sin(T.az),
      T.ty + T.d * Math.sin(T.el),
      T.d * Math.cos(T.el) * Math.cos(T.az)
    );
    camera.lookAt(T.tx, T.ty, 0);

    renderer.render(scene, camera);
    updLabs();

    requestAnimationFrame(frame);
  }

  function checkStageVisibility() {
    if (!stage) return;
    var r = stage.getBoundingClientRect();
    var isVis = (r.bottom > -150 && r.top < W.innerHeight + 150);
    if (isVis && !engine2Running) {
      engine2Active = true;
      engine2Running = true;
      last = performance.now();
      updateElRect();
      requestAnimationFrame(frame);
    }
  }
  W.addEventListener('scroll', checkStageVisibility, { passive: true });

  if ('IntersectionObserver' in W && stage) {
    var stageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        engine2Active = entry.isIntersecting;
        if (engine2Active) {
          updateElRect();
          if (!engine2Running) {
            engine2Running = true;
            last = performance.now();
            requestAnimationFrame(frame);
          }
        }
      });
    }, { rootMargin: '250px 0px 250px 0px' });
    stageObserver.observe(stage);
  }

  last = performance.now();
  requestAnimationFrame(frame);
})();
