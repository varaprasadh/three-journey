varying vec2 vUv;
varying float vElevation;

void main()
{

    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation = step(0.4, max(abs(uv.x-0.5), abs(uv.y-0.5)));

    modelPosition.z += elevation;
 
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vUv = uv;
    vElevation = elevation;

}

