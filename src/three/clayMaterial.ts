import * as THREE from 'three'

/**
 * Matte modelling-clay material.
 * A physical material with soft sheen, plus a procedural micro-surface computed in the
 * fragment shader from object-space noise: fine grain, tiny pits and soft ridges, bumped
 * through screen-space derivatives so no UVs or textures are needed.
 */

const NOISE = /* glsl */ `
vec3 clay_mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 clay_mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 clay_perm(vec4 x){return clay_mod289(((x*34.0)+1.0)*x);}
vec4 clay_tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float clay_snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=clay_mod289(i);
  vec4 p=clay_perm(clay_perm(clay_perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=clay_tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
vec3 clay_perturb(vec3 surfPos, vec3 surfNorm, float h, float face){
  vec3 sx=dFdx(surfPos);vec3 sy=dFdy(surfPos);
  vec3 r1=cross(sy,surfNorm);vec3 r2=cross(surfNorm,sx);
  float det=dot(sx,r1)*face;
  vec3 grad=sign(det)*(dFdx(h)*r1+dFdy(h)*r2);
  return normalize(abs(det)*surfNorm-grad);
}
`

export function createClayMaterial(color: THREE.ColorRepresentation) {
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.86,
    metalness: 0,
    sheen: 0.55,
    sheenRoughness: 0.85,
    sheenColor: new THREE.Color('#ffffff'),
    specularIntensity: 0.35,
    vertexColors: true,
  })

  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vClayPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvClayPos = position;')

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vClayPos;\n${NOISE}`)
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        vec3 cp = vClayPos;
        float clayH = clay_snoise(cp * 7.0) * 0.6
                    + clay_snoise(cp * 22.0) * 0.16
                    + clay_snoise(cp * 64.0) * 0.045;
        // the odd pit, like an air pocket or a fingernail mark
        float pits = smoothstep(0.78, 0.97, clay_snoise(cp * 13.0 + 3.1));
        clayH -= pits * 0.45;
        roughnessFactor = clamp(roughnessFactor + clayH * 0.05 + pits * 0.08, 0.0, 1.0);`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        normal = clay_perturb(-vViewPosition, normal, clayH * 0.0026, faceDirection);`,
      )
  }
  mat.customProgramCacheKey = () => 'mango-clay-v1'
  return mat
}
