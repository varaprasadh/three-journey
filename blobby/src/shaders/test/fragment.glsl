
varying vec2 vUv;

uniform sampler2D uWavyTexture;

uniform float uTime;
void main()
{   
    vec4 color = texture2D(uWavyTexture, vUv + sin(uTime * 0.5) * 0.2);
    gl_FragColor = color;
}


