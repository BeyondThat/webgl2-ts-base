window.onload = function () {
    const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
    const gl: WebGL2RenderingContext = canvas.getContext("webgl2");

    canvas.style.outline = "1px solid black";
    canvas.width = 640;
    canvas.height = 480;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.7, 0.7, 0.7, 1);
    gl.lineWidth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = `#version 300 es

in vec4 a_position;

out vec2 vColor;
void main() {

  gl_Position = a_position;
  vColor = a_position.xy;
}
`;

    const fragmentShaderSource = `#version 300 es

precision highp float;

out vec4 outColor;
in vec2 vColor;

void main() {

  outColor = vec4(vColor + .5, 0, 1);
}
`;
    let vertices = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0];

    function createShader(
        gl: WebGL2RenderingContext,
        sourceCode: string,
        type: WebGLRenderingContextBase["VERTEX_SHADER" | "FRAGMENT_SHADER"],
    ): WebGLShader {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            throw `Could not compile WebGL program. \n\n${info}`;
        }
        return shader;
    }

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(
        gl,
        fragmentShaderSource,
        gl.FRAGMENT_SHADER,
    );

    function createProgram(
        gl: WebGL2RenderingContext,
        vs: WebGLShader,
        fs: WebGLShader,
    ): WebGLProgram {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            throw `Could not link WebGL program. \n\n${info}`;
        }
        return program;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
