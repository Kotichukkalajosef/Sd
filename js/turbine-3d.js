/**
 * SD ENTERPRISES - 3D Turbomachinery & Thermal Power Plant Suite
 * Powered by Three.js (r128)
 *
 * 1. HERO 3D THERMAL POWER PLANT STATION (#gl, #plant-viewport):
 *    - Full Supercritical Thermal Power Station Complex Floating Seamlessly in Air
 *    - Soft circular terrain with smooth radial alpha falloff (NO BOX, NO CORNERS, NO CLIFFS)
 *    - Realistic crushed-stone equipment pads, concrete foundations, asphalt access roads
 *    - Instanced scatter: organic perimeter rocks, grass tufts, bushes, perimeter trees
 *    - Supercritical boiler island, steam drum, downcomers, ash hopper, coal bunker & conveyors
 *    - Flue gas path: APH, electrostatic precipitators (ESP), ID fans, 125m chimney with flashing beacon
 *    - TG Hall: translucent roof & walls, HP/IP/LP casing train, spinning rotor shaft, crossover pipe,
 *      traveling EOT crane, condenser, deaerator
 *    - Dual natural draft hyperboloid cooling towers with ring stiffeners and live steam plumes
 *    - 220kV switchyard with step-up transformers, busbars, insulators, control building
 *    - Sleek transparent camera navigation bar floating above 3D scene (Overview, Boiler, TG Floor, Chimney, Cooling Towers)
 *    - 360° auto-rotation toggle, TG Hall roof toggle, clean landmark labels toggle
 *    - High-Performance Optimization: COMPLETE STOP of animation & rendering when scrolled out of view!
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
   ENGINE 1: 3D THERMAL POWER PLANT STATION (SEAMLESS FLOATING IN AIR)
   ========================================================================== */
(function () {
  'use strict';

  var W = window, D = document;
  var cv = D.getElementById('gl');
  var viewport = D.getElementById('plant-viewport') || (cv ? cv.parentElement : null);

  if (!cv || !viewport || !W.THREE) return;

  var THREE = W.THREE;

  var R;
  try {
    R = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    R = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: false,
      alpha: true
    });
  }

  if (!R) return;

  R.setClearColor(0x000000, 0);
  R.setPixelRatio(Math.min(W.devicePixelRatio || 1, 1.5));
  R.shadowMap.enabled = true;
  R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.outputEncoding = THREE.sRGBEncoding;
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.2;

  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(42, 1, 0.5, 2000);

  // Lighting
  scene.add(new THREE.HemisphereLight(0xeaf2ff, 0x6a6258, 0.9));

  var sun = new THREE.DirectionalLight(0xfff0d8, 1.25);
  sun.position.set(90, 150, 70);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  var sc = sun.shadow.camera;
  sc.left = -170; sc.right = 170; sc.top = 170; sc.bottom = -170; sc.far = 500;
  scene.add(sun);

  var fill = new THREE.DirectionalLight(0x9db8d8, 0.4);
  fill.position.set(-90, 60, -70);
  scene.add(fill);

  var M = function (c, o) {
    return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.65, metalness: 0.35 }, o || {}));
  };

  function add(g, m, x, y, z, p) {
    var o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    (p || scene).add(o);
    return o;
  }

  function box(w, h, d, x, y, z, c, p, o) {
    return add(new THREE.BoxGeometry(w, h, d), M(c, o), x, y, z, p);
  }

  function cyl(rt, rb, h, x, y, z, c, p, ax, o, seg) {
    var m = add(new THREE.CylinderGeometry(rt, rb, h, seg || 32), M(c, o), x, y, z, p);
    if (ax === 'x') m.rotation.z = Math.PI / 2;
    if (ax === 'z') m.rotation.x = Math.PI / 2;
    return m;
  }

  function pipe(pts, r, c, o) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (pt) { return new THREE.Vector3(pt[0], pt[1], pt[2]); }), false, 'catmullrom', 0.05);
    return add(new THREE.TubeGeometry(curve, 64, r, 12), M(c, o), 0, 0, 0);
  }

  function ring(r, y, x, z, tube, c) {
    var m = add(new THREE.TorusGeometry(r, tube, 8, 40), M(c), x, y, z);
    m.rotation.x = Math.PI / 2;
    return m;
  }

  // Clean landmark labels
  var labels = [];
  var labelsContainer = D.getElementById('plant-3d-labels') || viewport;

  function label(t, x, y, z) {
    var d = D.createElement('div');
    d.className = 'plant-lbl';
    d.textContent = t;
    if (labelsContainer) labelsContainer.appendChild(d);
    labels.push({ d: d, v: new THREE.Vector3(x, y, z) });
  }

  var conc = { roughness: 0.95, metalness: 0 };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  function blob(g, x, y, r, rgb, a) {
    var q = g.createRadialGradient(x, y, 0, x, y, r);
    q.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
    q.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = q;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }

  // ===== SEAMLESS ORGANIC CIRCULAR GROUND (NO BOX, NO CORNERS, NO CLIFF EDGES) =====
  var gCanvas = D.createElement('canvas');
  gCanvas.width = gCanvas.height = 1024;
  var gctx = gCanvas.getContext('2d');
  var gn = 1024, gr = gn / 2;

  // Base grass pattern - rich verdant green grass (NO SAND, NO DIRT PATCHES)
  gctx.fillStyle = '#3f7027';
  gctx.fillRect(0, 0, gn, gn);
  for (var gi = 0; gi < 50; gi++) {
    blob(gctx, rnd(0, gn), rnd(0, gn), rnd(35, 95), Math.random() < 0.5 ? '52,106,36' : '62,122,44', 0.32);
  }
  for (var gj = 0; gj < 26000; gj++) {
    var gx = rnd(0, gn), gy = rnd(0, gn);
    gctx.strokeStyle = 'hsl(' + rnd(72, 108) + ',' + rnd(42, 62) + '%,' + rnd(18, 36) + '%)';
    gctx.lineWidth = rnd(0.8, 1.8);
    gctx.beginPath();
    gctx.moveTo(gx, gy);
    gctx.lineTo(gx + rnd(-2, 2), gy - rnd(2, 7));
    gctx.stroke();
  }
  for (var gk = 0; gk < 16; gk++) {
    blob(gctx, rnd(0, gn), rnd(0, gn), rnd(20, 50), '45,90,30', 0.25);
  }

  // Smooth Radial Alpha Falloff: perimeter fades softly so island floats seamlessly with zero sharp cut
  gctx.globalCompositeOperation = 'destination-in';
  var alphaGrad = gctx.createRadialGradient(gr, gr, gr * 0.65, gr, gr, gr * 0.98);
  alphaGrad.addColorStop(0, 'rgba(0,0,0,1)');
  alphaGrad.addColorStop(0.85, 'rgba(0,0,0,0.85)');
  alphaGrad.addColorStop(0.96, 'rgba(0,0,0,0.22)');
  alphaGrad.addColorStop(1, 'rgba(0,0,0,0)');
  gctx.fillStyle = alphaGrad;
  gctx.beginPath();
  gctx.arc(gr, gr, gr, 0, Math.PI * 2);
  gctx.fill();
  gctx.globalCompositeOperation = 'source-over';

  var groundTex = new THREE.CanvasTexture(gCanvas);
  groundTex.encoding = THREE.sRGBEncoding;

  var groundMat = new THREE.MeshStandardMaterial({
    map: groundTex,
    transparent: true,
    roughness: 0.96,
    metalness: 0,
    depthWrite: false
  });

  // Circular ground disk: radius 125 fits comfortably within viewport without cutting at the bottom
  var groundGeo = new THREE.CircleGeometry(125, 64);
  var groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(5, 0.05, -8);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // High-Fidelity Concrete Floor Texture with Expansion Joint Grid
  function ctex(n, draw) {
    var c = D.createElement('canvas');
    c.width = c.height = n;
    draw(c.getContext('2d'), n);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  var concFloorT = ctex(512, function (g, n) {
    // Crisp industrial concrete floor base color
    g.fillStyle = '#c5c3bc';
    g.fillRect(0, 0, n, n);

    // Fine concrete aggregates and realistic micro-porosity
    for (var i = 0; i < 8000; i++) {
      var lum = Math.random() < 0.5 ? '55,55,55' : '255,255,255';
      g.fillStyle = 'rgba(' + lum + ',' + rnd(0.02, 0.08) + ')';
      g.fillRect(rnd(0, n), rnd(0, n), rnd(1, 3), rnd(1, 3));
    }

    // Concrete expansion joint grid lines (4x4 modular floor panels)
    g.strokeStyle = 'rgba(85, 83, 76, 0.65)';
    g.lineWidth = 2.5;
    g.strokeRect(1, 1, n - 2, n - 2);

    var step = n / 4;
    g.beginPath();
    for (var k = 1; k < 4; k++) {
      g.moveTo(k * step, 0); g.lineTo(k * step, n);
      g.moveTo(0, k * step); g.lineTo(n, k * step);
    }
    g.stroke();

    // Subtle edge highlight on concrete slab panels
    g.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    g.lineWidth = 1;
    for (var py = 0; py < 4; py++) {
      for (var px = 0; px < 4; px++) {
        g.strokeRect(px * step + 2, py * step + 2, step - 4, step - 4);
      }
    }
  });

  var aspT = ctex(256, function (g, n) {
    g.fillStyle = '#34363a';
    g.fillRect(0, 0, n, n);
    for (var i = 0; i < 6000; i++) {
      var l = rnd(25, 75);
      g.fillStyle = 'rgba(' + l + ',' + l + ',' + l + ',' + rnd(0.15, 0.5) + ')';
      g.fillRect(rnd(0, n), rnd(0, n), rnd(1, 2.2), rnd(1, 2.2));
    }
  });

  function tm(t, rx, ry) {
    var c = t.clone();
    c.needsUpdate = true;
    c.repeat.set(rx, ry);
    return new THREE.MeshStandardMaterial({ map: c, roughness: 0.92, metalness: 0.05 });
  }

  // ===== INDUSTRIAL CONCRETE FLOOR FOUNDATION SLABS (ONLY WHEREVER PLANT BUILDINGS ARE) =====
  function concreteFloor(w, d, x, z, h) {
    var thickness = h || 0.38;
    var slab = box(w, thickness, d, x, thickness / 2, z, 0xffffff);
    slab.material = tm(concFloorT, w / 14, d / 14);
    slab.castShadow = true;
    slab.receiveShadow = true;

    // Engineered concrete perimeter curb border
    var curbH = 0.10, curbW = 0.5;
    box(w + curbW * 2, curbH, curbW, x, thickness + curbH / 2, z - d / 2 - curbW / 2, 0x8a8880);
    box(w + curbW * 2, curbH, curbW, x, thickness + curbH / 2, z + d / 2 + curbW / 2, 0x8a8880);
    box(curbW, curbH, d, x - w / 2 - curbW / 2, thickness + curbH / 2, z, 0x8a8880);
    box(curbW, curbH, d, x + w / 2 + curbW / 2, thickness + curbH / 2, z, 0x8a8880);
    return slab;
  }

  // 1. Main Power Generation Floor (TG Hall + Boiler Island + ESP / Flue Gas Path + Chimney Corridor)
  concreteFloor(144, 46, -20, 5, 0.38);

  // 2. Heavy Chimney Stack Reinforced Foundation Plinth
  concreteFloor(22, 22, -86, 13, 0.44);

  // 3. Coal Handling, Bunker Bay & Conveyor Gallery Floor
  concreteFloor(28, 44, -20, 42, 0.38);
  add(new THREE.CylinderGeometry(14.5, 14.5, 0.4, 48), tm(concFloorT, 3, 3), -20, 0.2, 52).castShadow = true;

  // 4. Central Control & Administration Complex Floor
  concreteFloor(36, 26, 22, 40, 0.38);

  // 5. 220kV Switchyard & Step-Up Transformer Heavy Equipment Pad
  concreteFloor(54, 42, 74, 30, 0.38);

  // 6. Natural Draft Cooling Towers Concrete Apron & Water Collection Basins
  concreteFloor(78, 46, 52, -52, 0.38);
  [[34, -52], [70, -52]].forEach(function (t) {
    var p = add(new THREE.CylinderGeometry(17.5, 17.5, 0.45, 48), tm(concFloorT, 4, 4), t[0], 0.225, t[1]);
    p.castShadow = true;
  });

  // Access roads (connecting concrete floors smoothly across the site)
  function road(w, d, x, z) {
    var m = box(w, 0.12, d, x, 0.06, z, 0xffffff);
    m.material = tm(aspT, w / 6, d / 6);
    m.castShadow = false;
  }
  road(160, 7.5, 5, 68);
  road(7.5, 120, 88, -10);
  road(6.5, 22, 22, 60);

  // Check so natural scatter (rocks, bushes, trees) NEVER spawn on top of concrete floors
  function isOnConcreteFloor(x, z) {
    if (x > -96 && x < 56 && z > -22 && z < 30) return true; // Main power block
    if (x > 10 && x < 94 && z > -78 && z < -26) return true; // Cooling towers
    if (x > 44 && x < 104 && z > 6 && z < 54) return true;   // Switchyard
    if (x > -36 && x < -4 && z > 18 && z < 68) return true;  // Coal handling
    if (x > 2 && x < 42 && z > 25 && z < 55) return true;    // Control building
    return false;
  }

  // Instanced natural scatter (rocks, shrubs, trees placed purely within green grass landscape)
  var objD = new THREE.Object3D(), colorC = new THREE.Color();

  function organicSpot(minR, maxR) {
    for (var attempt = 0; attempt < 25; attempt++) {
      var angle = Math.random() * Math.PI * 2;
      var dist = rnd(minR, maxR);
      var x = 5 + Math.cos(angle) * dist;
      var z = -8 + Math.sin(angle) * dist;
      if (!isOnConcreteFloor(x, z)) return [x, z];
    }
    return [5 + Math.cos(angle) * maxR, -8 + Math.sin(angle) * maxR];
  }

  function inst(geo, mat, n, fn, shadow) {
    var m = new THREE.InstancedMesh(geo, mat, n);
    for (var i = 0; i < n; i++) {
      fn(i, m);
      objD.updateMatrix();
      m.setMatrixAt(i, objD.matrix);
    }
    m.castShadow = !!shadow;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  // Scattered rocks (purely on grass)
  var rk = inst(new THREE.DodecahedronGeometry(1, 0), M(0xffffff, { roughness: 0.95, metalness: 0 }), 280, function (i, m) {
    var sp = organicSpot(62, 110), s = rnd(0.3, 1.3);
    objD.position.set(sp[0], -0.2 + s * 0.3, sp[1]);
    objD.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
    objD.scale.set(s * rnd(0.9, 1.3), s * rnd(0.5, 0.9), s * rnd(0.9, 1.3));
    m.setColorAt(i, colorC.setHSL(rnd(0.06, 0.12), rnd(0, 0.1), rnd(0.35, 0.65)));
  }, true);
  if (rk.instanceColor) rk.instanceColor.needsUpdate = true;

  // Scattered bushes (purely on grass)
  var bs = inst(new THREE.IcosahedronGeometry(1, 1), M(0xffffff, { roughness: 1, metalness: 0 }), 75, function (i, m) {
    var sp = organicSpot(68, 112), s = rnd(1, 2.0);
    objD.position.set(sp[0], -0.2 + s * 0.5, sp[1]);
    objD.rotation.set(0, rnd(0, 3), 0);
    objD.scale.set(s * rnd(1, 1.4), s * rnd(0.6, 1), s * rnd(1, 1.4));
    m.setColorAt(i, colorC.setHSL(rnd(0.22, 0.32), rnd(0.4, 0.6), rnd(0.14, 0.28)));
  }, true);
  if (bs.instanceColor) bs.instanceColor.needsUpdate = true;

  // Perimeter trees (purely on grass)
  for (var trI = 0; trI < 24; trI++) {
    var trSp = organicSpot(75, 114), ts = rnd(0.8, 1.4), thh = rnd(0.2, 0.32);
    cyl(0.35 * ts, 0.5 * ts, 3.4 * ts, trSp[0], -0.2 + 1.7 * ts, trSp[1], 0x5a4028, null, '', { roughness: 1, metalness: 0 }, 8);
    for (var k = 0; k < 3; k++) {
      add(new THREE.IcosahedronGeometry(rnd(1.8, 2.5) * ts, 1), M(new THREE.Color().setHSL(thh, 0.5, rnd(0.16, 0.26)), { roughness: 1, metalness: 0 }), trSp[0] + rnd(-1, 1) * ts, -0.2 + (3.6 + k * 1.3) * ts, trSp[1] + rnd(-1, 1) * ts);
    }
  }

  // ===== BOILER ISLAND =====
  var steel = 0x55677a, hs = 0x3b6aa0;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (pair) {
    box(1.3, 60, 1.3, -20 + pair[0] * 10, 30, pair[1] * 10, steel);
  });

  for (var by = 8; by <= 56; by += 8) {
    box(21, 0.7, 0.7, -20, by, -10, steel);
    box(21, 0.7, 0.7, -20, by, 10, steel);
    box(0.7, 0.7, 21, -30, by, 0, steel);
    box(0.7, 0.7, 21, -10, by, 0, steel);
    if (by % 16 === 8) {
      box(23, 0.25, 23, -20, by, 0, 0x6c7177, null, { metalness: 0.6 });
    }
  }

  box(14, 40, 14, -20, 28, 0, 0xb9c0c6, null, { roughness: 0.5, metalness: 0.5 });
  for (var fy = 10; fy < 48; fy += 6) {
    box(14.6, 0.5, 14.6, -20, fy, 0, 0x7d868e);
  }
  box(14.4, 6, 14.4, -20, 10, 0, 0xff6a1a, null, { emissive: 0xff4400, emissiveIntensity: 0.9 });
  box(14.4, 1.5, 14.4, -20, 48.7, 0, 0x7d868e);

  var ashHopper = add(new THREE.CylinderGeometry(1.5, 10, 6, 4), M(0x5b5551), -20, 5, 0);
  ashHopper.rotation.y = Math.PI / 4;

  for (var bi = 0; bi < 4; bi++) {
    cyl(0.55, 0.55, 2.2, -26 + bi * 4, 8, -7.4, 0x3a3d42, null, 'z');
  }

  // Steam drum & downcomers
  cyl(2.3, 2.3, 18, -20, 59, 0, 0xcfd6dc, null, 'z', { metalness: 0.7, roughness: 0.35 });
  [-8, 8].forEach(function (z) {
    cyl(2.35, 2.35, 0.4, -20, 59, z, 0x333b44, null, 'z');
  });
  for (var di = -1; di <= 1; di++) {
    cyl(0.45, 0.45, 50, -28.3, 33, di * 4.5, 0x9aa5b0);
  }

  // Main steam pipe
  pipe([[-20, 60, 0], [-13, 63, 0], [-3, 59, 0], [0, 44, 0], [5, 28, 0], [8, 19, 0], [10.5, 15.8, 0]], 0.6, 0xcfd4d9, { metalness: 0.8, roughness: 0.3 });

  box(6, 34, 12, -7, 28, 0, 0xaab2b9);
  [44, 36, 28, 20].forEach(function (y) {
    box(6.3, 3, 12.3, -7, y, 0, 0xb4552e, null, { roughness: 0.8 });
  });
  cyl(2.8, 2.8, 5, -7, 5, 3.5, 0x4f7ea8);
  cyl(2.8, 2.8, 5, -7, 5, -3.5, 0x4f7ea8);

  // Stair tower
  box(4, 58, 4, -34, 29, -13, steel);
  for (var sy = 4; sy < 58; sy += 6) {
    box(5, 0.3, 5, -34, sy, -13, 0xd9a91f);
  }

  // Coal handling gallery
  [-1, 1].forEach(function (a) {
    [-1, 1].forEach(function (b) {
      box(0.9, 38, 0.9, -20 + a * 4.2, 19, 20 + b * 4.2, steel);
    });
  });
  box(10, 10, 10, -20, 42, 20, 0x8a7a62);
  var cbCone = add(new THREE.CylinderGeometry(5, 1, 4, 4), M(0x6e5f4a), -20, 35, 20);
  cbCone.rotation.y = Math.PI / 4;

  var convAng = Math.atan2(36, 29);
  var conv = box(2.6, 1.8, Math.hypot(36, 29), -20, 22, 34, 0x5d7f6c);
  conv.rotation.x = convAng;

  for (var ci = 0; ci <= 5; ci++) {
    var ct = ci / 5, cy = 2 + 36 * ct;
    box(0.4, cy, 0.4, -20, cy / 2 - 1.2, 50 - 30 * ct, steel);
  }
  add(new THREE.ConeGeometry(11, 9, 32), M(0x1b1b1d, { roughness: 1, metalness: 0 }), -20, 4.5, 56);

  // ===== GAS PATH (APH -> ESP -> ID Fans -> Chimney) =====
  box(3, 3, 13, -7, 5, 6.5, 0x8c97a1);
  box(30, 3, 3, -22, 5, 13, 0x8c97a1);
  [0, 1, 2].forEach(function (i) {
    var x = -38 - i * 10;
    box(8.2, 13, 15, x, 10, 13, 0x95a2ab);
    for (var j = -2; j <= 2; j++) {
      box(0.5, 2.5, 0.5, x + j * 1.4, 17.4, 13, 0x333);
    }
    [-1, 1].forEach(function (a) {
      [-1, 1].forEach(function (b) {
        var espCone = add(new THREE.CylinderGeometry(0.6, 2.2, 3.4, 4), M(0x6f7a83), x + a * 2, 1.7, 13 + b * 4);
        espCone.rotation.y = Math.PI / 4;
      });
    });
  });
  box(14, 3, 3, -72, 5, 13, 0x8c97a1);
  cyl(2.4, 2.4, 2.2, -66, 4.5, 6.5, 0x2c6aa0, null, 'z');
  cyl(2.4, 2.4, 2.2, -66, 4.5, 19.5, 0x2c6aa0, null, 'z');

  // ===== 125M CHIMNEY WITH AVIATION BEACON =====
  var CX = -86, CZ = 13, H = 125, seg = 10;
  function rAt(y) { return 5.8 - (y / H) * 3; }

  for (var chi = 0; chi < seg; chi++) {
    var chh = H / seg;
    add(new THREE.CylinderGeometry(rAt((chi + 1) * chh), rAt(chi * chh), chh, 40), M(chi % 2 ? 0xe9e9e6 : 0xc42b1f, { roughness: 0.85, metalness: 0.02 }), CX, chh * chi + chh / 2, CZ);
  }
  [28, 58, 88, H - 2].forEach(function (y) {
    cyl(rAt(y) + 1.4, rAt(y) + 1.4, 0.3, CX, y, CZ, 0x555a60);
    ring(rAt(y) + 1.4, y + 1, CX, CZ, 0.07, 0xcccccc);
  });
  cyl(3.4, 3.4, 1.2, CX, H + 0.2, CZ, 0x222, null);
  cyl(0.07, 0.07, 7, CX, H + 4.5, CZ, 0xcccccc, null);
  box(8, 3, 8, CX, 1.5, CZ, 0x8a8f94);
  box(0.7, H * 0.92, 0.15, CX + rAt(60) + 0.1, H * 0.46, CZ, 0x333);

  var beacon = add(new THREE.SphereGeometry(0.8, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff2020 }), CX, H + 1.6, CZ);

  // ===== TG HALL =====
  var hall = new THREE.Group();
  scene.add(hall);

  var roofMat = M(0x8fb0cc, { transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide });
  var wallMat = M(0x9ec3e0, { transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });

  var roof = new THREE.Mesh(new THREE.BoxGeometry(43, 0.8, 23), roofMat);
  roof.position.set(24, 30, 0);
  hall.add(roof);

  var rg = new THREE.Mesh(new THREE.BoxGeometry(43, 2, 5), roofMat);
  rg.position.set(0, 1.4, 0);
  roof.add(rg);

  [[24, 15, -11, 43, 30, 0.3], [24, 15, 11, 43, 30, 0.3], [3, 15, 0, 0.3, 30, 23], [45, 15, 0, 0.3, 30, 23]].forEach(function (a) {
    var w = new THREE.Mesh(new THREE.BoxGeometry(a[3], a[4], a[5]), wallMat);
    w.position.set(a[0], a[1], a[2]);
    hall.add(w);
  });

  for (var ti = 0; ti <= 6; ti++) {
    [-10.5, 10.5].forEach(function (z) {
      box(0.9, 30, 0.9, 3.5 + ti * 7, 15, z, hs);
    });
    box(0.7, 0.7, 21, 3.5 + ti * 7, 29.3, 0, hs);
    var t1 = box(0.4, 0.4, 11.7, 3.5 + ti * 7, 28.2, -5.4, hs);
    t1.rotation.x = 0.45;
    var t2 = box(0.4, 0.4, 11.7, 3.5 + ti * 7, 28.2, 5.4, hs);
    t2.rotation.x = -0.45;
  }

  box(41, 1, 20, 24, 10, 0, 0xa09d96, null, { roughness: 0.8 });
  for (var pi = 0; pi < 9; pi++) {
    [-8, 8].forEach(function (z) {
      box(1.3, 9.5, 1.3, 6 + pi * 4.5, 4.75, z, 0x8d8a84);
    });
  }
  box(42, 0.2, 21, 24, 0.1, 0, 0x7c7a75, null, conc);

  // Turbine Train & Casing
  var AY = 14;
  function casing(x, len, r, c) {
    cyl(r, r, len, x, AY, 0, c, null, 'x', { metalness: 0.5, roughness: 0.45 });
    [-1, 1].forEach(function (s) {
      cyl(r * 1.06, r * 1.06, 0.4, x + s * len / 2, AY, 0, 0x2f3640, null, 'x');
    });
    [-1, 0, 1].forEach(function (k) {
      cyl(r * 1.04, r * 1.04, 0.22, x + k * len * 0.27, AY, 0, 0x333b44, null, 'x');
    });
    box(len * 0.7, AY - 10.5 - r * 0.4, r * 1.2, x, (AY + 10.5 - r * 0.4) / 2 - 0.4, 0, 0x39424d);
    cyl(r * 0.55, r * 0.55, len * 0.8, x, AY + r * 0.8, 0, c, null, 'x');
  }

  casing(10.5, 5, 1.7, 0xc7452f);
  casing(17, 6, 2.1, 0xd0572f);
  casing(25, 8, 3.3, 0x9fb3c6);
  casing(35, 9, 2.5, 0x2f6f9f);
  casing(42, 3, 1.4, 0x9aa3ab);

  cyl(1.1, 1.1, 7, 35, AY + 2.9, 0, 0x8896a3, null, 'x');
  [13.5, 20.5, 29.8, 40.6].forEach(function (x) {
    box(1.3, AY - 10.5 - 0.5, 2.2, x, (AY + 10.5) / 2 - 0.3, 0, 0x2f3640);
  });

  // Spinning turbine rotor inside TG hall
  var rot = new THREE.Group();
  rot.position.set(0, AY, 0);
  scene.add(rot);
  cyl(0.55, 0.55, 36, 25, 0, 0, 0xe2e6ea, rot, 'x', { metalness: 0.9, roughness: 0.2 });
  [13.5, 20.5, 29.8, 40.6].forEach(function (x) {
    cyl(1.25, 1.25, 0.5, x, 0, 0, 0xf0b323, rot, 'x');
    box(0.6, 0.3, 2.4, x, 0, 0, 0xff3b30, rot);
    box(0.6, 2.4, 0.3, x, 0, 0, 0x111, rot);
  });

  pipe([[17, 16.2, 0], [17, 19.5, 0], [25, 20.5, 0], [25, 17.4, 0]], 0.5, 0xcfd4d9, { metalness: 0.8, roughness: 0.3 });

  box(7, 3, 6, 25, 7.8, 0, 0x8a95a1);
  cyl(3.2, 3.2, 14, 25, 4.5, 0, 0x7f8f9c, null, 'x');
  [-1, 1].forEach(function (z) {
    cyl(0.65, 0.65, 8, 25, 2, z * 7.5, 0x2c6aa0, null, 'z');
  });

  cyl(1.7, 1.7, 12, 20, 25, -7.5, 0xb6c0c8, null, 'x');
  for (var fwi = 0; fwi < 3; fwi++) {
    cyl(0.9, 0.9, 7, 12 + fwi * 5, 12, -7.5, 0xa0abb5, null, 'x');
  }
  for (var pi2 = 0; pi2 < 3; pi2++) {
    cyl(0.8, 0.8, 1.6, 32 + pi2 * 3, 1.4, -6, 0x2f6f9f, null, 'z');
    cyl(0.5, 0.5, 1.2, 32 + pi2 * 3, 1.4, -7.6, 0xbbbbbb, null, 'z');
  }
  pipe([[21, 25, -7.5], [22, 16, -8], [28, 6, -8], [34, 2, -6]], 0.35, 0x3c9a63);
  pipe([[18, 6, 0], [10, 6, 3], [6, 12, -3], [8.5, 17, -1.5]], 0.3, 0xd9a43a);

  // Traveling EOT Crane
  var crane = new THREE.Group();
  crane.position.set(10, 0, 0);
  scene.add(crane);
  box(1, 1.2, 22, 0, 26.5, 0, 0xe8a317, crane);
  box(2.5, 0.8, 2.5, 0, 25.2, 0, 0x222, crane);
  box(0.15, 6, 0.15, 0, 22, 0, 0x111, crane);
  box(1.2, 0.6, 1.2, 0, 19, 0, 0xe8a317, crane);
  box(43, 0.5, 0.6, 24, 27.4, -10.3, 0x555);
  box(43, 0.5, 0.6, 24, 27.4, 10.3, 0x555);

  // ===== COOLING TOWERS =====
  var towers = [[34, -52], [70, -52]];
  function buildTower(tx, tz) {
    var pts = [];
    for (var i = 0; i <= 40; i++) {
      var y = 5 + i * 47 / 40;
      pts.push(new THREE.Vector2(Math.sqrt(64 + 0.081 * Math.pow(y - 36, 2)), y));
    }
    var m = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), M(0xcfcabd, { roughness: 0.95, metalness: 0, side: THREE.DoubleSide }));
    m.position.set(tx, 0, tz);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);

    [14, 24, 34, 44].forEach(function (y) {
      var r = Math.sqrt(64 + 0.081 * Math.pow(y - 36, 2));
      ring(r, y, tx, tz, 0.18, 0xb5afa2);
    });
    ring(8.9, 52, tx, tz, 0.35, 0x9c9c96);

    var dk = new THREE.Mesh(new THREE.CylinderGeometry(11.9, 11.9, 5, 48, 1, true), M(0x1d2226, { roughness: 1, metalness: 0, side: THREE.DoubleSide }));
    dk.position.set(tx, 2.5, tz);
    scene.add(dk);

    for (var ci = 0; ci < 36; ci++) {
      var a = ci / 36 * Math.PI * 2;
      cyl(0.35, 0.35, 5.2, tx + Math.cos(a) * 11.9, 2.6, tz + Math.sin(a) * 11.9, 0xb0b0aa, null, '', conc, 8);
    }
    cyl(14, 14, 0.5, tx, 0.2, tz, 0x2f86a8, null, '', { roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.9 }, 48);
    ring(14, 0.6, tx, tz, 0.3, 0x888888);
  }
  towers.forEach(function (t) { buildTower(t[0], t[1]); });

  pipe([[25, 1.3, -9], [27, 1.3, -30], [34, 1.3, -42]], 0.9, 0x2f86b8);
  pipe([[27, 1.3, -30], [55, 1.3, -38], [70, 1.3, -42]], 0.9, 0x2f86b8);

  // ===== 220kV SWITCHYARD & TRANSFORMERS =====
  for (var si = 0; si < 3; si++) {
    var sx = 58 + si * 12;
    box(5, 5, 7, sx, 2.5, 36, 0x7f9186, null, { roughness: 0.6 });
    for (var sk = -1; sk <= 1; sk++) {
      cyl(0.35, 0.35, 3, sx + sk * 1.6, 6.4, 36, 0xb3622d);
    }
    for (var sk2 = -2; sk2 <= 2; sk2++) {
      box(0.2, 2, 5, sx - 3.1, 3, 36 + sk2 * 1.2, 0x555a60);
    }
  }

  for (var gi = 0; gi < 3; gi++) {
    var gx = 56 + gi * 14;
    [-1, 1].forEach(function (s) {
      box(0.6, 22, 0.6, gx, 11, 22 + s * 4, 0x9aa3ab);
    });
    box(0.6, 0.6, 8.6, gx, 21, 22, 0x9aa3ab);
    box(0.6, 0.6, 8.6, gx, 17, 22, 0x9aa3ab);
    for (var gk = -1; gk <= 1; gk++) {
      cyl(0.3, 0.3, 2.2, gx, 19, 22 + gk * 3, 0xd8cfc0);
    }
  }
  pipe([[56, 21, 18], [64, 19, 20], [72, 21, 18], [80, 19, 22], [96, 22, 22]], 0.12, 0x222);

  // Administration Building
  box(22, 10, 12, 22, 5, 40, 0xe6dcc6, null, { roughness: 0.9, metalness: 0 });
  box(22.4, 1, 12.4, 22, 10.4, 40, 0x8a4b3a);
  for (var wi = 0; wi < 9; wi++) {
    box(1.6, 2.2, 0.1, 13 + wi * 2.2, 6, 33.95, 0x6cc3f5, null, { emissive: 0x1a4a6a });
  }

  // ===== LIVE STEAM / SMOKE PARTICLE EMITTERS =====
  var steamTex = (function () {
    var c = D.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  var parts = [];
  function createEmitter(x, y, z, col, rate, vy, sp, grow, life, s) {
    return { x: x, y: y, z: z, col: col, rate: rate, vy: vy, sp: sp, grow: grow, life: life, s: s, t: 0 };
  }

  var ems = [
    createEmitter(CX, H + 1, CZ, 0x8a8f95, 0.05, 0.22, 0.04, 0.07, 300, 3),
    createEmitter(towers[0][0], 53, towers[0][1], 0xf5f8fb, 0.04, 0.3, 0.06, 0.14, 240, 6),
    createEmitter(towers[1][0], 53, towers[1][1], 0xf5f8fb, 0.04, 0.3, 0.06, 0.14, 240, 6)
  ];

  function spawnParticle(e) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, color: e.col, transparent: true, opacity: 0.5, depthWrite: false }));
    s.position.set(e.x + (Math.random() - 0.5) * 2, e.y, e.z + (Math.random() - 0.5) * 2);
    s.scale.setScalar(e.s);
    s.userData = { e: e, a: 0, vx: 0.15 + Math.random() * 0.05, vz: (Math.random() - 0.5) * e.sp };
    scene.add(s);
    parts.push(s);
  }

  // ===== CLEAN, ESSENTIAL LANDMARK LABELS =====
  label('Chimney (125 m)', CX, H + 4, CZ);
  label('Boiler Island', -20, 66, 0);
  label('TG Hall', 25, 36, 0);
  label('Cooling Towers', 52, 60, -52);
  label('220kV Switchyard', 70, 26, 36);
  label('Coal Handling', -20, 36, 56);

  // ===== CAMERA, VIEWS & CLICK-TO-ZOOM ZONES =====
  var TAU = Math.PI * 2;
  // Centered rotation axis: rotates around the exact central point (-6, 22, -2) with compact scale (rad = 425)
  var tgt = new THREE.Vector3(-6, 22, -2), th = 0.9, ph = 1.18, rad = 425;
  var gt = tgt.clone(), gth = th, gph = ph, grad = rad, auto = true;

  function setView(v) {
    gt.set(v[0][0], v[0][1], v[0][2]);
    gth = v[1] + TAU * Math.round((th - v[1]) / TAU);
    gph = v[2];
    grad = v[3];
  }

  var OV = [[-6, 22, -2], 0.9, 1.18, 425];

  var Z = {
    chimney: {
      n: 'Chimney (125 m Stack)',
      d: '125-meter multi-tier reinforced concrete chimney with aviation safety bands, inspection platforms, and high-intensity flashing beacon.',
      b: [-93, -79, 0, 135, 6, 20],
      v: [[-86, 62, 13], 0.45, 1.25, 195]
    },
    esp: {
      n: 'ESP, ID Fans & Flue Ducts',
      d: 'Electrostatic precipitators with pyramidal ash hoppers and induced-draft centrifugal fans delivering flue gas to the stack.',
      b: [-70, -30, 0, 22, 3, 23],
      v: [[-52, 12, 13], 0.65, 1.15, 100]
    },
    tg: {
      n: 'TG Hall (Turbine Generator Floor)',
      d: 'Turbine-Generator hall housing HP, IP, and double-flow LP turbine casings, generator rotor, overhead EOT crane, and condenser bay below.',
      b: [2, 46, 0, 33, -12, 12],
      v: [[26, 16, 0], -0.5, 1.05, 75]
    },
    boiler: {
      n: 'Supercritical Boiler Island',
      d: 'Supercritical steam generator structure, furnace, steam drum at 60m elevation, downcomers, and main high-pressure steam line.',
      b: [-36, -3, 0, 66, -16, 12],
      v: [[-18, 32, 0], 0.65, 1.2, 125]
    },
    coal: {
      n: 'Coal Handling Plant',
      d: 'Conveyor gallery transporting pulverized coal from the storage yard up into the boiler coal bunkers.',
      b: [-27, -13, 0, 48, 14, 66],
      v: [[-20, 20, 40], -0.6, 1.2, 105]
    },
    ct1: {
      n: 'Natural Draft Cooling Towers',
      d: 'Dual hyperboloid natural draft cooling towers with ring stiffeners and cold water collection basin.',
      b: [17, 87, 0, 56, -69, -35],
      v: [[52, 28, -52], -0.5, 1.25, 160]
    },
    sw: {
      n: '220kV Switchyard & GT Transformers',
      d: 'Generator Step-Up (GSU) transformers, SF6 switchgear skids, high-voltage busbars, and grid transmission gantries.',
      b: [48, 102, 0, 26, 9, 51],
      v: [[74, 12, 30], 0.5, 1.15, 105]
    },
    ctl: {
      n: 'Control & Administration Complex',
      d: 'Central control room (CCR) with advanced DCS panels overseeing thermal plant automation and plant auxiliaries.',
      b: [10, 34, 0, 13, 33, 47],
      v: [[22, 5, 40], 0.6, 1.2, 55]
    }
  };

  var ZK = Object.keys(Z);

  // Floating Info Card for Interactive Details (positioned bottom-right away from text)
  var card = D.getElementById('plant-info-card');
  var cT = card ? card.querySelector('.plant-info-title') : null;
  var cD = card ? card.querySelector('.plant-info-desc') : null;
  var cB = card ? card.querySelector('.plant-info-back') : null;
  var cur = null;

  function focusZone(k) {
    cur = k;
    var z = Z[k];
    if (!z) return;
    setView(z.v);
    if (card && cT && cD) {
      cT.textContent = z.n;
      cD.textContent = z.d;
      card.style.display = 'block';
    }
  }

  function overview() {
    cur = null;
    setView(OV);
    if (card) card.style.display = 'none';
    viewButtons.forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-view') === 'over');
    });
  }

  if (cB) cB.addEventListener('click', overview);

  // View switch buttons
  var viewButtons = D.querySelectorAll('.plant-btn[data-view]');
  viewButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var key = btn.getAttribute('data-view');
      viewButtons.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');

      if (key === 'over') overview();
      else if (key === 'boiler') focusZone('boiler');
      else if (key === 'tg') focusZone('tg');
      else if (key === 'stack') focusZone('chimney');
      else if (key === 'ct') focusZone('ct1');
    });
  });

  // 360° Auto-rotation toggle
  var rotBtn = D.getElementById('plant-btn-rot');
  if (rotBtn) {
    rotBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      auto = !auto;
      rotBtn.classList.toggle('on', auto);
      rotBtn.setAttribute('title', 'Toggle 360° Auto-Rotation (' + (auto ? 'On' : 'Off') + ')');
      rotBtn.setAttribute('data-tip', '360°: ' + (auto ? 'On' : 'Off'));
    });
  }

  // Roof toggle
  var roofOn = true;
  var roofBtn = D.getElementById('plant-btn-roof');
  if (roofBtn) {
    roofBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      roofOn = !roofOn;
      roof.visible = roofOn;
      roofBtn.classList.toggle('on', roofOn);
      roofBtn.setAttribute('title', 'Toggle TG Hall Roof (' + (roofOn ? 'On' : 'Off') + ')');
      roofBtn.setAttribute('data-tip', 'Roof: ' + (roofOn ? 'On' : 'Off'));
    });
  }

  // Labels toggle
  var labOn = true;
  var labBtn = D.getElementById('plant-btn-lab');
  if (labBtn) {
    labBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      labOn = !labOn;
      labBtn.classList.toggle('on', labOn);
      labBtn.setAttribute('title', 'Toggle Landmark Labels (' + (labOn ? 'On' : 'Off') + ')');
      labBtn.setAttribute('data-tip', 'Labels: ' + (labOn ? 'On' : 'Off'));
      labels.forEach(function (l) {
        l.d.style.display = labOn ? '' : 'none';
      });
    });
  }

  // Raycasting for click-to-zoom directly on 3D modules
  var rc = new THREE.Raycaster(), nd = new THREE.Vector2();
  rc.camera = cam;
  var pickList = null;

  function pickZone(e) {
    if (!pickList) {
      pickList = [];
      scene.traverse(function (o) {
        if (o.isMesh && !o.isInstancedMesh && o !== groundMesh) pickList.push(o);
      });
    }
    var rect = cv.getBoundingClientRect();
    nd.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    rc.setFromCamera(nd, cam);
    var hits = rc.intersectObjects(pickList, false);
    for (var h = 0; h < hits.length; h++) {
      var p = hits[h].point, m = 1.5;
      for (var k = 0; k < ZK.length; k++) {
        var b = Z[ZK[k]].b;
        if (p.x > b[0] - m && p.x < b[1] + m && p.y > b[2] - m && p.y < b[3] + m && p.z > b[4] - m && p.z < b[5] + m) {
          return ZK[k];
        }
      }
    }
    return null;
  }

  // Pointer drag, pan & click handling
  var drag = 0, px = 0, py = 0, sx = 0, sy = 0, pan = false, hv = 0;
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  cv.addEventListener('pointerdown', function (e) {
    drag = 1;
    pan = (e.button === 2 || e.shiftKey);
    px = sx = e.clientX;
    py = sy = e.clientY;
    try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    viewport.style.cursor = 'grabbing';
  });

  cv.addEventListener('pointerup', function (e) {
    drag = 0;
    try { cv.releasePointerCapture(e.pointerId); } catch (_) {}
    viewport.style.cursor = 'grab';

    if (e.button === 0 && Math.hypot(e.clientX - sx, e.clientY - sy) < 6) {
      var k = pickZone(e);
      if (k && k !== cur) {
        focusZone(k);
      }
    }
  });

  cv.addEventListener('pointercancel', function () {
    drag = 0;
    viewport.style.cursor = 'grab';
  });

  cv.addEventListener('pointermove', function (e) {
    if (!drag) {
      if (e.pointerType === 'mouse' && performance.now() - hv > 70) {
        hv = performance.now();
        var hit = pickZone(e);
        viewport.style.cursor = hit ? 'pointer' : 'grab';
      }
      return;
    }
    var dx = e.clientX - px;
    var dy = e.clientY - py;
    px = e.clientX;
    py = e.clientY;

    if (pan) {
      var k = grad * 0.0016;
      var r = new THREE.Vector3();
      cam.getWorldDirection(r);
      r.cross(new THREE.Vector3(0, 1, 0)).normalize();
      gt.addScaledVector(r, -dx * k);
      gt.y += dy * k;
    } else {
      gth -= dx * 0.006;
      gph = Math.min(1.5, Math.max(0.15, gph - dy * 0.006));
    }
  });

  cv.addEventListener('wheel', function (e) {
    e.preventDefault();
    grad = Math.min(520, Math.max(15, grad * (1 + e.deltaY * 0.001)));
  }, { passive: false });

  var pd = 0;
  cv.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2) {
      var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (pd) grad = Math.min(520, Math.max(15, grad * pd / d));
      pd = d;
    }
  }, { passive: true });

  cv.addEventListener('touchend', function () { pd = 0; }, { passive: true });

  // Sizing bounded to viewport
  function onResize() {
    var w = viewport.clientWidth || 600;
    var h = viewport.clientHeight || 450;
    R.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }

  W.addEventListener('resize', onResize);
  if ('ResizeObserver' in W && viewport) {
    new ResizeObserver(onResize).observe(viewport);
  }
  setTimeout(onResize, 50);

  // ===== COMPLETE STOP VISIBILITY OBSERVER: NO RENDERING WHEN SCROLLED AWAY =====
  var clk = new THREE.Clock();
  var isRunning = false;
  var animId = null;

  function loop() {
    if (!isRunning) return;
    animId = requestAnimationFrame(loop);

    var dt = clk.getDelta();
    var t = clk.elapsedTime;

    tgt.lerp(gt, 0.06);
    th += (gth - th) * 0.06;
    ph += (gph - ph) * 0.06;
    rad += (grad - rad) * 0.06;

    cam.position.set(
      tgt.x + rad * Math.sin(ph) * Math.sin(th),
      tgt.y + rad * Math.cos(ph),
      tgt.z + rad * Math.sin(ph) * Math.cos(th)
    );
    cam.lookAt(tgt);

    if (auto && !drag) gth += dt * 0.15;

    rot.rotation.x += dt * 14;
    crane.position.x = 24 + Math.sin(t * 0.25) * 14;
    beacon.material.color.setHex(Math.sin(t * 3) > 0 ? 0xff2020 : 0x330000);

    // Live steam & smoke particles (rate limited)
    ems.forEach(function (e) {
      e.t += e.rate * 60 * dt;
      while (e.t > 1) {
        e.t -= 1;
        if (parts.length < 40) spawnParticle(e);
      }
    });

    for (var i = parts.length - 1; i >= 0; i--) {
      var s = parts[i];
      var u = s.userData;
      u.a++;
      s.position.x += u.vx;
      s.position.y += u.e.vy;
      s.position.z += u.vz;
      s.scale.setScalar(s.scale.x + u.e.grow);
      s.material.opacity = 0.5 * (1 - u.a / u.e.life);
      if (u.a >= u.e.life) {
        scene.remove(s);
        s.material.dispose();
        parts.splice(i, 1);
      }
    }

    // Project 3D labels safely bounded within viewport (never colliding with left text)
    if (labOn && labelsContainer) {
      var vw = viewport.clientWidth;
      var vh = viewport.clientHeight;
      for (var li = 0; li < labels.length; li++) {
        var l = labels[li];
        var p = l.v.clone().project(cam);
        if (p.z > 1 || p.z < -1 || p.x < -0.92 || p.x > 0.92 || p.y < -0.92 || p.y > 0.92) {
          l.d.style.display = 'none';
        } else {
          l.d.style.display = '';
          l.d.style.left = ((p.x * 0.5 + 0.5) * vw) + 'px';
          l.d.style.top = ((-p.y * 0.5 + 0.5) * vh) + 'px';
        }
      }
    }

    R.render(scene, cam);
  }

  function startLoop() {
    if (isRunning) return;
    isRunning = true;
    clk.getDelta(); // flush delta so no time jump
    animId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (!isRunning) return;
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  if ('IntersectionObserver' in W && viewport) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.05, rootMargin: '50px' });
    observer.observe(viewport);
  } else {
    startLoop();
  }
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
