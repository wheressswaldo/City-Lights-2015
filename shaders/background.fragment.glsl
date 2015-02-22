precision highp float;

uniform sampler2D uImage;

varying vec2 vTexCoord;

void main() {
    vec4 val = texture2D(uImage, vTexCoord);
    if (val.a > 0.5) {
        gl_FragColor = val;
    } else {
        discard;
    }
   //gl_FragColor = texture2D(uImage, vTexCoord);
}