attribute float aRandom;

varying float vRandom;

uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;


varying float vElevation;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);


    float elevation = sin(position.x * uFrequency.x + uTime * 20.0) * 0.1;
    elevation += sin(position.y * uFrequency.y + uTime) * 0.1;
    modelPosition.z += elevation;

    vec4 viewPostion = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPostion;

    vRandom = aRandom;

    vUv = uv;

    vElevation = elevation;

}