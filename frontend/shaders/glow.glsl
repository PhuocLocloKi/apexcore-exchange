// ========================================================
// APEXCORE SOVEREIGN GOLDEN SHADER (frontend/shaders/glow.glsl)
// GLSL Fragment Shader for 3D Diamond Star Optical Sheen
// Founder: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
// ========================================================

precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uGoldColor;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Ánh kim hoàng gia tinh tế
    float glow = 0.05 / (dist + 0.15);
    vec3 color = mix(vec3(0.04, 0.05, 0.07), vec3(0.988, 0.835, 0.208), glow);
    
    gl_FragColor = vec4(color, 1.0);
}
