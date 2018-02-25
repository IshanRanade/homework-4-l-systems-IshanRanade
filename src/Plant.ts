import {vec3, vec4, mat4, mat3, quat} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';
import LSystem from './LSystem';
import Turtle from './Turtle';

class Plant {
  translationsBark: number[] = [];
  quaternionsBark: number[] = [];
  scalesBark: number[] = [];
  barkInstanceCount: number = 0;

  translationsLeaf: number[] = [];
  quaternionsLeaf: number[] = [];
  scalesLeaf: number[] = [];
  leafInstanceCount: number = 0;

  lSystem: LSystem;

  meshes: any;

  constructor(center: vec3, meshes: any) {
    let axiom: string = "FFFFFFFFX";
    let grammar : { [key:string]:string; } = {};
    grammar["X"] = "FFF[+F+X][-FFFFFX][+FFFF-+XFFFF]";
    this.lSystem = new LSystem(axiom, grammar);
    this.meshes = meshes;
  }

  rand(x: vec3) {
    let n: number = x[0] * 137 + x[1] * 122237 + x[2] * 13;
    return Math.abs(Math.sin(n) * 43758.5453123) - Math.floor(Math.abs(Math.sin(n) * 43758.5453123));
  }

  createTree() {
    let lSystemString: string = this.lSystem.generateLSystemString(6);
    //let lSystemString: string = "FFFFFFFFFF++FF";

    let barkName = "bark";
    let cylinderMeshSize = this.meshes[barkName].indices.length;

    let minY: number =  1000000000000;
    let maxY: number = -1000000000000;
    for(let i: number = 0; i < this.meshes[barkName].vertices.length;  i+=3) {
      if(this.meshes[barkName].vertices[i+1] < minY) {
        minY = this.meshes[barkName].vertices[i+1];
      }

      if(this.meshes[barkName].vertices[i+1] > maxY) {
        maxY = this.meshes[barkName].vertices[i+1];
      }
    }

    let originalCylinderHeight = maxY - minY;

    // let baseTrans: mat4 = mat4.create();
    // mat4.scale(baseTrans, baseTrans, vec3.fromValues(0.35,0.05,0.35)); 
    // mat4.translate(baseTrans, baseTrans, vec3.fromValues(0,-1.5,0));

    let turtles: Turtle[] = [];
    turtles.push(new Turtle(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), vec3.fromValues(5,2,5), originalCylinderHeight, vec3.fromValues(0,1,0), quat.fromValues(0,0,0,1), 0));

    let turtle: Turtle = turtles[0];

    for(let i: number = 0; i < lSystemString.length; ++i) {
      let c: string = lSystemString[i];

      if(c == "F") {
        turtle.rotate(vec3.fromValues(0,0,1), (Math.random() * 5));
        turtle.rotate(vec3.fromValues(1,0,0),  (Math.random()) * 5);

        if(turtle.aim[1] < 0) {
          turtle.reverseAimY();
        }

        turtle.scale[0] *= 0.97;
        turtle.scale[1] *= 0.97;
        turtle.scale[2] *= 0.97;

        this.translationsBark.push(turtle.position[0], turtle.position[1], turtle.position[2], 0);
        this.quaternionsBark.push(turtle.quaternion[0], turtle.quaternion[1], turtle.quaternion[2], turtle.quaternion[3]);
        this.scalesBark.push(turtle.scale[0], turtle.scale[1], turtle.scale[2], 1);
        this.barkInstanceCount += 1

        if(turtle.level > 5) {
          // this.translationsLeaf.push(turtle.position[0], turtle.position[1], turtle.position[2], 0);
          // this.quaternionsLeaf.push(turtle.quaternion[0], turtle.quaternion[1], turtle.quaternion[2], turtle.quaternion[3]);
          // this.scalesLeaf.push(0.1,0.1,0.1,1);
          // this.leafInstanceCount += 1;
        }

        turtle.move();
      } else if(c == "[") {
        let newTurtle: Turtle = turtle.copy();
        newTurtle.level += 1;
        turtles.push(newTurtle);

        turtle.scale[0] *= 0.7;
        turtle.scale[1] *= 0.9;
        turtle.scale[2] *= 0.7;

        // this.translationsLeaf.push(turtle.position[0], turtle.position[1], turtle.position[2], 0);
        // this.quaternionsLeaf.push(turtle.quaternion[0], turtle.quaternion[1], turtle.quaternion[2], turtle.quaternion[3]);
        // this.scalesLeaf.push(0.1,0.1,0.1,1);
        // this.leafInstanceCount += 1;

        //vec3.scale(turtle.scale, turtle.scale, 0.6);
      } else if(c == "]") {
        turtle = turtles.pop();
        turtle.rotate(vec3.fromValues(0,0,1),  (Math.random() - 0.5) * 90);
      } else if(c == "+") {
        let tan: vec3 = turtle.rotateVectorByQuat(vec3.fromValues(1,0,0));
        let bit: vec3 = turtle.rotateVectorByQuat(vec3.fromValues(0,0,1));
        turtle.rotate(tan, (Math.random() - 0.5) * 30);
        turtle.rotate(bit, (Math.random() - 0.5) * 30);
      } else if(c == "-") {
        let tan: vec3 = turtle.rotateVectorByQuat(vec3.fromValues(1,0,0));
        let bit: vec3 = turtle.rotateVectorByQuat(vec3.fromValues(0,0,1));
        turtle.rotate(tan, (Math.random() - 0.5) * 360);
        turtle.rotate(bit, (Math.random() - 0.5) * 360);
      }
    }
  }
};

export default Plant;