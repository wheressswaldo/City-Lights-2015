precision highp float;

uniform sampler2D uImage;

varying vec2 vTexCoord;

void main() {
   gl_FragColor = texture2D(uImage, vTexCoord);
}