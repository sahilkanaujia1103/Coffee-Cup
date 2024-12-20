varying vec2 vUv;
uniform sampler2D uPerlinTexture;
uniform float uTime;
vec2 rotate2D(vec2 value,float angle){
    float s=sin(angle);
    float c=cos(angle);
    mat2 m=mat2(c,s,-s,c);
    return (m*value);
}
void main(){
    vec3 newPosition=position;
    float twist=texture(uPerlinTexture,vec2(0.5,uv.y*0.2 -uTime*0.005)).r;
    //twist
    float angle=twist*10.0;
    newPosition.xz=rotate2D(newPosition.xz,angle);
    //wind
    vec2 windoffset=vec2(
        texture(uPerlinTexture,vec2(0.25,uTime*0.01)).r-0.5,
        texture(uPerlinTexture,vec2(0.75,uTime*0.01)).r-0.5
        );
        windoffset*=pow(uv.y,2.0)*10.0;
        newPosition.xz+=windoffset;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(newPosition,1.0);
    vUv=uv;
}