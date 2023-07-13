varying vec2 vUV;

uniform sampler2D textureSampler;

void main() 
{
    vec4 color = texture2D(textureSampler,  vUV);
    float luminance = dot(color.rgb, vec3(0.3, 0.59, 0.11));
    vec3 blackAndWhite = vec3(luminance, luminance, luminance);

    gl_FragColor = vec4(blackAndWhite, 1.);
}