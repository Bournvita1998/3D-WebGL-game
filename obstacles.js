function get_indices(num_faces){
  var indices = [], k=0;
  for(var i=0;i<num_faces;i++){
    indices[k] = i*4 ;
    indices[k+1] = i*4 +1;
    indices[k+2] = i*4 +2;
    indices[k+3] = i*4 ;
    indices[k+4] = i*4 +2;
    indices[k+5] = i*4 +3;
    k=k+6;
  } 
  return indices;
}

function obstacle1(x,y,z){
  indices = get_indices(6);
  var colors = [];
  var c = [1.0, 0.0, 0.0, 1.0];
  for(var i=0;i<6;i++) 
  {
    colors = colors.concat(c, c, c, c);
  }
  var positions = [
    // Front face
    -0.5 + x, -2.0 + y, z,
     0.5 + x, -2.0 + y, z,
     0.5 + x,  2.0 + y, z,
    -0.5 + x,  2.0 + y, z,

    // Back face
    -0.5 + x, -2.0 + y, z,
    -0.5 + x,  2.0 + y, z,
     0.5 + x,  2.0 + y, z,
     0.5 + x, -2.0 + y, z,

    // Top face
    -0.5 + x,  2.0 + y, z,
    -0.5 + x,  2.0 + y, z,
     0.5 + x,  2.0 + y, z,
     0.5 + x,  2.0 + y, z,

    // Bottom face
    -0.5 + x, -2.0 + y, z,
     0.5 + x, -2.0 + y, z,
     0.5 + x, -2.0 + y, z,
    -0.5 + x, -2.0 + y, z,

    // Right face
     0.5 + x, -2.0 + y, z,
     0.5 + x,  2.0 + y, z,
     0.5 + x,  2.0 + y, z,
     0.5 + x, -2.0 + y, z,

    // Left face
    -0.5 + x, -2.0 + y, z,
    -0.5 + x, -2.0 + y, z,
    -0.5 + x,  2.0 + y, z,
    -0.5 + x,  2.0 + y, z,
  ];
  return [positions, colors, indices];
}

function obstacle2(x,y,z){
  var c = [1.0, 0.0, 0.0, 1.0];
  var positions = [];
  var ang = Math.PI/4.0;
  var curr = ang/2.0;
  var k=0;
  var colors = [];

  radius1 = 2.0;
  radius2 = 1.5;
  indices = get_indices(16);
  ylength = 2.0;
  xwidth = 0.2;

  for(var i=0;i<16;i++) 
  {
      colors = colors.concat(c, c, c, c);
  }

  for(var i=0; i < 2; i++)
  {
    for (var j=0; j<8; j++)
    {
      var r1cos = radius1 * Math.cos(curr);
      var r1sin = radius1 * Math.sin(curr);
      var r2cos = radius2 * Math.cos(curr);
      var r2sin = radius2 * Math.sin(curr);

      var r1cosang = radius1 * Math.cos(curr+ang);
      var r1sinang = radius1 * Math.sin(curr+ang);
      var r2cosang = radius2 * Math.cos(curr+ang);
      var r2sinang = radius2 * Math.sin(curr+ang);

      positions[k++] = x + r1cos;
      positions[k++] = y + r1sin;
      positions[k++] = z;

      positions[k++] = x + r1cosang;
      positions[k++] = y + r1sinang;
      positions[k++] = z;

      positions[k++] = x + r2cosang;
      positions[k++] = y + r2sinang;
      positions[k++] = z;

      positions[k++] = x + r2cos;
      positions[k++] = y + r2sin;
      positions[k++] = z;
      curr+=ang;
    }
    z-=0.05;
  }
  return [positions, colors, indices];
}

function obstacle3(x,y,z){
  radius = 2.2;
  var positions = [];
  var indices = [];
  var colors = [];
  var k=0;
  var ang = Math.PI/4.0;
  var curr = ang/2.0;
  var c = [1.0, 0.0, 0.0, 1.0];
  for(var i=0;i<4;i++) 
  {
    colors = colors.concat(c, c, c);
  }

  for (var j=0; j<4; j++){
    var rcos = radius * Math.cos(curr);
    var rsin = radius * Math.sin(curr);

    positions[k++] = x + rcos;
    positions[k++] = y + rsin;
    positions[k++] = z;

    var rcosang = radius * Math.cos(curr+ang);
    var rsinang = radius * Math.sin(curr+ang);

    positions[k++] = x + rcosang;
    positions[k++] = y + rsinang;
    positions[k++] = z;

    curr+=ang;

    positions[k++] = x;
    positions[k++] = y;
    positions[k++] = z;
  }

  k=0;
  for(var i=0;i<4;i++)
  {
    indices[k] = i*3;
    indices[k+1] = i*3+1;
    indices[k+2] = i*3+2;
    k=k+3;
  }    
  return [positions, colors, indices];
}


function obstacle4(x,y,z){
  var ang = Math.PI/4.0;
  var curr = ang/2.0, k=0;
  var c = [1.0, 0.0, 0.0, 1.0];
  radius = 2.0;
  var positions = [];
  var offset = 0.45;
  var indices = [];
  var colors = [];
  for(var i=0;i<8;i++) 
  {
    colors = colors.concat(c, c, c);
  }

  for(var i=0;i<2;i++)
  {
    for (var j=0; j<4; j++)
    {
      var rcos = radius * Math.cos(curr) ;
      var rsin = radius * Math.sin(curr) ;
      var rcosang = radius * Math.cos(curr+ang) ;
      var rsinang = radius * Math.sin(curr+ang) ;

      positions[k++] = x + rcos;
      positions[k++] = y + rsin + offset;
      positions[k++] = z;

      positions[k++] = x + rcosang;
      positions[k++] = y + rsinang + offset;
      positions[k++] = z;

      curr+=ang;

      positions[k++] = x;
      positions[k++] = y+ offset;
      positions[k++] = z;

    }
    offset*=-1
  }
  k=0;
  for(var i=0;i<8;i++)
  {
    indices[k] = i*3;
    indices[k+1] = i*3+1;
    indices[k+2] = i*3+2;
    k=k+3;
  }    
  return [positions, colors, indices];
}

function obstacle5(x,y,z){
  var positions = [];
  var ang = Math.PI;
  var curr = ang/8.0;
  var k=0;
  var c = [1.0, 0.0, 0.0, 1.0];
  radius = 2.0;
  var indices = [];
  var colors = [];

  for(var i=0;i<2;i++) 
  {
    colors = colors.concat(c, c, c);
  }

  for (var j=0; j<4; j++)
  {

    var rcos = radius * Math.cos(curr) ;
    var rsin = radius * Math.sin(curr) ;

    positions[k++] = x + rcos ;
    positions[k++] = y + rsin;
    positions[k++] = z;

    var rcospiby4 = radius * Math.cos(curr+Math.PI/4) ;
    var rsinpiby4 = radius * Math.sin(curr+Math.PI/4) ;

    positions[k++] = x + rcospiby4;
    positions[k++] = y + rsinpiby4;
    positions[k++] = z;

    curr+=ang;

    positions[k++] = x;
    positions[k++] = y;
    positions[k++] = z;

  }
  k=0;
  for(var i=0;i<2;i++)
  {
    indices[k] = i*3;
    indices[k+1] = i*3+1;
    indices[k+2] = i*3+2;
    k=k+3;
  }
  return [positions, colors, indices];
}

