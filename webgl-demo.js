var crossing = {1:false, 2:false, 3:false, 4:false, 5:false} , check_crossed = {1:false, 2:false, 3:false, 4:false, 5:false}

obstacles = []

var a = 1.0;
var map = {65 : false, 68 : false, 32 : false};

class Obstacle 
{
  constructor(x, y, z, type)
  {
    var output;
    this.type = type;
    this.posz = -z;
    this.translateX = this.translateY = this.translateZ = 0.0;
    this.buffers = '';
    this.rotationX = this.rotationY = this.rotationZ = 0.0;

    if (type==1) output = obstacle1(x, y, z);
    if (type==2) output = obstacle2(x, y, z);
    if (type==3) output = obstacle3(x, y, z);
    if (type==4) output = obstacle4(x, y, z);
    if (type==5) output = obstacle5(x, y, z);

    this.indices = output[2];
    this.vertexCount = function() 
    {
      return this.indices.length;
    }
    this.positions = output[0];
    this.colors = output[1];

  }
}

function generateObstacle()
{
  obstacles = [];

  var x = -50.0;

  obs1 = new Obstacle(0.0, 0.0, x-20.0*0, 1);
  obstacles.push(obs1);

  obs2 = new Obstacle(0.0, 0.0, x-20.0*1, 2);
  obstacles.push(obs2);

  obs3 = new Obstacle(0.0, 0.0, x-20.0*2, 3);
  obstacles.push(obs3);

  obs4 = new Obstacle(0.0, 0.0, x-20.0*3, 4);
  obstacles.push(obs4);

  obs5 = new Obstacle(0.0, 0.0, x-90.0, 5);
  obstacles.push(obs5);

  obs6 = new Obstacle(0.0, 0.0, 4*x, 1);
  obstacles.push(obs6);

  obs7 = new Obstacle(0.0, 0.0, 4*x-20.0, 2);
  obstacles.push(obs7);

  obs8 = new Obstacle(0.0, 0.0, 5*x+10, 3);
  obstacles.push(obs8);
}

const faceColors = [
  [a,a,a,a],    // Front face: white
  [a,0,0,a],    // Back face: red
  [0,a,0,a],    // Top face: green
  [0,0,a,a],    // Bottom face: blue
  [a,a,0,a],    // Right face: yellow
  [a,0,a,a],    // Left face: purple
  [a,0.647,0,a],    // Left face: orange
  [a,0.4117,0.7058,a],    // Left face: pink
  [0,0,0,a]
];

var tunnel = 
{
  'speed' : 1.0,
  'speed_y' : 0.0,
  'acc_y' : 0.05,
  'buffers' : '',
  'radius' : 2.0,
  'cubeRotation' : 0.0,
  'positions' : [],
  'colors' : [],
  'rotationX' : 0.0,
  'rotationY' : 0.0,
  'rotationZ' : 0.0,
  'indices' : [],
  'translateX' : 0.0,
  'translateY' : 1.0,
  'translateZ' : 0.0,
  'num_oct' : 19,
  'num_oct_bw' : 19,
  'num_oct_ret_bw' : 19,
  'num_oct_ret_clrd' : 19,

  'num_octagons' : function() 
  {
    return this.num_oct + this.num_oct_bw + this.num_oct_ret_clrd + this.num_oct_ret_bw;
  },

  'vertexCount' : function() 
  {
    return this.num_octagons() * 48;
  }
}

onkeydown = onkeyup = function (event) 
{
    map[event.keyCode] = event.type == 'keydown';
}
main();

// mousetrap.bind('left')
//
// Start here
//
function main() 
{
  const canvas = document.querySelector('#glcanvas');

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) 
    {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) 
  {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
{

  var def_length = 2.0;
  var length = -152*def_length;
  var ang = Math.PI/4.0;
  var curr = ang/2.0;
  var k=0;

  for(var i = 0; i < tunnel.num_octagons() ; i++)
  {
    length = length + 2*def_length;

    for (var j=0; j<8; j++)
    {

      var trcos = tunnel.radius * Math.cos(curr);
      var trsin = tunnel.radius * Math.sin(curr);

      var trcosang = tunnel.radius * Math.cos(curr+ang);
      var trsinang = tunnel.radius * Math.sin(curr+ang);

      curr+=ang;

      tunnel.positions[k++] = trcos;
      tunnel.positions[k++] = trsin;
      tunnel.positions[k++] = length - def_length;

      tunnel.positions[k++] = trcos;
      tunnel.positions[k++] = trsin;
      tunnel.positions[k++] = length + def_length;

      tunnel.positions[k++] = trcosang;
      tunnel.positions[k++] = trsinang;
      tunnel.positions[k++] = length + def_length;


      tunnel.positions[k++] = trcosang;
      tunnel.positions[k++] = trsinang;
      tunnel.positions[k++] = length - def_length;

    }
  }
    // Convert the array of colors into a table for all the vertices.

  var flag=0;
  var ind=0;
  var j=0;
  var k = 0; 
  for (; j < tunnel.num_octagons() * 8; ++j) 
  {
    // Repeat each color four times for the four vertices of the face
    // colored first the octagons at the end of tunnel
    var var1 = tunnel.num_oct+tunnel.num_oct_ret_bw+tunnel.num_oct_ret_clrd;
    var var2 = tunnel.num_oct_ret_bw+tunnel.num_oct_ret_clrd;
    var var3 = tunnel.num_oct_ret_clrd;

    if((j/8 <= var1 && j/8 > var2) || (j/8 <= var3)) 
    {
      ind = ind+1;
      ind = ind%8;
      tunnel.colors = tunnel.colors.concat(faceColors[ind], faceColors[ind], faceColors[ind], faceColors[ind]);
      if (j%8 != 7)
      {
        ind = ind + 2;
      }
    } 
    else
    {
      tunnel.colors = tunnel.colors.concat(faceColors[flag], faceColors[flag], faceColors[flag], faceColors[flag]);
      if(j%8 != 7)
      {
        if (flag==0) flag=8;
        else flag=0;
      }
    }
  }
  var len = tunnel.num_octagons();
  for (var j=0; j<len; j++)
  {
    for(var i=0;i<8;i++)
    {
      tunnel.indices[k] = j*32 + i*4 ;
      tunnel.indices[k+1] = j*32 + i*4 +1;
      tunnel.indices[k+2] = j*32 + i*4 +2;
      tunnel.indices[k+3] = j*32 + i*4 ;
      tunnel.indices[k+4] = j*32 + i*4 +2;
      tunnel.indices[k+5] = j*32 + i*4 +3;
      k = k+6;
    } 
  }

  tunnel.buffers = initBuffers(gl, tunnel);
}
  generateObstacle();

  var then = 0,i=0;

  for(;i<obstacles.length;i++)
    {
      obstacles[i].buffers = initBuffers(gl, obstacles[i]);
    }

  // Draw the scene repeatedly
  function render(now) {
    now = now*0.001;  // convert to seconds
    var i = 0;
    const deltaTime = now - then;
    then = now;

    for(;i<5;i++)
    {
      var b = false;

    	if (check_crossed[i] == true) 
        continue;

    	if(tunnel.translateZ > obstacles[i].posz)
        b = true;

    	crossing[i] ^= b;

      b = false;

    	check_crossed[i] = crossing[i];
    }

    if (map[65])
    {
      var len = obstacles.length;
      tunnel.rotationZ = tunnel.rotationZ + Math.PI/64; // a key
      var i=0;
      for(;i<len;i++)
         obstacles[i].rotationZ = obstacles[i].rotationZ + Math.PI/64;
    }

    if (map[68] == true)
    {
      tunnel.rotationZ = tunnel.rotationZ - Math.PI/64; // d key
      var i =0;
      for(;i<obstacles.length;i++) 
          obstacles[i].rotationZ = obstacles[i].rotationZ - Math.PI/64;
    }

    if (map[32] == true && tunnel.speed_y == 0.0)
          tunnel.speed_y = -0.3; // space
    drawScene(gl, programInfo);
    tunnel.translateZ = tunnel.translateZ + deltaTime*10*tunnel.speed;

    if(tunnel.translateZ > 160)
    {
    	tunnel.translateZ = tunnel.translateZ + 4.5;
      check_crossed[0] = check_crossed[1] = check_crossed[2] = 0;
      check_crossed[3] = check_crossed[4] = check_crossed[5] = 0;
      tunnel.translateZ = tunnel.translateZ %152;
    }
    tunnel.speed = tunnel.speed + 0.001;
    tunnel.translateY = tunnel.translateY + tunnel.speed_y;

    if (tunnel.speed_y < 0.0)
       tunnel.speed_y = tunnel.speed_y + tunnel.acc_y;

    var i =0;
    var len = obstacles.length;

    if (tunnel.translateY > 1.0)
    {
      tunnel.speed_y = 0.0;
      tunnel.translateY = 1.0;
    }
   
    for(; i< len; i++)
    {
      obstacles[i].translateY = tunnel.translateY;
      obstacles[i].translateZ = tunnel.translateZ;
    }
   
    if(crossing[0] == true)
    {

	    var val2 = obstacles[0].rotationZ * 180/Math.PI + 100*360;
      val2 = val2%180;

   		var c1 = val2 < 20 || val2 > 160;

   		if (c1 == true)
         alert("detected");
      crossing[0] = false;
   	}

   	if(crossing[1] == true)
    {
   		if (tunnel.translateY == 1.00) 
          alert("detected");
      crossing[1] = false;
   	}
   	if(crossing[2])
    {
      startang = 60.0;

   		var val2 = obstacles[2].rotationZ * 180/Math.PI + 100*360;
      val2 = val2 % 360;

      if (val2 > startang && val2 < startang + 180.0) 
          alert("detected");

      crossing[2] = false;

   		console.log("startang", startang, "val2", val2);
   	}

    if(crossing[3])
    {
	    var val2 = obstacles[3].rotationZ * 180/Math.PI + 100*360;
      val2 = val2 % 180;

   		var c1 = val2 < 60 || val2 > 80;

   		if (c1 == true) 
          alert("detected");
      crossing[3] = false;
   	}
    if(crossing[4]){
	    var val2 = obstacles[4].rotationZ * 180/Math.PI + 100*360;
	    val2 = val2 % 180;

   		var c1 = val2 > 20 && val2 < 65;

   		if (c1 == true)
          alert("detected");
      crossing[4] = false;
   	}
    obstacles[0].rotationZ=obstacles[0].rotationZ + Math.PI/240;
    obstacles[5].rotationZ=obstacles[0].rotationZ + Math.PI/240;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.


function initBuffers(gl, struct) {

  // Create a buffer for the cube's vertex positions.
  // console.log(struct)
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(struct.positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.



  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(struct.colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(struct.indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

//
// Draw the scene.
//

function callScene(gl, programInfo, struct) {

  const projectionMatrix = mat4.create();
  const zFar = 100.0;
  const zNear = 0.1;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const fieldOfView = 45 * Math.PI / 180;   // in radians

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  var modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [struct.translateX, struct.translateY, struct.translateZ]);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              struct.rotationZ,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              struct.rotationY,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              struct.rotationX,// amount to rotate in radians
              [1, 0, 0]);       // axis to rotate around (X)


  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, struct.buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, struct.buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, struct.buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = struct.vertexCount();
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

}

function drawScene(gl, programInfo) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  callScene(gl, programInfo, tunnel);
  for (var i=0; i<obstacles.length; i++){
    callScene(gl, programInfo, obstacles[i]);
  }
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.

  // Update the rotation for the next draw

}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}